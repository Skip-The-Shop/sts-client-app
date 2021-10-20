const API_URL = 'http://127.0.0.1:3000';
import axios from 'axios';
import {Platform} from 'react-native';

export const postImage = (TargetId, TargetTypeCode, Photo) => {
  if (Platform.OS === 'ios') {
    Photo.uri = Photo.uri.replace('file://', '');
  }
  return axios
    .post(`${API_URL}/api/v1/media/upload`, {
      TargetId,
      TargetTypeCode,
      Photo,
    })
    .then(response => {
      console.log({response});
      return response;
    })
    .catch(err => console.log({err}));
};
