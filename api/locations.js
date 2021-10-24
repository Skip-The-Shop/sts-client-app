// const API_URL = 'http://127.0.0.1:3000';
const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
import axios from 'axios';

export const getLocationsForUser = async ({UserId}) => {
  return axios
    .get(`${API_URL}/api/v1/location/user/${UserId}`)
    .then(locations => {
      return locations.data;
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
      return location;
    })
    .catch(err => {
      console.log({err});
    });
};

export const deleteLocation = async ({Location}) => {
  const {AddressId} = Location;
  return axios
    .delete(`${API_URL}/api/v1/location/${AddressId}`)
    .then(location => {
      const {data} = location;
      return location;
    })
    .catch(err => {
      console.log({err});
    });
};
