import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class PodcastPostService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
  }

  async createAWSPodcast(doc, mainCategories, categories) {
    try {
      let data = {...doc.Item, mainCategories, categories};
      let tagArray = [];
      if (data.tags.length > 1) {
        data.tags.forEach(tag => {
          if (typeof tag.id === 'undefined') {
            tagArray = tagArray.concat(tag);
          } else {
            tagArray = tagArray.concat(tag.id);
          }
        });
      } else {
        // just 1
        if (typeof data.tags[0].id === 'undefined') {
          tagArray = tagArray.concat(data.tags[0]);
        } else {
          tagArray = tagArray.concat(data.tags[0].id);
        }
      }
      let podcastPostID = uuidv4();
      let imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${podcastPostID}/${data.mainImage.name}`;

      var imageParams = {
        Bucket: 'gfit-content',
        Key: `images/${podcastPostID}/${data.mainImage.name}`,
        Body: data.mainImage,
      };

      await aws.s3.upload(imageParams, function (err, imageData) {
        if (err) {
          console.log('error', err);
        }
        if (imageData) {
          var dbParams = {
            TableName: 'Podcasts',
            Item: {
              id: podcastPostID,
              title: data.title,
              description: data.description,
              featured: data.featured,
              dateCreated: data.dateCreated,
              duration: data.duration,
              isSpotify: data.isSpotify,
              spotifyEmbed: data.spotifyEmbed,
              companies: data.companies,
              mainImage: imagePath,
              mainCategories: data.mainCategories,
              tags: tagArray,
              deleted: true,
            },
          };

          aws.db
            .put(dbParams, function (err, data) {
              if (err) {
                console.error(err);
                return 'Error';
              } else {
                console.error(data);
                return 'Success';
              }
            })
            .promise();
        }
      });
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }

  async getAllAWSPodcastByMainCategory(mainCategory) {
    try {
      const params = {
        TableName: 'Podcasts',
        FilterExpression:
          'mainCategories = :mainCategories AND deleted = :deleted',
        ExpressionAttributeValues: {
          ':mainCategories': mainCategory,
          ':deleted': false,
        },
      };
      let scanResults = [];
      let items;
      do {
        items = await this.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');

      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.dateCreated > b.dateCreated) return -1;
        if (a.dateCreated < b.dateCreated) return 1;
        return 0;
      });
      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getAWSPodcastsAll() {
    try {
      const params = {
        TableName: 'Podcasts',
        FilterExpression: 'deleted = :deleted',
        ExpressionAttributeValues: {
          ':deleted': false,
        },
      };
      let scanResults = [];
      let items;
      do {
        items = await this.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');

      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.dateCreated > b.dateCreated) return -1;
        if (a.dateCreated < b.dateCreated) return 1;
        return 0;
      });
      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getPodcastsAndHidden() {
    try {
      const params = {
        TableName: 'Podcasts',
      };
      let scanResults = [];
      let items;
      do {
        items = await this.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');

      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.dateCreated > b.dateCreated) return -1;
        if (a.dateCreated < b.dateCreated) return 1;
        return 0;
      });
      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getAWSPodcastByID(id) {
    try {
      const params = {
        TableName: 'Podcasts',
        Key: {
          id: id,
        },
      };
      var result = await aws.db.get(params).promise();
      return result;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async editPodcastAWS(id, doc) {
    try {
      let data = {...doc.Item};

      let originalPod = await this.getAWSPodcastByID(id);
      let imagePath = '';
      let tagArray = [];

      // get tag format figured out -- only save ID
      if (data.tags.length > 1) {
        data.tags.forEach(tag => {
          if (typeof tag.id === 'undefined') {
            tagArray = tagArray.concat(tag);
          } else {
            tagArray = tagArray.concat(tag.id);
          }
        });
      } else {
        // just 1
        if (typeof data.tags[0].id === 'undefined') {
          tagArray = tagArray.concat(data.tags[0]);
        } else {
          tagArray = tagArray.concat(data.tags[0].id);
        }
      }

      // compare images -- old + new
      if (originalPod.Item.mainImage !== data.mainImage) {
        // new image - upload to s3
        imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${id}/${data.mainImage.name}`;
        var imageParams = {
          Bucket: 'gfit-content',
          Key: `images/${id}/${data.mainImage.name}`,
          Body: data.mainImage,
        };

        await aws.s3.upload(imageParams, async function (err, imageData) {
          if (err) {
            console.log(err);
          }
          if (imageData) {
            // upload to DB
            const dbParams = {
              Key: {
                id: id,
              },
              ExpressionAttributeNames: {
                '#a': 'title',
                '#b': 'description',
                '#c': 'featured',
                '#d': 'dateCreated',
                '#e': 'duration',
                '#f': 'isSpotify',
                '#g': 'spotifyEmbed',
                '#h': 'companies',
                '#i': 'mainImage',
                '#j': 'mainCategories',
                '#k': 'tags',
              },
              ExpressionAttributeValues: {
                ':a': data.title,
                ':b': data.description,
                ':c': data.featured,
                ':d': data.dateCreated,
                ':e': data.duration,
                ':f': data.isSpotify,
                ':g': data.spotifyEmbed,
                ':h': data.companies,
                ':i': imagePath,
                ':j': data.mainCategories,
                ':k': tagArray,
              },
              UpdateExpression:
                'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k',
              TableName: 'Podcasts',
            };
            await aws.db.update(dbParams).promise();
            return 'Success';
          }
        });
      } else {
        // not new image -- just upload with data
        imagePath = originalPod.Item.mainImage;
        const dbParams = {
          Key: {
            id: id,
          },
          ExpressionAttributeNames: {
            '#a': 'title',
            '#b': 'description',
            '#c': 'featured',
            '#d': 'dateCreated',
            '#e': 'duration',
            '#f': 'isSpotify',
            '#g': 'spotifyEmbed',
            '#h': 'companies',
            '#i': 'mainImage',
            '#j': 'mainCategories',
            '#k': 'tags',
          },
          ExpressionAttributeValues: {
            ':a': data.title,
            ':b': data.description,
            ':c': data.featured,
            ':d': data.dateCreated,
            ':e': data.duration,
            ':f': data.isSpotify,
            ':g': data.spotifyEmbed,
            ':h': data.companies,
            ':i': imagePath,
            ':j': data.mainCategories,
            ':k': tagArray,
          },
          UpdateExpression:
            'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k',
          TableName: 'Podcasts',
        };
        await aws.db.update(dbParams).promise();
        return 'Success';
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  async deletePodcastPost(id, pod, softDelete) {
    if (softDelete) {
      // add deleted to blog and push to db
      let changeTo = !pod.deleted;
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'deleted',
        },
        ExpressionAttributeValues: {
          ':a': changeTo,
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'Podcasts',
      };

      await aws.db.update(dbParams).promise();
      return 'Success';
    } else {
      console.log('hard delete');
      // remove from DB
      const dbParams = {
        Key: {
          id: id,
        },
        TableName: 'Podcasts',
      };
      await aws.db.delete(dbParams).promise();
      return 'Success';
    }
  }
}
