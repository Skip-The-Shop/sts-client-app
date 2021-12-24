import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';
import Picker from '../home/Picker';
import {tireTypes, getIncrementalValuesUpToLimit} from '.';
import {placeTireOrder} from '../../../api/tire-order';
import {AuthContext} from '../../../hooks/getAuth';
import {getVehiclesForUser} from '../../../api/vehicles';
import {useFocusEffect} from '@react-navigation/native';

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
  const [vehicles, setVehicles] = useState([]);
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

  useFocusEffect(
    React.useCallback(() => {
      const {UserId} = user;
      getVehiclesForUser({UserId}).then(v => {
        const parsedVehicles = v.reduce((acc, curr) => {
          acc.push({
            label: `${curr.Year} ${curr.Make} ${curr.Model}`,
            value: curr.VehicleId,
          });
          return acc;
        }, []);
        setVehicles(parsedVehicles);
      });
    }, []),
  );

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
        {vehicles && vehicles.length > 0 ? (
          <Picker
            zIndex={0}
            handleUpdateServiceRequest={updateTireOrderRequest}
            items={vehicles}
            placeholder="Which Vehicle Are These For?"
            serviceKey="Vehicle"
          />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.push('SaveVehicle', {user})}
            style={{
              borderColor: '#000',
              borderWidth: 2,
              padding: 16,
              marginTop: 12,
              borderRadius: 6,
            }}>
            <Text>Which Vehicle Are These For?</Text>
          </TouchableOpacity>
        )}
      </View>
      <Button onPress={placeOrder} text="Request Quote" />
    </ScrollView>
  );
};
export default PlaceOrder;
