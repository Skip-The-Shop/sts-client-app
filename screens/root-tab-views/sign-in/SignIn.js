import React, {useState, useContext} from 'react';
import {KeyboardAvoidingView, Platform, Text, View, Image} from 'react-native';
import {Button, Input} from '../../../components/atoms';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../../hooks/getAuth';
import Logo from '../../../components/atoms/Logo';

const SignIn = ({navigation}) => {
  const {handleLogin, getSession} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginRequest = async () => {
    await handleLogin({email, password});
    await getSession();
  };
  const navigateToSignUp = () => navigation.push('CreateAccount');

  return (
    <KeyboardAvoidingView
      style={{padding: 36, backgroundColor: '#FFF', flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{justifyContent: 'space-between', height: '100%'}}>
        <View>
          <Logo />
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secure
          />
          <Button
            buttonStyle={{marginTop: 8, marginBottom: 8}}
            onPress={loginRequest}
            text="Sign in"
          />
          <Text style={{textAlign: 'center'}}>Forgot Password?</Text>
        </View>
        <Text onPress={navigateToSignUp} style={{textAlign: 'center'}}>
          Don't have an account yet? Create one!
        </Text>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default SignIn;
