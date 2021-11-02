import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  measurements: {
    color: '#979797',
    fontSize: 14,
  },
});

const TireOrder = ({item}) => {
  const {TreadWidth, Profile, Diameter, Quantity, TireType, Price} = item;
  const {orderTitle, measurements} = styles;
  return (
    <View
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
      </View>
      <Text style={{alignSelf: 'center'}}>
        {Price > 0 ? Price : 'Price Pending'}
      </Text>
    </View>
  );
};

export default TireOrder;
