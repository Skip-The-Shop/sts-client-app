import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import {COLORS} from '../../../constants';
import {getServiceById} from '../../../api/service';
import FastImage from 'react-native-fast-image';

const ServiceDetails = ({route, navigation}) => {
  const {item} = route.params;
  const [service, setService] = useState({});
  const {
    ServiceType,
    Media,
    Notes,
    StreetAddress,
    Year,
    Make,
    Model,
    Province,
    City,
  } = service;
  useEffect(() => {
    const {ServiceId} = item;
    getServiceById({ServiceId}).then(s => {
      console.log({s});
      setService(s);
    });
  }, []);
  const renderItem = ({item, index}) => (
    <FastImage
      style={{height: 200, width: 250, marginHorizontal: 4}}
      resizeMode="cover"
      source={{uri: item.ResourceUrl}}
    />
  );
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 12,
        backgroundColor: COLORS.WHITE,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontWeight: 'bold'}}>Service Type:</Text>
        <Text>{ServiceType}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        }}>
        <Text style={{fontWeight: 'bold'}}>Vehicle:</Text>
        <Text>
          {Year} {Make} {Model}
        </Text>
      </View>
      <FlatList
        style={{marginTop: 12}}
        horizontal
        data={Media}
        renderItem={renderItem}
      />
      <View
        style={{
          marginTop: 12,
        }}>
        <Text style={{fontWeight: 'bold'}}>Your Notes:</Text>
        <Text style={{marginTop: 12}}>{Notes}</Text>
      </View>
      <View
        style={{
          marginTop: 12,
        }}>
        <Text style={{fontWeight: 'bold'}}>Pickup Location:</Text>
        <Text style={{marginTop: 12}}>
          {StreetAddress}, {City}, {Province}
        </Text>
      </View>
    </ScrollView>
  );
};
export default ServiceDetails;
