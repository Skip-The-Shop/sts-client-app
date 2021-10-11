import React, {useState} from 'react';
import {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import {COLORS} from '../../constants';
import UserService from '../../services/UserService';
import {HeaderBackButton} from '@react-navigation/stack';

const SetPassword = ({navigation}: {navigation: any}) => {
  const userService = new UserService();
  const [pass, setPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const goBack = async () => {
    navigation.navigate('SignIn');
    await handleSignout();
    // navigation.navigate('SignIn');
  };

  const submit = async () => {
    navigation.navigate('Set Profile');
    setError('');
    if (newPass === '' || confirmPass === '' || pass === '') {
      setError('Please fill out all of the fields.');
    } else if (newPass === confirmPass) {
      const res = await userService.passwordUpdate(pass, newPass);
      if (res) {
        navigation.navigate('Set Profile');
      } else {
        setError('There was an error updating your password');
      }
    } else {
      setError('Your password does not match.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            <HeaderBackButton onPress={goBack} style={styles.goBack} />
            <Text style={styles.text}>Set Password</Text>
            <GFITInput
              value={pass}
              action={setPass}
              placeholder="Enter your temporary password"
              secure={true}
            />
            <GFITInput
              value={newPass}
              action={setNewPass}
              placeholder="Enter your new password"
              secure={true}
            />
            <GFITInput
              value={confirmPass}
              action={setConfirmPass}
              placeholder="Confirm your new password"
              secure={true}
            />
            <GFITButton
              buttonStyle={styles.goForward}
              action={submit}
              text="Next"
            />
            {error !== '' && <Text style={styles.error}>{error}</Text>}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  formContainer: {
    marginTop: 100,
  },
  text: {
    fontSize: 25,
    marginLeft: 30,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  goBack: {
    marginLeft: 23,
    marginTop: -55,
    marginBottom: 35,
  },
  goForward: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '85%',
    borderRadius: 35,
    marginTop: 25,
  },
  error: {
    color: COLORS.RED,
    textAlign: 'center',
  },
});

export default SetPassword;
