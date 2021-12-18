import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';
import {saveVehicle} from '../../../api/vehicles';

const WIDTH = '49%';

const SaveVehicle = ({route, navigation}) => {
  const {user} = route.params;
  const [vehicleInfo, setVehicleInfo] = useState({});
  const handleUpdate = ({key, value}) => {
    let obj = vehicleInfo;
    obj[key] = value;
    setVehicleInfo({...obj});
  };
  const handleCreateVehicle = async () => {
    let req = vehicleInfo;
    req['UserId'] = user.UserId;
    await saveVehicle({Vehicle: req});
    navigation.goBack();
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{justifyContent: 'space-between', flex: 1}}
      style={{
        backgroundColor: '#FFF',
        padding: 12,
      }}>
      <View style={{flex: 1}}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>
          Vehicle Information
        </Text>
        <Input
          onChangeText={text => handleUpdate({key: 'Make', value: text})}
          placeholder="Make"
        />
        <Input
          onChangeText={text => handleUpdate({key: 'Model', value: text})}
          placeholder="Model"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Input
            onChangeText={text => handleUpdate({key: 'Year', value: text})}
            inputStyle={{width: WIDTH}}
            placeholder="Year"
            keyboardType="numeric"
          />
          <Input
            onChangeText={text => handleUpdate({key: 'Colour', value: text})}
            inputStyle={{width: WIDTH}}
            placeholder="Colour"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Input
            onChangeText={text => handleUpdate({key: 'Trim', value: text})}
            inputStyle={{width: WIDTH}}
            placeholder="Trim"
          />
          <Input
            onChangeText={text => handleUpdate({key: 'KMs', value: text})}
            inputStyle={{width: WIDTH}}
            placeholder="Kms"
            keyboardType="numeric"
          />
        </View>
        <Input
          onChangeText={text => handleUpdate({key: 'VIN', value: text})}
          placeholder="VIN"
        />
      </View>
      <Button onPress={handleCreateVehicle} text="Save Vehicle" />
    </KeyboardAwareScrollView>
  );
};

export default SaveVehicle;
