import aws from './aws';
const {v4: uuidv4} = require('uuid');
export default class AuthorService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
    this.encode = aws.encode;
  }

  async createAWSAuthor(doc, mainCategories) {
    try {
      let data = {...doc.Item};
      var authorID = uuidv4();
      const dbParams = {
        Item: {
          id: authorID,
          tag: data.tag,
          mainCategories: mainCategories,
        },
        TableName: 'Authors',
      };
      await aws.db
        .put(dbParams, function (err) {
          if (err) {
            console.error(err);
          }
        })
        .promise();
      return authorID;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  async getAuthorsByMainCategory(id) {
    try {
      const params = {
        TableName: 'Authors',
        FilterExpression: 'mainCategories = :mainCategories',
        ExpressionAttributeValues: {
          ':mainCategories': id,
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
      return 'Error';
    }
  }
  async getAuthorByID(id) {
    try {
      if (typeof id !== undefined) {
        const params = {
          TableName: 'Authors',
          Key: {
            id: id,
          },
        };
        var result = await aws.db.get(params).promise();
        return result;
      }
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getAuthors() {
    try {
      const params = {
        TableName: 'Authors',
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

  // ******************************************** FIREBASE BELOW

  getAuthorsByDocument(document) {
    try {
      const response = this.firebase.db
        .collection('Authors')
        .doc(`${document}`)
        .get()
        .then(snapshot => {
          const doc = {...snapshot.data()};
          const authors = Object.values(doc);
          return authors[0];
        });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  createAuthor(newAuthor, mainCategory) {
    try {
      switch (mainCategory) {
        case 'Exercise':
          this.firebase.db
            .collection('Authors')
            .doc(`${mainCategory}`)
            .update({
              exerciseAuthors:
                this.firebase.firestore.FieldValue.arrayUnion(newAuthor),
            });
          break;
        case 'Lifestyle':
          this.firebase.db
            .collection('Authors')
            .doc(`${mainCategory}`)
            .update({
              lifestyleAuthors:
                this.firebase.firestore.FieldValue.arrayUnion(newAuthor),
            });
          break;
        case 'Mental Health':
          this.firebase.db
            .collection('Authors')
            .doc(`${mainCategory}`)
            .update({
              mentalAuthors:
                this.firebase.firestore.FieldValue.arrayUnion(newAuthor),
            });
          break;
        default:
          this.firebase.db
            .collection('Authors')
            .doc(`${mainCategory}`)
            .update({
              nutritionAuthors:
                this.firebase.firestore.FieldValue.arrayUnion(newAuthor),
            });
          break;
      }
      return 'Success';
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }
}
