import React from 'react';
import {KeyboardAvoidingView, Platform, Text, View} from 'react-native';
import {TextDivider, Button, Input} from '../../../components/atoms';
import {SafeAreaView} from 'react-native-safe-area-context';

const VehicleInfo = ({navigation}) => {
  return (
    <KeyboardAvoidingView
      style={{padding: 36, backgroundColor: '#FFF', flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{justifyContent: 'space-between', height: '100%'}}>
        <View>
          <Input placeholder="Pickup Address" />
          <Text style={{fontWeight: 'bold', marginTop: 32, fontSize: 18}}>
            Vehicle Information
          </Text>
          <Input placeholder="Make" />
          <Input placeholder="Model" />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Input style={{width: '49%'}} placeholder="Make" />
            <Input style={{width: '49%'}} placeholder="Make" />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Input style={{width: '49%'}} placeholder="Trim" />
            <Input style={{width: '49%'}} placeholder="Kms" />
          </View>
          <Input placeholder="VIN" />
        </View>
        <Button text="Submit Info" />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default VehicleInfo;
