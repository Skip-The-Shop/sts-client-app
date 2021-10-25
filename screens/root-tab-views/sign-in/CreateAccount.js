import React, {useState, useContext} from 'react';
import {KeyboardAvoidingView, Platform, Text, View, Image} from 'react-native';
import {Button, Input} from '../../../components/atoms';
import {SafeAreaView} from 'react-native-safe-area-context';
import Logo from '../../../components/atoms/Logo';
import {register} from '../../../api/auth';
import {AuthContext} from '../../../hooks/getAuth';

const CreateAccount = ({navigation}) => {
  const {handleRegister, getSession} = useContext(AuthContext);
  const [registerRequest, setRegisterRequest] = useState({});
  const [exists, setExists] = useState(false);
  const updateRegisterRequest = (key, value) => {
    let obj = registerRequest;
    obj[key] = value;
    setRegisterRequest({...registerRequest});
  };
  const isValid = () => {
    if (registerRequest.Password !== registerRequest.ConfirmPassword) {
      return false;
    } else {
      for (let i = 0; i < 5; i++) {
        if (Object.values(registerRequest)[i] === '') {
          return false;
        }
      }
    }
    return true;
  };
  return (
    <KeyboardAvoidingView
      style={{padding: 36, backgroundColor: '#FFF', flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{justifyContent: 'space-between', height: '100%'}}>
        <View>
          <Logo />
          <Input
            onChangeText={value => updateRegisterRequest('Name', value)}
            placeholder="Name"
          />
          <Input
            onChangeText={value => updateRegisterRequest('Email', value)}
            placeholder="Email"
          />
          <Input
            onChangeText={value => updateRegisterRequest('PhoneNumber', value)}
            placeholder="Phone Number"
          />
          <Input
            onChangeText={value => updateRegisterRequest('Password', value)}
            placeholder="Password"
          />
          <Input
            onChangeText={value =>
              updateRegisterRequest('ConfirmPassword', value)
            }
            placeholder="Confirm Password"
          />
          <Button
            buttonStyle={{marginTop: 8}}
            onPress={async () => {
              const {Name, Email, Password, PhoneNumber} = registerRequest;
              await handleRegister({Name, Email, Password, PhoneNumber});
              await getSession();
            }}
            disabled={!isValid()}
            text="Register"
          />
          <Text style={{textAlign: 'center', marginTop: 12}}>
            Forgot Password?
          </Text>
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
