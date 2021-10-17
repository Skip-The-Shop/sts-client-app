const API_URL = 'http://127.0.0.1:3000';
import axios from 'axios';

export const getLocationsForUser = async ({UserId}) => {
  return axios
    .get(`${API_URL}/api/v1/location/user/${UserId}`)
    .then(locations => {
      console.log({locations});
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
