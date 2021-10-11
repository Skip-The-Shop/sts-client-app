const AWS = require('aws-sdk');
const aws4 = require('aws4-react-native');
const apiAuth = (request: any) => {
  return aws4.sign(request, {
    secretAccessKey: 'OXT7f083nYAorp+yETa2dFy5VycManCY1YT3CCUP',
    accessKeyId: 'AKIAYYWSV56TL4MLKZEI',
  });
};
const AWSCredentials = new AWS.Config({
  credentials: {
    secretAccessKey: '0wD4fPjA8N9BQZjWGiIeaoi6Ad0T6/v/fJKNBNwf',
    accessKeyId: 'AKIAYYWSV56TJLWPFNVZ',
  },
  region: 'us-east-2',
});
const db = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: 'us-east-2',
  credentials: {
    secretAccessKey: '0wD4fPjA8N9BQZjWGiIeaoi6Ad0T6/v/fJKNBNwf',
    accessKeyId: 'AKIAYYWSV56TJLWPFNVZ',
  },
  dynamoDbCrc32: false,
});
const s3 = new AWS.S3({
  apiVersion: 'latest',
  region: 'us-east-2',
  credentials: {
    secretAccessKey: '0wD4fPjA8N9BQZjWGiIeaoi6Ad0T6/v/fJKNBNwf',
    accessKeyId: 'AKIAYYWSV56TJLWPFNVZ',
  },
});
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: 'latest',
  region: 'us-east-2',
  credentials: {
    secretAccessKey: '0wD4fPjA8N9BQZjWGiIeaoi6Ad0T6/v/fJKNBNwf',
    accessKeyId: 'AKIAYYWSV56TJLWPFNVZ',
  },
});
const encode = (data: any) => {
  var str = data.reduce((a, b) => {
    return a + String.fromCharCode(b);
  }, '');
  return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
};
export default {AWSCredentials, db, apiAuth, s3, cognito, encode};
