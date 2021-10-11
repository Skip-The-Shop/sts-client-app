import React, {useState, useEffect} from 'react';
import {Modal, View, Pressable, Text, StyleSheet, Image} from 'react-native';
import filterWhite from '../../images/filterwhite.png';
import {Icon} from 'react-native-elements';
import {COLORS} from '../../constants';
import BodyPartService from '../../services/BodyPartService';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import TagService from '../../services/TagService';
import {ScrollView} from 'react-native-gesture-handler';

const Filter = ({filterType, setFilter}) => {
  const tagService = new TagService();
  const [open, setOpen] = useState(false);
  const [bodyParts, setBodyParts] = useState([]);
  const [tags, setTags] = useState([]);
  const [options, setOptions] = useState([]);
  console.log(filterType);

  const isChecked = id => {
    if (options.includes(id)) {
      return true;
    }
    return false;
  };

  const handlePress = id => {
    var opts = options;
    if (!opts.includes(id)) {
      opts.push(id);
    } else {
      opts.splice(opts.indexOf(id), 1);
    }
    setOptions([...opts]);
  };

  const handleSubmit = () => {
    setFilter(options);
    setOpen(false);
  };

  useEffect(async () => {
    if (filterType === 'Tutorials') {
      const bodyPartService = new BodyPartService();
      const response = await bodyPartService.getAllAWSTags();
      setBodyParts([...response]);
    } else if (filterType !== 'Videos') {
      var res;
      switch (filterType) {
        case 'Recipes':
          res = await tagService.getAllAWSTagsbyMainCategory(
            '8e21ccb3-7c88-44fa-8415-cca9d931fc15',
          );
          break;
        default:
          res = await tagService.getAllAWSTagsbyMainCategory(
            '41eff070-9592-4e07-83a4-c398a9acf5d3',
          );
          break;
      }
      setTags([...res]);
    }
  }, []);

  return (
    <View>
      <Pressable
        onPress={() => {
          setOpen(true);
        }}
        style={styles.button}>
        <Image style={{height: 25, width: 25, marginTop: 4, marginLeft: 30}} source={filterWhite} />
        <Text style={styles.text}>Filter</Text>
      </Pressable>
      <Modal
        visible={open}
        onRequestClose={() => {
          setOpen(false);
        }}>
        <View>
          <Pressable style={styles.exit} onPress={() => setOpen(false)}>
            <Text style={styles.exitButton}>Cancel</Text>
          </Pressable>
          {filterType === 'Tutorials' && (
            <ScrollView style={styles.scrollView}>
              <Text style={styles.scrollText}>Body Part</Text>
              <View style={styles.check}>
                {bodyParts.map((part, key) => {
                  return (
                    <BouncyCheckbox
                      style={
                        isChecked(part.id) ? styles.checkedBox : styles.checkbox
                      }
                      textStyle={
                        isChecked(part.id)
                          ? {color: 'white', textDecorationLine: 'none'}
                          : {textDecorationLine: 'none'}
                      }
                      iconStyle={styles.iconStyle}
                      text={part.tag}
                      key={key}
                      onPress={() => {
                        handlePress(part.id);
                      }}
                    />
                  );
                })}
              </View>
            </ScrollView>
          )}
          {filterType === 'Videos' && (
            <ScrollView style={styles.scrollView}>
              <Text style={styles.scrollText}>Difficulty</Text>
              <View style={styles.check}>
                {['Beginner', 'Intermediate', 'Advanced'].map((exp, key) => {
                  return (
                    <BouncyCheckbox
                      style={
                        isChecked(exp) ? styles.checkedBox : styles.checkbox
                      }
                      textStyle={
                        isChecked(exp)
                          ? {color: 'white', textDecorationLine: 'none'}
                          : {textDecorationLine: 'none'}
                      }
                      iconStyle={styles.iconStyle}
                      text={exp}
                      key={key}
                      onPress={() => {
                        handlePress(exp);
                      }}
                    />
                  );
                })}
              </View>
            </ScrollView>
          )}
          {filterType !== 'Tutorials' && filterType !== 'Videos' && (
            <ScrollView style={styles.scrollView}>
              <Text style={styles.scrollText}>Difficulty</Text>
              <View style={styles.check}>
                {tags.map((tag, key) => {
                  return (
                    <BouncyCheckbox
                      style={
                        isChecked(tag.id) ? styles.checkedBox : styles.checkbox
                      }
                      textStyle={
                        isChecked(tag.id)
                          ? {color: 'white', textDecorationLine: 'none'}
                          : {textDecorationLine: 'none'}
                      }
                      iconStyle={styles.iconStyle}
                      text={tag.tag}
                      key={key}
                      onPress={() => {
                        handlePress(tag.id);
                      }}
                    />
                  );
                })}
              </View>
            </ScrollView>
          )}
          <Pressable onPress={handleSubmit} style={styles.button2}>
            <Text style={styles.text2}>See Results</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.BLUE,
    width: '50%',
    position: 'absolute',
    bottom: 10,
    left: 100,
    height: 35,
    borderRadius: 25,
    flexDirection: 'row',
  },
  button2: {
    backgroundColor: COLORS.BLUE,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 50,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
  },
  icon: {
    marginTop: 2,
    marginLeft: 30,
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginTop: 5,
    textAlign: 'center',
    width: '45%',
  },
  text2: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center',
    width: '100%',
  },
  exit: {
    position: 'absolute',
    left: 15,
    top: 25,
  },
  exitButton: {
    fontSize: 16,
  },
  scrollView: {
    height: '75%',
    marginTop: 75,
  },
  scrollText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
    marginBottom: 25,
  },
  check: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 5,
    marginBottom: 5,
    width: '30%',
    backgroundColor: 'lightgrey',
    height: 45,
    borderRadius: 10,
  },
  checkedBox: {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 5,
    marginBottom: 5,
    width: '30%',
    backgroundColor: COLORS.BLUE,
    height: 45,
    borderRadius: 10,
  },
  iconStyle: {
    display: 'none',
  },
});

export default Filter;
