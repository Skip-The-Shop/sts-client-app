import React from 'react';
import {FlatList, View, Text, Dimensions} from 'react-native';
import {FeedCard, Exercise} from '../molecules';
import Title from '../atoms/Title';

const HorizontalScrollView = ({
  title,
  navigation,
  showFeatured,
  items,
  aggregationType,
  desc,
}) => {
  const renderItem = ({item, index}) => {
    return (
      <FeedCard
        aggregationType={aggregationType}
        navigation={navigation}
        style={{
          width: Dimensions.get('screen').width / 2.5,
          height: 100,
          resizeMode: 'contain',
        }}
        item={item}
        index={index}
        key={index}
        showMetadata={true}
      />
    );
  };
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
          width: '100%',
          paddingTop: 8,
          marginBottom: 8,
        }}>
        <Title style={{fontSize: 18}} title={title} />
        <Text
          onPress={() =>
            navigation.push('Aggregation', {
              title,
              showFeatured,
              items,
              aggregationType,
              desc,
            })
          }
          style={{fontSize: 12, alignSelf: 'center'}}>
          View all
        </Text>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={renderItem}
        data={items.slice(0, 10)}
        ItemSeparatorComponent={() => <View style={{height: 4, width: 8}} />}
      />
    </>
  );
};
export default HorizontalScrollView;
