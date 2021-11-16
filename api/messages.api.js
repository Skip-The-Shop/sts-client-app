const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
import axios from 'axios';

export const getMessagesByTypeAndTarget = async ({TargetTypeCode, TargetId}) =>
  axios
    .get(`${API_URL}/api/v1/messages/${TargetId}/type/${TargetTypeCode}`)
    .then(messages => {
      const {data} = messages;
      return data;
    });

export const createMessage = async ({
  TargetId,
  TargetTypeCode,
  MessageText,
  UserId,
}) =>
  axios
    .post(`${API_URL}/api/v1/messages/${TargetId}/type/${TargetTypeCode}`, {
      MessageText,
      UserId,
    })
    .then(m => {
      const {data} = m;
      return data;
    })
    .catch(err => console.log({err}));
