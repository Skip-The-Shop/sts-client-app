const API_URL = 'http://127.0.0.1:3000';
import axios from 'axios';

export const getVehiclesForUser = async ({UserId}) => {
  return axios.get(`${API_URL}/api/v1/vehicle/user/${UserId}`).then(v => {
    return v.data;
  });
};

export const saveVehicle = async ({Vehicle}) => {
  const {UserId, Year, Make, Model, Trim, Color, KMs, VIN} = Vehicle;
  return axios
    .post(`${API_URL}/api/v1/vehicle/`, {
      UserId,
      Year,
      Make,
      Model,
      Trim,
      Color,
      KMs,
      VIN,
    })
    .then(location => {
      const {data} = location;
      console.log({data});
      return location;
    })
    .catch(err => {
      console.log({err});
    });
};
