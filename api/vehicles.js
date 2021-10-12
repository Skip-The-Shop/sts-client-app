const API_URL = 'http://127.0.0.1:3000';
import axios from 'axios';

export const getVehiclesForUser = async ({UserId}) => {
  return axios.get(`${API_URL}/api/v1/vehicle/user/${UserId}`).then(v => {
    return v.data;
  });
};

export const saveLocation = async ({Location}) => {
  const {Latitude, Longitude, StreetAddress, City, Province, IsHome, UserId} =
    Location;
  return axios
    .post(`${API_URL}/api/v1/location/`, {
      Latitude,
      Longitude,
      StreetAddress,
      City,
      Province,
      IsHome,
      UserId,
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
