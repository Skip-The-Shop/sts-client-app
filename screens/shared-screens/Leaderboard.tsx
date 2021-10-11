import React, {useEffect, useState, useContext, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import WellnessChallengeService from '../../services/WellnessChallengeService';
import UserService from '../../services/UserService';
import {HeaderBackButton} from '@react-navigation/stack';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import {COLORS} from '../../constants';
import gold from '../../images/gold.png';
import silver from '../../images/silver.png';
import bronze from '../../images/bronze.png';

const Leaderboard = ({navigation}: {navigation: any}) => {
  const userService = new UserService();
  const wellnessChallengeService = new WellnessChallengeService();
  const [challenges, setChallenges] = useState([]);
  const [sortChallenge, setSortChallenge] = useState(0);
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    const res = await userService.getUsersByCompany(user.companyID);
    setUsers([...res]);
    getChallenges(res);
  }, []);

  const getChallenges = useCallback(async usersList => {
    var userList = usersList;
    while (userList.length > 0) {
      var list = userList.splice(0, 20);
      list.forEach(async client => {
        const res = await wellnessChallengeService.getWellnessChallengeByUser(
          client.id,
        );
        res.forEach(challenge => {
          var current = new Date();
          const currentDate = current.toLocaleString('default', {
            year: 'numeric',
            month: 'long',
          });
          if (
            challenge.date === currentDate &&
            !challenges.some(x => x.id === challenge.id)
          ) {
            setChallenges(prev => [...prev, challenge]);
          }
          setSortChallenge(sortChallenge + 1);
        });
      });
    }
  }, []);

  const getUser = id => {
    const {firstName, lastName} = users.find(x => x.id === id);
    return `${firstName} ${lastName}`;
  };

  const getSortedList = () => {
    var fullList = [...challenges];
    fullList = fullList.sort((a, b) => {
      var aChecked = 0;
      var bChecked = 0;
      const aLength = a.answers.mind.length + a.answers.body.length;
      const bLength = b.answers.mind.length + b.answers.body.length;
      a.answers.mind.forEach(answer => {
        if (answer.checked) {
          aChecked++;
        }
      });
      a.answers.body.forEach(answer => {
        if (answer.checked) {
          aChecked++;
        }
      });
      b.answers.mind.forEach(answer => {
        if (answer.checked) {
          bChecked++;
        }
      });
      b.answers.body.forEach(answer => {
        if (answer.checked) {
          bChecked++;
        }
      });
      const aPercent = (aChecked / aLength) * 100;
      const bPercent = (bChecked / bLength) * 100;
      if (aPercent > bPercent) {
        return -1;
      }
      if (aPercent === bPercent) {
        return 0;
      }
      return 1;
    });
    fullList = fullList.sort((a, b) => {
      if (a.dateFinished && b.dateFinished) {
        if (a.dateFinished > b.dateFinished) {
          return -1;
        }
        return 1;
      } else if (a.dateFinished && !b.dateFinished) {
        return -1;
      } else if (b.dateFinished && !a.dateFinished) {
        return 1;
      } else {
        return 0;
      }
    });
    return fullList;
  };

  const getPosition = num => {
    var suffix = '';
    const x = num % 10;
    switch (x) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
        break;
    }
    return num + suffix;
  };

  const hasTasks = id => {
    var finishedTasks = false;
    const currentUser = challenges.find(x => x.userID === id);
    currentUser.answers.mind.forEach(answer => {
      if (answer.checked) {
        finishedTasks = true;
      }
    });
    currentUser.answers.body.forEach(answer => {
      if (answer.checked) {
        finishedTasks = true;
      }
    });
    return finishedTasks;
  };

  const getTasks = answers => {
    var finished = 0;
    answers.mind.forEach(x => {
      if (x.checked) {
        finished++;
      }
    });
    answers.body.forEach(x => {
      if (x.checked) {
        finished++;
      }
    });
    return finished === 1 ? `${finished} Task` : `${finished} Tasks`;
  };

  useEffect(() => {
    getUsers();
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => navigation.goBack()}
          style={styles.headerBack}
        />
      ),
    });
  }, []);

  useEffect(() => {
    if (getSortedList().length > 2) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerTitle}>
            <View style={styles.side}>
              <Image source={silver} />
              <Text style={styles.circle}>2</Text>
              <Text style={styles.text}>
                {getUser(getSortedList()[1].userID).split(' ')[0]}{' '}
                {getUser(getSortedList()[1].userID).split(' ')[1].charAt(0)}.
              </Text>
            </View>
            <View style={styles.first}>
              <Image source={gold} />
              <Text style={styles.firstCircle}>1</Text>
              <Text style={styles.text}>
                {getUser(getSortedList()[0].userID).split(' ')[0]}{' '}
                {getUser(getSortedList()[0].userID).split(' ')[1].charAt(0)}.
              </Text>
            </View>
            <View style={styles.side}>
              <Image source={bronze} />
              <Text style={styles.circle}>3</Text>
              <Text style={styles.text}>
                {getUser(getSortedList()[2].userID).split(' ')[0]}{' '}
                {getUser(getSortedList()[2].userID).split(' ')[1].charAt(0)}.
              </Text>
            </View>
          </View>
        ),
      });
    }
  }, [sortChallenge, users, navigation, challenges, getUser, getSortedList]);

  if (!user) return null;

  return (
    <ScrollView>
      <View style={styles.currentPosition}>
        <Text style={styles.currentText}>
          You Currently Rank{' '}
          {getPosition(
            getSortedList().findIndex(x => x.userID === user.id) + 1,
          )}
        </Text>
        <Text style={styles.currentTasks}>
          {getSortedList().find(x => x.userID === user.id) &&
            getTasks(getSortedList().find(x => x.userID === user.id).answers)}
        </Text>
      </View>
      {getSortedList().map((challenge, key) => {
        if (key < 10 && hasTasks(challenge.userID)) {
          return (
            <View>
              <View style={styles.container}>
                <Text style={styles.number}>{getPosition(key + 1)}</Text>
                <Text style={styles.name}>{getUser(challenge.userID)}</Text>
                <Text style={styles.tasks}>{getTasks(challenge.answers)}</Text>
              </View>
              <Divider style={styles.divider} orientation="horizontal" />
            </View>
          );
        }
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    width: 350,
    marginRight: 35,
    textAlign: 'center',
    marginTop: 50,
    flexDirection: 'row',
  },
  headerBack: {
    marginTop: -170,
  },
  currentPosition: {
    flexDirection: 'row',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'white',
    height: 45,
    borderRadius: 10,
    marginTop: 35,
    marginBottom: 35,
  },
  currentTasks: {
    fontSize: 13,
    position: 'absolute',
    right: 10,
    top: 12,
  },
  currentText: {
    color: '#495A70',
    fontSize: 18,
    marginTop: 8,
    marginLeft: 15,
  },
  container: {
    flexDirection: 'row',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  number: {
    color: COLORS.BLUE,
    fontSize: 18,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    position: 'absolute',
    left: 60,
  },
  tasks: {
    fontSize: 13,
    position: 'absolute',
    right: 10,
    top: 5,
  },
  divider: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 3,
  },
  first: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 25,
  },
  side: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 57,
  },
  circle: {
    backgroundColor: 'white',
    width: 25,
    height: 25,
    borderRadius: 50,
    textAlign: 'center',
    color: COLORS.BLUE,
    fontWeight: 'bold',
    paddingTop: 2,
    position: 'absolute',
    top: 63,
    left: 23,
  },
  firstCircle: {
    backgroundColor: 'white',
    width: 25,
    height: 25,
    borderRadius: 50,
    textAlign: 'center',
    color: COLORS.BLUE,
    fontWeight: 'bold',
    paddingTop: 2,
    position: 'absolute',
    top: 105,
    left: 47,
  },
});

export default Leaderboard;
