const API_URL = 'http://ec2-3-143-242-200.us-east-2.compute.amazonaws.com:80';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

export const postImage = async (TargetId, TargetTypeCode, Photo) => {
  const {uri, fileSize, fileName} = Photo;
  const filetype = fileName.split('.').pop();
  const response = await axios.get(
    `${API_URL}/api/v1/media/${TargetId}/media/${filetype}`,
  );
  const {Url, S3Url, Selector} = response.data;
  const FILE_STRING = 'file://';
  let MediaUri = uri;
  if (MediaUri.indexOf(FILE_STRING) >= 0) {
    MediaUri = uri.substring(FILE_STRING.length);
  }
  try {
    await RNFetchBlob.fetch(
      'PUT',
      S3Url,
      {
        'Content-Type': 'application/octet-stream',
      },
      RNFetchBlob.wrap(MediaUri),
    );
  } catch (e) {
    console.log({e});
  }
  await axios.post(
    `${API_URL}/api/v1/media/${TargetTypeCode}/upload/${TargetId}`,
    {
      Url,
    },
  );
  return true;
};
