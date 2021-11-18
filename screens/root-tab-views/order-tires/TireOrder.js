import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Button from '../../../components/atoms/Button';
import {acceptTireOrderQuote} from '../../../api/tire-order';
import {Icon} from 'react-native-elements/dist/icons/Icon';

const styles = StyleSheet.create({
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  measurements: {
    color: '#979797',
    fontSize: 14,
    marginTop: 6,
  },
});

const TireOrder = ({item, getOrders, navigation}) => {
  const {
    TreadWidth,
    Profile,
    Diameter,
    Quantity,
    TireType,
    Price,
    QuoteAccepted,
    TireOrderid,
  } = item;
  const {orderTitle, measurements} = styles;
  const handleAcceptTireQuote = async () => {
    await acceptTireOrderQuote({TireOrderId: TireOrderid});
    await getOrders();
  };
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.push('Messages', {
          TargetId: TireOrderid,
          TargetTypeCode: 'TireOrder',
        })
      }
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
      }}>
      <View>
        <Text style={orderTitle}>
          {Quantity} {TireType} Tires
        </Text>
        <Text style={measurements}>
          Measurements: {TreadWidth}/{Profile}/{Diameter}
        </Text>
        <Text style={{alignSelf: 'flex-start', marginTop: 6}}>
          {Price > 0 ? `$${Price}` : 'Price Pending'}
        </Text>
      </View>
      <View>
        {QuoteAccepted ? (
          <View style={{flexDirection: 'row', marginTop: 12}}>
            <Text style={{color: 'green', alignSelf: 'center'}}>
              Price Accepted
            </Text>
            <Icon name="check" type="font-awesome" color="green" />
          </View>
        ) : Price > 0 ? (
          <Button
            onPress={handleAcceptTireQuote}
            buttonStyle={{
              height: 30,
              padding: 0,
              justifyContent: 'center',
              width: 100,
              marginTop: 8,
            }}
            textStyle={{fontSize: 12}}
            text="Accept Quote"
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default TireOrder;
