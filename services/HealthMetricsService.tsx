import aws from './aws';
import 'react-native-get-random-values';
const {v4: uuidv4} = require('uuid');
export default class HealthMetricsService {
  s3: any;
  db: any;
  tableName: string;
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
    this.tableName = 'HealthMetrics';
  }

  async trackAppleHealthMetrics(
    ActiveEnergyBurned: any,
    StepCount: any,
    RestingEnergy: any,
    UserID: any,
  ) {
    try {
      const id = await uuidv4();
      const params = {
        TableName: this.tableName,
        Item: {
          id,
          ActiveEnergyBurned,
          StepCount,
          UserID,
          Date: new Date().getTime(),
          RestingEnergy,
        },
      };
      this.db.put(params, function (err, result) {});
    } catch (e) {
      console.log({TRACK_ERROR: e});
    }
  }

  async trackFitBitMetrics(data: any) {
    try {
      const id = await uuidv4();
      const params = {
        TableName: this.tableName,
        Item: {
          id,
          ...data,
        },
      };
      await this.db
        .put(params, function (err, result) {
          console.log({err, result});
        })
        .promise();
    } catch (error) {
      console.log(error);
    }
  }

  async getFitbitMetricsByUser(userID) {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: 'UserID = :UserID',
        ExpressionAttributeValues: {
          ':UserID': userID,
        },
      };
      let scanResults: any[] = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');

      scanResults.sort(function (a, b) {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
      });

      // return scanResults.filter(x => x.activities !== undefined);
      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async updateFitbitMetrics(doc: any) {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          id: doc.id,
        },
        ExpressionAttributeNames: {
          '#a': 'activities',
          '#b': 'goals',
          '#c': 'summary',
        },
        ExpressionAttributeValues: {
          ':a': doc.activities,
          ':b': doc.goals,
          ':c': doc.summary,
        },
        UpdateExpression: 'SET #a = :a, #b = :b, #c = :c',
      };
      await this.db.update(params).promise();
    } catch (error) {
      console.log(error);
    }
  }
}
