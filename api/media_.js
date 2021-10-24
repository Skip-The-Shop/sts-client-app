// const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
const API_URL = 'http://127.0.0.1:80';
import axios from 'axios';
import {Platform} from 'react-native';

export const postImage = async (TargetId, TargetTypeCode, Photo) => {
  console.log({Photo});
  const {uri, fileSize, fileName} = Photo;
  let MediaRecord = {
    path: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
    size: fileSize,
    originalname: fileName,
  };
  const data = new FormData();
  data.append('TargetTypeCode', TargetTypeCode);
  data.append('TargetId', TargetId);
  data.append('MediaRecord', MediaRecord);
  return await axios
    .post(`${API_URL}/api/v1/media/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    })
    .then(response => console.log({response}))
    .catch(err => console.log({err}));
};
