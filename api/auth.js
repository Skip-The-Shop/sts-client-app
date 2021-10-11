const API_URL = 'http://127.0.0.1:3000';
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
