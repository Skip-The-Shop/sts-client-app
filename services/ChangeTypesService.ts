import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class ChangeTypeService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
  }

  async createChangeType(doc) {
    try {
      //const dateCreated = new Date(Date.now()); // might not even need --
      let changeTypeID = uuidv4();

      var dbParams = {
        TableName: 'ChangeTypes',
        Item: {
          id: changeTypeID,
          title: doc.Item.title,
          services: doc.Item.services ? doc.Item.services : [''],
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

  async getAllChangeTypes() {
    try {
      const params = {
        TableName: 'ChangeTypes',
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
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
