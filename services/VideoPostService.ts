import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class VideoPostService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
    this.encode = aws.encode;
  }

  async createAWSVideo(doc, mainCategories, categories) {
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
      // Upload Image to s3
      let videoPostID = uuidv4();
      let imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${videoPostID}/${data.mainImage.name}`;
      var imageParams = {
        Bucket: 'gfit-content',
        Key: `images/${videoPostID}/${data.mainImage.name}`,
        Body: data.mainImage,
      };

      const dateCreated =
        data.dateCreated === ''
          ? new Date(Date.now()).toDateString()
          : data.dateCreated;

      aws.s3.upload(imageParams, async function (err, imageData) {
        if (err) {
          console.log('error', err);
        }
        if (imageData) {
          var dbParams = {
            TableName: 'Videos',
            Item: {
              id: videoPostID,
              title: data.title,
              author: data.author,
              description: data.description,
              featured: data.featured,
              dateCreated: dateCreated,
              vimeoID: data.vimeoID,
              duration: data.duration,
              experienceLevel: data.experienceLevel,
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

  async getVideoImage(imagePath) {
    const data = await this.s3
      .getObject({
        Bucket: 'gfit-content',
        Key: imagePath,
      })
      .promise();
    return data;
  }

  async getAllVideosByTag(tag) {
    // this only works if one tag -- more than one we need solution (.filter?)
    const params = {
      TableName: 'Videos',
      FilterExpression: 'tags[0] = :tag AND deleted = :deleted',
      ExpressionAttributeValues: {
        ':tag': tag,
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
    // sort by dateCreated
    scanResults.sort(function (a, b) {
      if (a.dateCreated > b.dateCreated) {
        return -1;
      }
      if (a.dateCreated < b.dateCreated) {
        return 1;
      }
      return 0;
    });
    return scanResults;
  }

  async getAllVideosByMainCategory(mainCategories) {
    const params = {
      TableName: 'Videos',
      IndexName: 'companies-dateCreated-index',
      FilterExpression:
        'mainCategories = :mainCategories AND #deleted = :deleted',
      ExpressionAttributeValues: {
        ':mainCategories': mainCategories,
        ':deleted': false,
        ':companies': 'Global',
      },
      ExpressionAttributeNames: {
        '#deleted': 'deleted',
        '#companies': 'companies',
      },
      KeyConditionExpression: '#companies = :companies',
      ScanIndexForward: false,
    };

    let scanResults = [];
    let items;
    items = await aws.db.query(params).promise();
    items.Items.forEach(item => scanResults.push(item));
    return scanResults;
  }

  async getAWSVideosAll() {
    try {
      const params = {
        TableName: 'Videos',
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
      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.dateCreated > b.dateCreated) {
          return -1;
        }
        if (a.dateCreated < b.dateCreated) {
          return 1;
        }
        return 0;
      });
      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getFirst6VideoPosts() {
    try {
      const params = {
        TableName: 'Videos',
        IndexName: 'companies-dateCreated-index',
        FilterExpression: '#deleted = :deleted',
        ExpressionAttributeValues: {
          ':deleted': false,
          ':companies': 'Global',
        },
        ExpressionAttributeNames: {
          '#deleted': 'deleted',
          '#companies': 'companies',
        },
        KeyConditionExpression: '#companies = :companies',
        ScanIndexForward: false,
        Limit: 6,
      };

      var items;
      var scanResults = [];
      items = await aws.db.query(params).promise();
      items.Items.forEach(item => scanResults.push(item));

      // scanResults.sort(function (a, b) {
      //   if (a.dateCreated > b.dateCreated) return -1;
      //   if (a.dateCreated < b.dateCreated) return 1;
      //   return 0;
      // })

      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getVideosAndHidden() {
    try {
      const params = {
        TableName: 'Videos',
      };
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.dateCreated > b.dateCreated) {
          return -1;
        }
        if (a.dateCreated < b.dateCreated) {
          return 1;
        }
        return 0;
      });
      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getAWSVideoByID(id) {
    try {
      const params = {
        TableName: 'Videos',
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

  async editVideoAWS(id, doc) {
    try {
      let data = {...doc.Item};
      let imagePath = '';
      let tagArray = [];
      // grab old post
      const originalVideo = await this.getAWSVideoByID(id);
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

      // compare old image to new --
      if (originalVideo.Item.mainImage !== data.mainImage) {
        // means its a new image
        imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${id}/${data.mainImage.name}`;
        var imageParams = {
          Bucket: 'gfit-content',
          Key: `images/${id}/${data.mainImage.name}`,
          Body: data.mainImage,
        };

        await aws.s3.upload(imageParams, async function (err, imageData) {
          if (err) {
            console.log('error', err);
          }
          if (imageData) {
            // upload to Dynamo
            const dbParams = {
              Key: {
                id: id,
              },
              ExpressionAttributeNames: {
                '#a': 'title',
                '#b': 'author',
                '#c': 'description',
                '#d': 'featured',
                '#e': 'dateCreated',
                '#f': 'vimeoID',
                '#g': 'duration',
                '#h': 'experienceLevel',
                '#i': 'companies',
                '#j': 'mainImage',
                '#k': 'mainCategories',
                '#l': 'tags',
              },
              ExpressionAttributeValues: {
                ':a': data.title,
                ':b': data.author,
                ':c': data.description,
                ':d': false, // no featured check on cms
                ':e': data.dateCreated,
                ':f': data.vimeoID,
                ':g': data.duration,
                ':h': data.experienceLevel,
                ':i': data.companies,
                ':j': imagePath,
                ':k': data.mainCategories,
                ':l': tagArray,
              },
              UpdateExpression:
                'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l',
              TableName: 'Videos',
            };
            await aws.db.update(dbParams).promise();
            return 'Success';
          }
        });
      } else {
        // no new image --- just upload as normal --
        imagePath = originalVideo.Item.mainImage;

        const dbParams = {
          Key: {
            id: id,
          },
          ExpressionAttributeNames: {
            '#a': 'title',
            '#b': 'author',
            '#c': 'description',
            '#d': 'featured',
            '#e': 'dateCreated',
            '#f': 'vimeoID',
            '#g': 'duration',
            '#h': 'experienceLevel',
            '#i': 'companies',
            '#j': 'mainImage',
            '#k': 'mainCategories',
            '#l': 'tags',
          },
          ExpressionAttributeValues: {
            ':a': data.title,
            ':b': data.author,
            ':c': data.description,
            ':d': false, // no featured check on cms
            ':e': data.dateCreated,
            ':f': data.vimeoID,
            ':g': data.duration,
            ':h': data.experienceLevel,
            ':i': data.companies,
            ':j': imagePath,
            ':k': data.mainCategories,
            ':l': tagArray,
          },
          UpdateExpression:
            'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l',
          TableName: 'Videos',
        };
        await aws.db.update(dbParams).promise();
        return 'Success';
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  async editAWSVideo(id, doc, mainCategories, categories) {
    try {
      let data = {...doc.Item, mainCategories, categories};
      let tagArray = [];
      if (data.tags.length > 1) {
        data.tags.forEach(tag => {
          tagArray = tagArray.concat(tag.id);
        });
      } else {
        // just 1
        tagArray = [data.tags[0].id];
      }
      let imagePath = `images/${id}/${data.mainImage.name}`;
      if (data.mainImage) {
        // has an image
        // Remove old image from storage

        // has a new image ! --- here we add new params and add to storage
        // delete old image from storage
        var imageParams = {
          Bucket: 'gfit-content',
          Key: `images/${id}/${data.mainImage.name}`,
          Body: data.mainImage,
        };
        this.s3.upload(imageParams, async function (err, imageData) {
          if (err) {
            console.log('error', err);
          }
          if (imageData) {
            // create new params    --- could probably just do above
            // create upload params
            const dbParams = {
              Key: {
                id: id,
              },
              ExpressionAttributeNames: {
                '#a': 'title',
                '#b': 'author',
                '#c': 'description',
                '#d': 'featured',
                '#e': 'dateCreated',
                '#f': 'vimeoID',
                '#g': 'duration',
                '#h': 'experienceLevel',
                '#i': 'companies',
                '#j': 'mainImage',
                '#k': 'mainCategories',
                '#l': 'tags',
              },
              ExpressionAttributeValues: {
                ':a': data.title,
                ':b': data.author,
                ':c': data.description,
                ':d': false, // no featured check on cms
                ':e': data.dateCreated,
                ':f': data.vimeoID,
                ':g': data.duration,
                ':h': data.experienceLevel,
                ':i': data.companies,
                ':j': imagePath,
                ':k': data.mainCategories,
                ':l': tagArray,
              },
              UpdateExpression:
                'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l',
              TableName: 'Videos',
            };
            await aws.db.update(dbParams).promise();
            return 'Success';
            // add new image to storage and change data.mainImage to new
          }
        }); // need delete funct still
      } else {
        // no new image

        const dbParams = {
          Key: {
            id: id,
          },
          ExpressionAttributeNames: {
            '#a': 'title',
            '#b': 'author',
            '#c': 'description',
            '#d': 'featured',
            '#e': 'dateCreated',
            '#f': 'vimeoID',
            '#g': 'duration',
            '#h': 'experienceLevel',
            '#i': 'companies',
            '#j': 'mainImage',
            '#k': 'mainCategories',
            '#l': 'tags',
          },
          ExpressionAttributeValues: {
            ':a': data.title,
            ':b': data.author,
            ':c': data.description,
            ':d': false, // no featured check on cms
            ':e': data.dateCreated,
            ':f': data.vimeoID,
            ':g': data.duration,
            ':h': data.experienceLevel,
            ':i': data.companies,
            ':k': data.mainCategories,
            ':l': tagArray,
          },
          UpdateExpression:
            'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #k = :k, #l = :l',
          TableName: 'Videos',
        };
        await aws.db.update(dbParams).promise();
        return 'Success';
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  async deleteVideoPost(id, vid, softDelete) {
    if (softDelete) {
      // add deleted to blog and push to db
      let changeTo = !vid.deleted;
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
        TableName: 'Videos',
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
        TableName: 'Videos',
      };
      await aws.db.delete(dbParams).promise();
      return 'Success';
    }
  }
}
