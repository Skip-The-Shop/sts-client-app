import React, {useState, useContext} from 'react';
import {KeyboardAvoidingView, Platform, Text, View} from 'react-native';
import {Button, Input} from '../../../components/atoms';
import {SafeAreaView} from 'react-native-safe-area-context';
import Logo from '../../../components/atoms/Logo';
import {AuthContext} from '../../../hooks/getAuth';
import Spinner from 'react-native-loading-spinner-overlay';
import {register} from '../../../api/auth';
const CreateAccount = ({navigation}) => {
  const {handleRegister, getSession} = useContext(AuthContext);
  const [registerRequest, setRegisterRequest] = useState({});
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState({
    email: '',
    itDoes: false,
  });
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
  const createAccount = async () => {
    setLoading(true);
    const {Name, Email, Password, PhoneNumber} = registerRequest;
    const response = await handleRegister({
      Name,
      Email,
      Password,
      PhoneNumber,
    });
    if (
      response &&
      response.response &&
      response.response.status &&
      response.response.status === 409
    ) {
      console.log({r: response.response.status});
      setExists({
        email: Email,
        itDoes: true,
      });
    }
    await getSession();
    setLoading(false);
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
            onChangeText={value => {
              if (exists && exists.email) {
                if (exists && exists.email !== registerRequest['Email']) {
                  setExists({email: '', itDoes: false});
                }
              }
              updateRegisterRequest('Email', value);
            }}
            placeholder="Email"
            inputStyle={{borderColor: exists && exists.itDoes ? 'red' : '#000'}}
          />
          {exists && exists.itDoes ? (
            <Text style={{marginTop: 4, color: 'red'}}>
              An email with this account already exists.
            </Text>
          ) : (
            false
          )}
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
            onPress={createAccount}
            disabled={!isValid()}
            text="Create Account"
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
      <Spinner visible={loading} textContent="Just a moment..." />
    </KeyboardAvoidingView>
  );
};
export default CreateAccount;
