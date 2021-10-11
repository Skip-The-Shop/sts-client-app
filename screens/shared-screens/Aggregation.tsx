import React, {useEffect, useState} from 'react';
import {Dimensions, Text, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FeedCard} from '../../components/molecules';
import Hero from '../../components/molecules/hero/Hero';
import Title from '../../components/atoms/Title';
import ScrollContainer from '../../components/molecules/ScrollContainer';
import {HeaderBackButton} from '@react-navigation/stack';
import {COLORS} from '../../constants';
import Filter from '../../components/organisms/Filter';

interface AggregationCard {
  item: any;
  index: number;
}

const Aggregation = ({navigation, route}: any) => {
  const {title, items, aggregationType, desc, showFilter, filterType} =
    route.params;
  const [featured, setFeatured] = useState([]);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);

  const getData = () => {
    if (showFilter) {
      if (filter.length > 0) {
        if (filterType === 'Tutorials') {
          return data.filter(x => filter.includes(x.bodyParts));
        } else if (filterType === 'Videos') {
          return data.filter(x => filter.includes(x.experienceLevel[0]));
        } else {
          return data.filter(x => x.tags.some(y => filter.includes(y)));
        }
      }
    }
    return data;
  };

  useEffect(() => {
    const arr = [] as any;
    navigation.setOptions({
      title,
      headerRight: () => <Text style={styles.headerTitle}>{desc}</Text>,
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => navigation.goBack()}
          style={styles.headerBack}
          tintColor="#000"
        />
      ),
    });
    var item = items.sort((a, b) => {
      if (a.dateCreated > b.dateCreated) {
        return -1;
      }
      return 1;
    });
    if (item && item.length > 0) {
      for (let i = 0; i < item.length; i++) {
        if (arr.length < 3) {
          arr.push(item[i]);
          // item.splice(i, 1);
        }
      }
    }
    setData(item);
    setFeatured(arr);
  }, [items, route]);

  const renderItem = ({item, index}: AggregationCard) => {
    return (
      <FeedCard
        navigation={navigation}
        style={styles.card}
        item={item}
        showMetadata={true}
        aggregationType={aggregationType || item.aggregationType}
      />
    );
  };

  return (
    <View>
      <ScrollContainer>
        {featured.length > 0 && filter.length < 1 && (
          <Hero
            aggregationType={aggregationType}
            navigation={navigation}
            items={featured}
          />
        )}
        <FlatList
          columnWrapperStyle={styles.column}
          ListHeaderComponent={
            featured.length > 0
              ? () => <Title style={{fontSize: 18}} title="Latest Uploads" />
              : null
          }
          numColumns={2}
          renderItem={renderItem}
          data={getData()}
        />
      </ScrollContainer>
      {showFilter && <Filter setFilter={setFilter} filterType={filterType} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    width: 350,
    marginRight: 35,
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.DARK_GREY,
    fontWeight: 'bold',
  },
  headerBack: {
    marginTop: -70,
  },
  card: {
    width: Dimensions.get('screen').width / 2 - 16,
    height: 125,
    resizeMode: 'cover',
  },
  column: {
    justifyContent: 'space-between',
  },
});

export default Aggregation;
