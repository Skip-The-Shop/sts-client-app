import aws from './aws';

export default class ProviderTypeService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
    this.encode = aws.encode;
  }
  async getProviderTypes() {
    try {
      const params = {
        TableName: 'ProviderType',
      };
      let scanResults = [];
      let items;
      do {
        items = await this.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      return scanResults;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
}
