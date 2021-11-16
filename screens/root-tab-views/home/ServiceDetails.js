import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {COLORS} from '../../../constants';
import {getServiceById, acceptServiceQuote} from '../../../api/service';
import FastImage from 'react-native-fast-image';
import {Button} from '../../../components/atoms';
import {Icon} from 'react-native-elements/dist/icons/Icon';

const ServiceDetails = ({route, navigation}) => {
  const {item} = route.params;
  const [service, setService] = useState({item});
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
    ShopNotes,
    Price,
    PriceAccepted,
    ServiceId,
  } = service;
  useEffect(() => {
    const {ServiceId} = item;
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.push('Messages', {
              TargetTypeCode: 'Service',
              TargetId: ServiceId,
            })
          }
          style={{marginRight: 8}}>
          <Icon name="inbox" type="font-awesome" />
        </TouchableOpacity>
      ),
    });
    getServiceById({ServiceId}).then(s => {
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
  const handleAcceptServiceQuote = async () => {
    await acceptServiceQuote({ServiceId});
    getServiceById({ServiceId});
  };
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 12,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'space-between',
        flex: 1,
      }}>
      <View>
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
        <Text style={{fontWeight: 'bold'}}>Your Notes:</Text>
        <Text style={{marginTop: 12, marginBottom: 12}}>{Notes}</Text>
        <Text style={{fontWeight: 'bold'}}>Pickup Location:</Text>
        <Text style={{marginTop: 12}}>
          {StreetAddress}, {City}, {Province}
        </Text>
        {ShopNotes ? (
          <>
            <Text style={{fontWeight: 'bold', marginTop: 12}}>Shop Notes:</Text>
            <Text style={{marginTop: 12}}>{ShopNotes}</Text>
          </>
        ) : null}
        <Text style={{fontWeight: 'bold', marginTop: 12}}>Quote:</Text>
        <Text style={{marginTop: 12}}>{Price ? Price : 'Quote Pending'}</Text>
      </View>
      <View>
        {PriceAccepted ? (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{marginTop: 16, textAlign: 'center', color: 'green'}}>
              Price Accepted
            </Text>
            <Icon
              style={{marginTop: 12, marginLeft: 8}}
              name="check"
              type="font-awesome"
              color="green"
            />
          </View>
        ) : (
          <Button
            onPress={handleAcceptServiceQuote}
            buttonStyle={{marginTop: 16}}
            text="Accept Quote"
          />
        )}
      </View>
    </ScrollView>
  );
};
export default ServiceDetails;
