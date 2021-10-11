import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class ProviderService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
    this.encode = aws.encode;
  }

  async getAllProviders() {
    try {
      const params = {
        TableName: 'Providers',
      };
      let scanResults = [];
      let items;
      do {
        items = await this.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      return scanResults;
    } catch (error) {
      console.error(error);
    }
  }

  async createProvider(doc) {
    try {
      let data = {...doc.Item};
      var providerID = uuidv4();
      let imagePath = `images/${providerID}/${data.profilePic.name}`;

      var imageParams = {
        Bucket: 'gfit-content',
        Key: imagePath,
        Body: data.profilePic,
      };

      this.s3.upload(imageParams, function (err, data) {
        if (err) {
          console.log('Error', err);
        }
        if (data) {
          console.log('Upload Success', data.Location);
        }
      });

      const dbParams = {
        Item: {
          id: providerID,
          name: data.name,
          bio: data.bio,
          link: data.link,
          providerType: data.providerType,
          profilePic: imagePath,
          state: data.state,
          sessions: data.sessions,
          delete: false,
          designations: data.designations,
          qualifications: data.qualifications,
          sessionTypes: data.sessionTypes,
        },
        TableName: 'Providers',
      };
      await this.db
        .put(dbParams, function (err) {
          if (err) {
            console.error(err);
          }
        })
        .promise();
      return providerID;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  async getProviderByID(id) {
    try {
      const params = {
        Key: {
          id: id,
        },
        TableName: 'Providers',
      };
      const response = await this.db.get(params).promise();
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getProviderTypeByID(id) {
    try {
      const params = {
        Key: {
          id: id,
        },
        TableName: 'ProviderType',
      };
      const response = await aws.db.get(params).promise();
      return response.Item;
    } catch (error) {
      console.error(error);
    }
  }

  async editProvider(id, doc) {
    try {
      const data = doc.Item;
      let mainImage = data.profilePic;
      if (data.profilePic.name) {
        let imagePath = `images/${id}/${data.profilePic.name}`;

        var imageParams = {
          Bucket: 'gfit-content',
          Key: imagePath,
          Body: data.profilePic,
        };

        this.s3.upload(imageParams, function (err, data) {
          if (err) {
            console.log('Error', err);
          }
          if (data) {
            console.log('Upload Success', data.Location);
          }
        });
        mainImage = imagePath;
      }
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'name',
          '#b': 'bio',
          '#c': 'link',
          '#d': 'providerType',
          '#e': 'state',
          '#f': 'sessions',
          '#g': 'profilePic',
          '#h': 'sessionTypes',
          '#i': 'designations',
          '#j': 'qualifications',
        },
        ExpressionAttributeValues: {
          ':a': data.name,
          ':b': data.bio,
          ':c': data.link,
          ':d': data.providerType,
          ':e': data.state,
          ':f': data.sessions,
          ':g': mainImage,
          ':h': data.sessionTypes,
          ':i': data.designations,
          ':j': data.qualifications,
        },
        UpdateExpression:
          'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j',
        TableName: 'Providers',
      };
      await this.db.update(dbParams).promise();
    } catch (error) {
      console.error(error);
    }
  }

  async getFilteredProviders(req) {
    try {
      const {providerType, sessions, state} = req;
      const params = {
        TableName: 'Providers',
        FilterExpression:
          'contains (providerType, :providerType) OR contains (sessions, :sessions) OR contains (state, :state)',
        ExpressionAttributeValues: {
          ':providerType': providerType,
          ':sessions': sessions,
          ':state': state,
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
      console.log({e});
    }
  }
}
