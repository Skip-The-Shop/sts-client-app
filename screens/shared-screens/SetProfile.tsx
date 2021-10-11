import React, {useState, useContext, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AddressService from '../../services/AddressService';
import UserService from '../../services/UserService';
import {COLORS} from '../../constants';
import {Picker} from '@react-native-picker/picker';
import {HeaderBackButton} from '@react-navigation/stack';

const SetProfile = ({navigation}: {navigation: any}) => {
  const userService = new UserService();
  const addressService = new AddressService();
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [language, setLanguage] = useState('');
  const [gender, setGender] = useState('');

  const getCountries = useCallback(async () => {
    addressService.getCountries().then(response => setCountryOptions(response));
  }, [addressService]);

  const getStates = useCallback(async (c: any) => {
    if (c) {
      addressService
        .getStatesByCountry(c)
        .then(response => setStateOptions(response));
    }
  }, []);

  const getCities = useCallback(async (s: any) => {
    if (s) {
      addressService
        .getCitiesByState(s)
        .then(response => setCityOptions(response));
    }
  }, []);

  const goBack = async () => {
    navigation.goBack();
  };

  const submit = async () => {
    const doc = {
      nickName: nickname,
      phoneNumber,
      country,
      state,
      city,
      address,
      postalCode,
      gender,
      language,
      firstLogin: false,
    };
    if (!user.hubspotID) {
      await userService.firstLoginAddUser(user.id, doc);
    } else {
      await userService.editUser(user.id, user.hubspotID, doc);
    }
    navigation.navigate('Initial Questionnaire');
  };

  useEffect(() => {
    if (user) {
      getCountries();
      getStates(user.country);
      getCities(user.state);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getStates(country);
    }
  }, [country]);

  useEffect(() => {
    if (user) {
      getCities(state);
    }
  }, [state]);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}>
            <View style={styles.formContainer}>
              <HeaderBackButton onPress={goBack} style={styles.goBack} />
              <Text style={styles.text}>Set Profile</Text>
              <GFITInput
                value={nickname}
                action={setNickname}
                placeholder="What should we call you?"
              />
              <GFITInput
                value={phoneNumber}
                action={setPhoneNumber}
                placeholder="Phone Number"
              />
              <Picker
                style={styles.picker}
                onValueChange={value => {
                  setGender(value);
                }}
                selectedValue={gender}>
                <Picker.Item enabled={false} label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
                <Picker.Item
                  label="Prefer not to answer"
                  value="Prefer not to answer"
                />
              </Picker>
              <GFITInput
                value={address}
                action={setAddress}
                placeholder="What is your address?"
              />
              <Picker
                style={styles.picker}
                onValueChange={value => {
                  setCountry(value);
                }}
                selectedValue={country}>
                <Picker.Item
                  enabled={false}
                  label="Select Country/Region"
                  value=""
                />
                {countryOptions.map((coun, key) => (
                  <Picker.Item
                    key={key}
                    label={coun.country_name}
                    value={coun.country_name}
                  />
                ))}
              </Picker>
              <View style={styles.smallContainer}>
                <Picker
                  style={styles.smallPicker}
                  onValueChange={value => {
                    setState(value);
                  }}
                  selectedValue={state}>
                  <Picker.Item enabled={false} label="Select State" value="" />
                  {stateOptions.map((sta, key) => (
                    <Picker.Item
                      key={key}
                      label={sta.state_name}
                      value={sta.state_name}
                    />
                  ))}
                </Picker>
                <Picker
                  style={styles.smallPicker}
                  onValueChange={value => {
                    setCity(value);
                  }}
                  selectedValue={city}>
                  <Picker.Item enabled={false} label="Select City" value="" />
                  {cityOptions.map((ci, key) => (
                    <Picker.Item
                      key={key}
                      label={ci.city_name}
                      value={ci.city_name}
                    />
                  ))}
                </Picker>
              </View>
              <GFITInput
                value={postalCode}
                action={setPostalCode}
                placeholder="Postal Code/ZIP"
              />
              <GFITInput
                value={language}
                action={setLanguage}
                placeholder="What is your main language?"
              />
              <GFITButton
                buttonStyle={styles.goForward}
                action={submit}
                text="Next"
              />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ScrollView>
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
  picker: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '85%',
  },
  smallContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
    flexDirection: 'row',
  },
  smallPicker: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '45%',
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
    borderRadius: 25,
    marginTop: 25,
    marginBottom: 25,
  },
  error: {
    color: COLORS.RED,
    textAlign: 'center',
  },
});

export default SetProfile;
