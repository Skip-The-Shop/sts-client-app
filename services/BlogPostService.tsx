import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class BlogPostService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
  }

  async createAWSBlogPost(doc, mainCategories, categories) {
    try {
      let data = {...doc, mainCategories, categories}; // doc.Item ( then we can remove .Item below)
      // Upload Image to s3
      var blogPostID = uuidv4();
      let imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${blogPostID}/${data.Item.mainImage.name}`;
      let tagArray = [];

      if (data.Item.tags.length > 1) {
        data.Item.tags.forEach(tag => {
          if (typeof tag.id === 'undefined') {
            tagArray = tagArray.concat(tag);
          } else {
            tagArray = tagArray.concat(tag.id);
          }
        });
      } else {
        // just 1
        if (typeof data.Item.tags[0].id === 'undefined') {
          tagArray = tagArray.concat(data.Item.tags[0]);
        } else {
          tagArray = tagArray.concat(data.Item.tags[0].id);
        }
      }

      var imageParams = {
        Bucket: 'gfit-content',
        Key: `images/${blogPostID}/${data.Item.mainImage.name}`,
        Body: data.Item.mainImage,
      };

      aws.s3.upload(imageParams, function (err, imageData) {
        if (err) {
          console.log('error', err);
        }
        if (imageData) {
          var dbParams = {
            TableName: 'Blogs',
            Item: {
              id: blogPostID,
              title: data.Item.title,
              body: data.Item.body,
              featured: data.Item.featured,
              dateCreated: data.Item.dateCreated,
              author: data.Item.author,
              medicallyReviewed: data.Item.medicallyReviewed,
              companies: data.Item.companies,
              mainImage: imagePath,
              mainCategories: data.Item.mainCategories,
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
                console.log(data);
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
  async getAWSBlogPostsByMainCategories(mainCategories) {
    try {
      const params = {
        TableName: 'Blogs',
        FilterExpression:
          'mainCategories = :mainCategories AND deleted = :deleted',
        ExpressionAttributeValues: {
          ':mainCategories': mainCategories,
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

  async getBlogPostsAndHidden() {
    try {
      const params = {
        TableName: 'Blogs',
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

  async getAWSBlogPostsAll() {
    try {
      const params = {
        TableName: 'Blogs',
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

  async getAWSFeaturedBlogPosts() {
    try {
      const params = {
        TableName: 'Blogs',
        FilterExpression: 'featured = :featured',
        ExpressionAttributeValues: {
          ':featured': true,
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

  async getAWSBlogPostByID(id) {
    try {
      const params = {
        TableName: 'Blogs',
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

  async editBlogPostAWS(id, doc) {
    try {
      // first grab the old post
      let data = {...doc.Item};
      const originalBlog = await this.getAWSBlogPostByID(id);
      let imagePath = '';
      let tagArray = [];
      // get tags sorted out --
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

      // compare old image to new
      if (originalBlog.Item.mainImage !== data.mainImage) {
        imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${id}/${data.mainImage.name}`;
        var imageParams = {
          Bucket: 'gfit-content',
          Key: `images/${id}/${data.mainImage.name}`,
          Body: data.mainImage,
        };
        // upload new image
        await aws.s3.upload(imageParams, async function (err, imageData) {
          if (err) {
            console.log('error', err);
          }
          if (imageData) {
            // upload here
            const dbParams = {
              Key: {
                id: id,
              },
              ExpressionAttributeNames: {
                '#a': 'title',
                '#b': 'body',
                '#c': 'featured',
                '#d': 'dateCreated',
                '#e': 'author',
                '#f': 'companies',
                '#g': 'mainImage',
                '#h': 'mainCategories',
                '#i': 'medicallyReviewed',
                '#j': 'tags',
              },
              ExpressionAttributeValues: {
                ':a': data.title,
                ':b': data.body,
                ':c': data.featured,
                ':d': data.dateCreated,
                ':e': data.author,
                ':f': data.companies,
                ':g': imagePath,
                ':h': data.mainCategories,
                ':i': '', // for now
                ':j': tagArray,
              },
              UpdateExpression:
                'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j',
              TableName: 'Blogs',
            };
            await aws.db.update(dbParams).promise();
            return 'Success';
          }
        });
      } else {
        imagePath = originalBlog.Item.mainImage;
        const dbParams = {
          Key: {
            id: id,
          },
          ExpressionAttributeNames: {
            '#a': 'title',
            '#b': 'body',
            '#c': 'featured',
            '#d': 'dateCreated',
            '#e': 'author',
            '#f': 'companies',
            '#g': 'mainImage',
            '#h': 'mainCategories',
            '#i': 'medicallyReviewed',
            '#j': 'tags',
          },
          ExpressionAttributeValues: {
            ':a': data.title,
            ':b': data.body,
            ':c': data.featured,
            ':d': data.dateCreated,
            ':e': data.author,
            ':f': data.companies,
            ':g': imagePath,
            ':h': data.mainCategories,
            ':i': '',
            ':j': tagArray,
          },
          UpdateExpression:
            'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j',
          TableName: 'Blogs',
        };
        await aws.db.update(dbParams).promise();
        return 'Success';
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  getBlogImage(imagePath) {
    const data = this.s3
      .getObject({
        Bucket: 'gfit-content',
        Key: imagePath,
      })
      .promise();
    return data;
  }

  async deleteBlogPost(id, blog, softDelete) {
    if (softDelete) {
      // add deleted to blog and push to db
      let changeTo = !blog.deleted;

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
        TableName: 'Blogs',
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
        TableName: 'Blogs',
      };
      await aws.db.delete(dbParams).promise();
      return 'Success';
    }
  }
}
