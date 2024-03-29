const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
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

export const deleteVehicle = async ({Vehicle}) => {
  const {VehicleId} = Vehicle;
  return axios
    .delete(`${API_URL}/api/v1/vehicle/${VehicleId}`)
    .then(vehicle => {
      const {data} = vehicle;
      return vehicle;
    })
    .catch(err => {
      console.log({err});
    });
};
