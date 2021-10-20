const API_URL = 'http://127.0.0.1:3000';
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
    })
    .then(res => {
      console.log({res: res.data});
      return res;
    })
    .catch(err => console.log({err}));
};
