const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
import axios from 'axios';

export const bookService = ({
  ServiceType,
  Notes,
  Created,
  LocationId,
  Price,
  ShopNotes,
  UserId,
  VehicleId,
  PickupTime,
}) => {
  return axios
    .post(`${API_URL}/api/v1/service`, {
      ServiceType,
      Notes,
      Created,
      LocationId,
      Price,
      ShopNotes,
      UserId,
      VehicleId,
      PickupTime,
    })
    .then(res => {
      console.log({res: res.data});
      return res;
    })
    .catch(err => console.log({err}));
};

export const getServicesByUserId = ({UserId}) => {
  return axios
    .get(`${API_URL}/api/v1/service/user/${UserId}`)
    .then(services => {
      const {data} = services;
      return data;
    })
    .catch(err => console.log({err}));
};

export const getServiceById = ({ServiceId}) => {
  return axios
    .get(`${API_URL}/api/v1/service/${ServiceId}`)
    .then(service => {
      const {data} = service;
      console.log({data});
      return data[0];
    })
    .catch(err => console.log({err}));
};

export const acceptServiceQuote = ({ServiceId}) =>
  axios
    .patch(`${API_URL}/api/v1/service/quote/${ServiceId}`)
    .then(ser => {
      const {data} = ser;
      return data;
    })
    .catch(err => console.log(err));
