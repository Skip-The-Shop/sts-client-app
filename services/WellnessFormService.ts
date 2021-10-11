import aws from './aws';
const {v4: uuidv4} = require('uuid');
import axios from 'axios';

export default class WellnessFormService {
  constructor() {
    this.db = aws.db;
    this.auth = aws.apiAuth;
  }

  async createWellnessForm(userID, data) {
    try {
      // var hutk = document.cookie
      //   .split('; ')
      //   .find(row => row.startsWith('hubspotutk'))
      //   .split('=')[1];
      const id = uuidv4();
      // const request = {
      //   host: '1i1q02twr1.execute-api.us-east-2.amazonaws.com',
      //   method: 'POST',
      //   data: {...data, hutk: hutk},
      //   body: JSON.stringify({...data, hutk: hutk}),
      //   url: 'https://hnkwfl91cl.execute-api.us-east-2.amazonaws.com/default/intitialLogin-dev',
      //   path: '/default/intitialLogin-dev',
      //   headers: {
      //     'content-type': 'application/json',
      //   },
      // };
      // delete data.hubspotID;
      // const signedRequest = this.auth(request);
      // await axios(signedRequest);
      const params = {
        TableName: 'WellnessForm',
        Item: {
          id,
          userID,
          ...data,
        },
      };
      await this.db
        .put(params, function (err) {
          if (err) {
            return 'Error';
          } else {
            return 'Success';
          }
        })
        .promise()
        .catch(err => console.error(err));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getWellnessFormsByUserId(userID) {
    console.log({userID});
    try {
      const params = {
        TableName: 'WellnessForm',
        FilterExpression: 'userID = :userID',
        ExpressionAttributeValues: {
          ':userID': userID,
        },
      };
      let scanResults: any[] = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      return items;
    } catch (e) {
      console.log({e});
    }
  }
}
