const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
import axios from 'axios';

export const placeTireOrder = async request => {
  const {TreadWidth, Profile, Diameter, Quantity, TireType, UserId} = request;
  return axios
    .post(`${API_URL}/api/v1/tire-order/`, {
      TreadWidth,
      Profile,
      Diameter,
      Quantity,
      TireType,
      UserId,
    })
    .then(order => {
      const {data} = order;
      return data;
    })
    .catch(err => console.log(err));
};

export const listOrderByUser = ({UserId}) => {
  return axios
    .get(`${API_URL}/api/v1/tire-order/${UserId}`)
    .then(orders => {
      const {data} = orders;
      return data;
    })
    .catch(err => console.log({err}));
};

export const acceptTireOrderQuote = ({TireOrderId}) =>
  axios
    .patch(`${API_URL}/api/v1/tire-order/quote/${TireOrderId}`)
    .then(ord => {
      const {data} = ord;
      return data;
    })
    .catch(err => console.log({err}));
