import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Title from '../atoms/Title';
interface IHalfWidthImageCard {
  title: string;
  subtitle: string;
  onPress?: any;
}
const HalfWidthImageCard = ({
  title,
  subtitle,
  onPress,
}: IHalfWidthImageCard) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderColor: '#DDD',
        borderWidth: 0.5,
        padding: 12,
        borderRadius: 4,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{width: '55%'}}>
        <Title title={title} />
        <Text style={{fontSize: 14, lineHeight: 24}}>{subtitle}</Text>
      </View>
      <View
        style={{
          width: '40%',
          minHeight: 120,
          borderRadius: 8,
          backgroundColor: '#DDD',
        }}
      />
    </TouchableOpacity>
  );
};

export default HalfWidthImageCard;
