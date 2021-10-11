import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Image} from 'react-native';
import {Icon} from 'react-native-elements';

interface CategoryCard {
  title: string;
  navigation: any;
  index: number;
  items?: any;
  aggregationType: string;
  showFilter?: boolean;
  filterType?: string;
  image?: any,
}

const CategoryCard = ({
  title,
  navigation,
  index,
  items,
  aggregationType,
  showFilter,
  filterType,
  image,
}: CategoryCard) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        if (title === 'Call Support') {
          navigation.navigate('Call Support');
        } else {
          navigation.navigate('CategoryAggregation', {
            title,
            items,
            aggregationType,
            showFilter,
            filterType,
          });
        }
      }}
      style={styles.mainContainer}>
      <View key={index} style={styles.container}>
        <Image style={styles.square} source={image} />
        <View style={styles.subContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>Lorem ipsum dolor sit amet.</Text>
        </View>
        <Icon style={styles.arrow} size={50} name="arrow-right" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    backgroundColor: 'white',
    height: 50,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  subContainer: {
    width: '55%',
  },
  square: {
    backgroundColor: 'grey',
    borderRadius: 5,
    width: 125,
    height: 75,
  },
  title: {
    fontSize: 16,
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

export default CategoryCard;
