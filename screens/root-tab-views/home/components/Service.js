import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import moment from 'moment';
import {Icon} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  metaContainer: {
    marginTop: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  iconWrapper: {
    backgroundColor: '#979797',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    marginTop: 6,
  },
  requestedText: {
    fontSize: 11,
    color: '#979797',
    marginTop: 6,
  },
});

const Service = ({item, index, navigation}) => {
  const {ServiceType, Created, Media, Notes, ShopNotes, Price} = item;
  const {container, metaContainer, iconWrapper, requestedText} = styles;
  const [showDetails, setShowDetails] = useState(false);
  const renderItem = ({item, index}) => {
    const {ResourceUrl} = item;
    return (
      <FastImage
        borderRadius={6}
        source={{uri: ResourceUrl}}
        style={{
          height: 150,
          width: 200,
          resizeMode: 'contain',
          marginHorizontal: 4,
        }}
      />
    );
  };
  return (
    <View style={container}>
      <TouchableOpacity
        onPress={() => navigation.push('ServiceDetails', {item})}
        style={metaContainer}>
        <View>
          <Text
            style={{
              marginBottom: 8,
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 12,
            }}>
            {ServiceType}
          </Text>
          <Text style={requestedText}>
            Requested: {moment(parseInt(Created)).format('MMMM Do YYYY')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          style={iconWrapper}>
          <Icon
            name={showDetails ? 'caret-up' : 'caret-down'}
            type="font-awesome"
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {showDetails ? (
        <>
          <FlatList horizontal data={Media} renderItem={renderItem} />
          <Text style={{marginTop: 8}}>
            <Text style={{fontWeight: 'bold'}}>Notes:</Text> {Notes}
          </Text>
          {ShopNotes ? (
            <Text style={{marginTop: 8}}>
              <Text style={{fontWeight: 'bold'}}>Shop Notes:</Text> {ShopNotes}
            </Text>
          ) : null}
          <Text style={{marginTop: 8}}>
            <Text style={{fontWeight: 'bold'}}>Price:</Text>{' '}
            {Price ? Price : 'Price Pending'}
          </Text>
        </>
      ) : null}
    </View>
  );
};

export default Service;
