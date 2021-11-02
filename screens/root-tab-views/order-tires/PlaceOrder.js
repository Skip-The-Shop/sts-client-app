import React, {useState, useContext} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';
import Picker from '../home/Picker';
import {tireTypes, getIncrementalValuesUpToLimit} from '.';
import {placeTireOrder} from '../../../api/tire-order';
import {AuthContext} from '../../../hooks/getAuth';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  thirdInput: {
    width: '32%',
  },
});

const PlaceOrder = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [tireOrderRequest, setTireOrderRequest] = useState({});
  const placeOrder = async () => {
    await placeTireOrder(tireOrderRequest);
    navigation.goBack();
  };
  const updateTireOrderRequest = (key, val) => {
    let obj = tireOrderRequest;
    obj[key] = val;
    obj['UserId'] = user.UserId;
    setTireOrderRequest({...tireOrderRequest});
  };

  const {container, thirdInput} = styles;
  return (
    <ScrollView contentContainerStyle={container}>
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Input
            onChangeText={val => updateTireOrderRequest('TreadWidth', val)}
            inputStyle={thirdInput}
            placeholder="Tread Width"
          />
          <Input
            onChangeText={val => updateTireOrderRequest('Profile', val)}
            inputStyle={thirdInput}
            placeholder="Profile"
          />
          <Input
            onChangeText={val => updateTireOrderRequest('Diameter', val)}
            inputStyle={thirdInput}
            placeholder="Diameter"
          />
        </View>
        <Picker
          zIndex={2000}
          handleUpdateServiceRequest={updateTireOrderRequest}
          items={getIncrementalValuesUpToLimit(10)}
          placeholder="How Many Tires Do You Need?"
          serviceKey="Quantity"
        />
        <Picker
          zIndex={1000}
          handleUpdateServiceRequest={updateTireOrderRequest}
          items={tireTypes}
          placeholder="What Type Of Tires?"
          serviceKey="TireType"
        />
      </View>
      <Button onPress={placeOrder} text="Place Order" />
    </ScrollView>
  );
};
export default PlaceOrder;
