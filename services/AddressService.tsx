import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// THIS SHOULD GO TO AN ENV VARIABLE
const uniRestConfig = {
  unirestUrl: 'https://www.universal-tutorial.com/api',
  type: 'application/json',
  apiToken:
    '8J9N73B2Ds96u_Vz8_5bKDp5E-WYAJwvjMB_-iPv7l_VgOfeL1ClPZhn1Bit_I-qdjk',
  userEmail: 'davidcbeauchamp@hotmail.com',
};

export default class AddressService {

  async isValidToken() {
    var tok = await AsyncStorage.getItem('unirestToken');
    if (!tok) {
      return false;
    }
    const base64Url = tok.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    const payload = JSON.parse(jsonPayload);
    const currentUnixTime = (Date.now() / 1000) | 0;
    return payload.exp > currentUnixTime;
  }

  async getAccessToken() {
    var tok = await AsyncStorage.getItem('unirestToken');
    if (!tok) {
      const response = await axios.get(
        `${uniRestConfig.unirestUrl}/getaccesstoken`,
        {
          headers: {
            Accept: uniRestConfig.type,
            'api-token': uniRestConfig.apiToken,
            'user-email': uniRestConfig.userEmail,
          },
        },
      );
      var t = JSON.stringify(response.data.auth_token);
      await AsyncStorage.setItem('unirestToken', t);
      tok = t;
      return t;
    }

    return tok;
  }

  async get(endpoint) {
    try {
      // AsyncStorage.removeItem('unirestToken');
      var tok = await AsyncStorage.getItem('unirestToken');
      if (!this.isValidToken()) {
        await this.getAccessToken();
      }
      const response = await axios.get(
        `${uniRestConfig.unirestUrl}/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${tok}`,
            Accept: 'application/json',
          },
        },
      );
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getCountries() {
    const countries = this.get('countries').then(response => {
      const _countries = [];
      response?.data?.forEach(country => {
        if (
          country.country_name === 'Canada' ||
          country.country_name === 'United States'
        ) {
          _countries.push(country);
        }
      });
      return _countries;
    });
    return countries;
  }

  async getStatesByCountry(country) {
    const states = this.get(`states/${country}`).then(response => {
      const _states = [];
      response?.data?.forEach(state => {
        _states.push(state);
      });
      return _states;
    });
    return states;
  }

  async getCitiesByState(state) {
    const cities = this.get(`cities/${state}`).then(response => {
      const _cities = [];
      response?.data?.forEach(city => {
        if (!_cities.some(city => city == city.city_name)) {
          _cities.push(city);
        }
      });
      return _cities;
    });
    return cities;
  }
}
