import React, {useState, useEffect} from 'react';
import UserService from '../../../services/UserService';
import {
  Modal,
  View,
  Pressable,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Keyboard,
} from 'react-native';
import {GFITButton, GFITInput} from '../../../components/atoms';
import {COLORS} from '../../../constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [open, setOpen] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const userService = new UserService();

  const sendCode = async () => {
    const res = await userService.resetPassword(email);
    if (res === 'Success') {
      setCodeSent(true);
    } else {
      Alert.alert('Error', 'There was an error sending your email');
    }
  };

  const updatePassword = async () => {
    const res = await userService.resetChangePassword(email, code, password);
    if (res === 'Success') {
      Alert.alert('Success', 'Password successfully updated!');
    } else {
      Alert.alert('Error', 'There was an error updating your password');
    }
  };

  useEffect(() => {
    setCodeSent(false);
  }, [open]);

  return (
    <View>
      <Modal
        visible={open}
        onRequestClose={() => {
          setOpen(false);
        }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inner}>
                <Pressable style={styles.exit} onPress={() => setOpen(false)}>
                  <Text style={styles.exitButton}>X</Text>
                </Pressable>
                <Text style={styles.title}>
                  {!codeSent
                    ? 'Enter the email address for your account'
                    : 'Enter your code and new password'}
                </Text>
                {!codeSent ? (
                  <GFITInput
                    placeholder="Enter your email"
                    value={email}
                    action={setEmail}
                    style={styles.textInput}
                  />
                ) : (
                  <View>
                    <GFITInput
                      placeholder="Enter the code sent to your email"
                      value={code}
                      action={setCode}
                      style={styles.textInput}
                    />
                    <GFITInput
                      placeholder="Enter your password"
                      value={password}
                      action={setPassword}
                      secure={true}
                      style={styles.textInput}
                    />
                  </View>
                )}
                <GFITButton
                  buttonStyle={styles.button}
                  text="Submit"
                  action={() => {
                    codeSent ? updatePassword() : sendCode();
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
      <Pressable style={styles.link} onPress={() => setOpen(true)}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    justifyContent: 'flex-end',
  },
  exit: {
    position: 'absolute',
    right: 45,
    top: 35,
  },
  exitButton: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    marginTop: 125,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
  },
  link: {
    color: COLORS.BLUE,
    marginLeft: '65%',
    marginBottom: 35,
  },
  linkText: {
    color: COLORS.BLUE,
  },
  textInput: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    marginBottom: 10,
    width: '90%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 25,
  },
  button: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  error: {
    color: 'red',
  },
});

export default ForgotPassword;
