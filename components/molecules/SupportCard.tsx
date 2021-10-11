import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Linking} from 'react-native';
import {Icon} from 'react-native-elements';

interface SupportCard {
  title: string;
  index: number;
  number: string;
  type: string;
}

const SupportCard = ({title, index, number, type = 'phone'}: SupportCard) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        if (type === 'phone') {
          Linking.openURL(`tel:${number}`);
        } else {
          Linking.openURL(`mailto:${number}`);
        }
      }}>
      <View key={index} style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{number}</Text>
        </View>
        <Icon style={styles.arrow} size={50} name="arrow-right" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 75,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },
  subContainer: {
    width: '90%',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20,
  },
  subTitle: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20,
  },
  arrow: {
    marginTop: 5,
  },
});

export default SupportCard;
