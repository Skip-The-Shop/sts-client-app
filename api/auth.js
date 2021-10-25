const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
import axios from 'axios';
import {AsyncStorage} from 'react-native';

export const login = async ({Email, Password}) => {
  return axios
    .post(
      `${API_URL}/api/v1/auth/login`,
      {
        Email,
        Password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*',
        },
      },
    )
    .then(async res => {
      const {data} = res;
      const {User, ApplicationToken} = data;
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(User)],
        ['token', JSON.stringify(ApplicationToken)],
      ]);
      return true;
    })
    .catch(err => {
      console.log({err});
    });
};

export const register = async ({Name, Email, PhoneNumber, Password}) => {
  return axios
    .post(
      `${API_URL}/api/v1/auth/register`,
      {
        Name,
        Email,
        Password,
        PhoneNumber,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*',
        },
      },
    )
    .then(async res => {
      const {data} = res;
      const {User, ApplicationToken} = data;
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(User)],
        ['token', JSON.stringify(ApplicationToken)],
      ]);
      return true;
    })
    .catch(e => {
      console.log({e});
      return e;
    });
};
