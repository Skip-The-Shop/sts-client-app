import React from 'react';
import {KeyboardAvoidingView, Platform, Text, View, Image} from 'react-native';
import {TextDivider, Button, Input} from '../../../components/atoms';
import {SafeAreaView} from 'react-native-safe-area-context';
import Logo from '../../../components/atoms/Logo';

const CreateAccount = ({navigation}) => {
  return (
    <KeyboardAvoidingView
      style={{padding: 36, backgroundColor: '#FFF', flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{justifyContent: 'space-between', height: '100%'}}>
        <View>
          <Logo />
          <Input placeholder="Email" />
          <Input placeholder="Phone Number" />
          <Input placeholder="Password" />
          <Input placeholder="Confirm Password" />
          <Button
            buttonStyle={{marginTop: 8}}
            onPress={() => {
              navigation.push('VehicleInfo');
            }}
            text="Next"
          />
          <Text style={{textAlign: 'center'}}>Forgot Password?</Text>
        </View>
        <Text
          onPress={() => navigation.navigate('SignIn')}
          style={{textAlign: 'center'}}>
          Already have an account? Sign In!
        </Text>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default CreateAccount;
