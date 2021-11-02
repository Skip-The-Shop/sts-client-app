// const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
const API_URL = 'http://localhost:80';
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
      console.log({data});
      return data;
    })
    .catch(err => console.log(err));
};

export const listOrderByUser = ({UserId}) => {
  return axios
    .get(`${API_URL}/api/v1/tire-order/${UserId}`)
    .then(orders => {
      const {data} = orders;
      console.log({data});
      return data;
    })
    .catch(err => console.log({err}));
};
