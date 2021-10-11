import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class WellnessChallengeService {
  constructor() {
    this.db = aws.db;
  }

  async createWellnessChallenge(doc, userID) {
    try {
      const id = uuidv4();
      const dateTime = new Date();
      const date = dateTime.toLocaleString('default', {
        year: 'numeric',
        month: 'long',
      });
      const params = {
        TableName: 'WellnessChallenges',
        Item: {
          answers: doc,
          id,
          date,
          userID,
          dateCreated: dateTime.toDateString(),
        },
      };
      await aws.db.put(params).promise();
      return {message: 'Success', id};
    } catch (error) {
      return 'Error';
    }
  }

  async getWellnessChallengeByDate(id, date) {
    try {
      const params = {
        TableName: 'WellnessChallenges',
        FilterExpression: '#date = :date AND #id = :id',
        ExpressionAttributeValues: {
          ':date': date,
          ':id': id,
        },
        ExpressionAttributeNames: {
          '#date': 'date',
          '#id': 'userID',
        },
      };
      const items = await aws.db.scan(params).promise();
      return items.Items[0];
    } catch (error) {
      return {};
    }
  }

  async getWellnessChallengeByUser(userID) {
    try {
      const params = {
        TableName: 'WellnessChallenges',
        FilterExpression: '#userID = :userID',
        ExpressionAttributeValues: {
          ':userID': userID,
        },
        ExpressionAttributeNames: {
          '#userID': 'userID',
        },
      };
      const items = await aws.db.scan(params).promise();
      return items.Items;
    } catch (error) {
      return [];
    }
  }

  async updateWellnessChallenge(id, date, doc) {
    try {
      const params = {
        Key: {
          id: id,
          date: date,
        },
        ExpressionAttributeNames: {
          '#a': 'answers',
        },
        ExpressionAttributeValues: {
          ':a': doc,
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'WellnessChallenges',
      };
      await aws.db.update(params).promise();
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }

  async addFinishedDate(id, date) {
    try {
      const params = {
        Key: {
          id: id,
          date: date,
        },
        ExpressionAttributeNames: {
          '#a': 'finishedDate',
        },
        ExpressionAttributeValues: {
          ':a': new Date(Date.now()).toString(),
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'WellnessChallenges',
      };
      await aws.db.update(params).promise();
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }
}
