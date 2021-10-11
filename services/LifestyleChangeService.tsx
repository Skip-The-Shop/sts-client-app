import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class LifestyleChangeService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
    this.tableName = 'ChangeServices';
  }

  async createChangeService(doc) {
    try {
      //const dateCreated = new Date(Date.now()); // might not even need --
      let changeServiceID = uuidv4();
      const {title, providerType, media} = doc.Item;
      var dbParams = {
        TableName: this.tableName,
        Item: {
          id: changeServiceID,
          title,
          providerType,
          media,
          deleted: false,
        },
      };

      this.db
        .put(dbParams, function (err, data) {
          if (err) {
            console.error(err);
            return 'Error';
          } else {
            console.log(data);
            return 'Success';
          }
        })
        .promise();
    } catch (e) {
      console.error(e);
      return 'Error';
    }
  }

  async getAllServices() {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: 'deleted = :deleted',
        ExpressionAttributeValues: {
          ':deleted': false,
        },
      };
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');

      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getChangeServiceById(id) {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: 'id=:id',
        ExpressionAttributeValues: {
          ':id': id,
        },
      };
      const item = await aws.db.scan(params).promise();
      return item.Items[0];
    } catch (e) {
      console.log({e});
      return [];
    }
  }

  async editChangeService(id, doc) {
    try {
      const data = doc.Item;
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'title',
          '#b': 'media',
        },
        ExpressionAttributeValues: {
          ':a': data.title,
          ':b': data.media,
        },
        UpdateExpression: 'SET #a = :a, #b = :b',
        TableName: this.tableName,
      };
      await this.db.update(dbParams).promise();
    } catch (error) {
      console.error(error);
    }
  }
}
