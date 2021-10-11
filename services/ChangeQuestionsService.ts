import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class ChangeQuestionService {
  constructor() {
    this.db = aws.db;
  }

  async createChangeQuestions(data) {
    try {
      const id = uuidv4();

      const params = {
        TableName: 'ChangeQuestions',
        Item: {
          id,
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
      return 'Success';
    } catch (error) {
      console.error(error);
    }
  }

  async editChangeQuestion(id, data) {
    try {
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'name',
          '#b': 'options',
        },
        ExpressionAttributeValues: {
          ':a': data.name,
          ':b': data.options,
        },
        UpdateExpression: 'SET #a = :a, #b = :b',
        TableName: 'ChangeQuestions',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch (error) {
      console.error(error);
    }
  }

  async getChangeQuestions() {
    try {
      const params = {
        TableName: 'ChangeQuestions',
      };
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');

      return scanResults;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getChangeQuestionById(id) {
    try {
      const params = {
        Key: {
          id: id,
        },
        TableName: 'ChangeQuestions',
      };
      const response = await this.db.get(params).promise();
      return response.Item;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteChangeQuestion(id) {
    try {
      const params = {
        Key: {
          id: id,
        },
        TableName: 'ChangeQuestions',
      };

      await this.db.delete(params).promise();
    } catch (error) {
      console.error(error);
    }
  }
}
