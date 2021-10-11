import aws from "./aws";
const { v4: uuidv4 } = require("uuid");

export default class WebinarsService {
  collection = "";
  imageFolder = "";

  constructor() {
    this.collection = "Webinars"
    this.imageFolder = "images/webinar/"
    this.s3 = aws.s3;
    this.db = aws.db;
  }

  async createAWSWebinar(doc, mainCategories, categories) {
    try {

      let data = { ...doc.Item, mainCategories, categories };
      let tagArray = []
      if (data.tags.length > 1) {
        data.tags.forEach((tag) => {
          if (typeof (tag.id) === 'undefined') {
            tagArray = tagArray.concat(tag);
          } else {
            tagArray = tagArray.concat(tag.id)
          }

        })
      } else { // just 1 
        if (typeof (data.tags[0].id) === 'undefined') {
          tagArray = tagArray.concat(data.tags[0]);
        } else {
          tagArray = tagArray.concat(data.tags[0].id)
        }
      }
      // Upload Image to s3 
      let webinarID = uuidv4();
      let imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${webinarID}/${data.mainImage.name}`;
      var imageParams = {
        Bucket: 'gfit-content',
        Key: `images/${webinarID}/${data.mainImage.name}`,
        Body: data.mainImage
      }

      const dateCreated = data.dateCreated === "" ? new Date(Date.now()).toDateString() : data.dateCreated;

      this.s3.upload(imageParams, function (err, imageData) {
        if (err) {
          console.log("error", err);
        } if (imageData) {
          var dbParams = {
            TableName: "Webinars",
            Item: {
              id: webinarID,
              title: data.title,
              description: data.description,
              featured: data.featured,
              dateCreated: dateCreated,
              host: data.host,
              link: data.link,
              onDemandLink: data.onDemandLink,
              date: data.date,
              companies: data.companies,
              mainImage: imagePath,
              mainCategories: data.mainCategories,
              tags: tagArray,
              time: data.time,
              deleted: true,
            }
          }

          aws.db.put(dbParams, function (err, data) {
            if (err) {
              console.error(err);
              return 'Error'
            } else {
              console.error(data);
              return "Success";
            }
          }).promise();
        }
      })
    } catch (error) {
      console.error(error);
      return "Error";
    }
  }

  async getWebinarsAndHidden() {
    try {
      const params = {
        TableName: 'Webinars',
      }
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== "undefined");

      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.dateCreated > b.dateCreated) return -1;
        if (a.dateCreated < b.dateCreated) return 1;
        return 0;
      })
      return scanResults;

    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getWebinarsOnDemand() {
    try {
      const params = {
        TableName: 'Webinars',
        FilterExpression: 'deleted = :deleted AND onDemandLink <> :onDemand',
        ExpressionAttributeValues: {
          ':deleted': false,
          ':onDemand': ''
        }
      }
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== "undefined");
      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
      })
      return scanResults;

    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getWebinarsNotOnDemand() {
    try {
      const params = {
        TableName: 'Webinars',
        FilterExpression: 'deleted = :deleted AND onDemandLink = :onDemand',
        ExpressionAttributeValues: {
          ':deleted': false,
          ':onDemand': ''
        }
      }
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== "undefined");
      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
      })
      return scanResults;

    } catch (ex) {
      console.log(ex);
      return [];
    }
  }


  async getAWSWebinarsAll() {
    try {
      const params = {
        TableName: 'Webinars',
        FilterExpression: 'deleted = :deleted',
        ExpressionAttributeValues: {
          ':deleted': false,
        }
      }
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== "undefined");
      // sort by dateCreated
      scanResults.sort(function (a, b) {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
      })
      return scanResults;

    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getAWSWebinarsByID(id) {
    try {
      const params = {
        TableName: 'Webinars',
        Key: {
          id: id
        }
      }
      var result = await aws.db.get(params).promise();
      return result;

    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async editWebinarAWS(id, doc) {
    try {
      let data = { ...doc.Item }
      let imagePath = '';
      let tagArray = [];

      // get original and sort out tags 
      const originalWeb = await this.getAWSWebinarsByID(id);

      if (data.tags.length > 1) {
        data.tags.forEach((tag) => {
          if (typeof (tag.id) === 'undefined') {
            tagArray = tagArray.concat(tag);
          } else {
            tagArray = tagArray.concat(tag.id)
          }

        })
      } else { // just 1 
        if (typeof (data.tags[0].id) === 'undefined') {
          tagArray = tagArray.concat(data.tags[0]);
        } else {
          tagArray = tagArray.concat(data.tags[0].id)
        }
      }

      // compare old image to new 
      if (originalWeb.Item.mainImage !== data.mainImage) {
        // new image
        imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${id}/${data.mainImage.name}`;
        var imageParams = {
          Bucket: 'gfit-content',
          Key: `images/${id}/${data.mainImage.name}`,
          Body: data.mainImage
        }

        await aws.s3.upload(imageParams, async function (err, imageData) {
          if (err) {
            console.log('error', err)
          }
          if (imageData) {
            // upload dynamo 
            const dbParams = {
              Key: {
                id: id
              },
              ExpressionAttributeNames: {
                "#a": "title",
                "#b": "description",
                "#c": "featured",
                "#d": "dateCreated",
                "#e": "host",
                "#f": "link",
                "#g": "onDemandLink",
                "#h": "date",
                "#i": "companies",
                "#j": "mainImage",
                "#k": "mainCategories",
                "#l": "tags",
                "#m": "time",
              },
              ExpressionAttributeValues: {
                ":a": data.title,
                ":b": data.description,
                ":c": data.featured,
                ":d": data.dateCreated,
                ":e": data.host,
                ":f": data.link,
                ":g": data.onDemandLink,
                ":h": data.date,
                ":i": data.companies,
                ":j": imagePath,
                ":k": data.mainCategories,
                ":l": tagArray,
                ":m": data.time,
              },
              UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l, #m = :m",
              TableName: 'Webinars'
            }
            await aws.db.update(dbParams).promise();
            return "Success"
          }
        })
      } else {
        // not new image
        imagePath = originalWeb.Item.mainImage;
        const dbParams = {
          Key: {
            id: id
          },
          ExpressionAttributeNames: {
            "#a": "title",
            "#b": "description",
            "#c": "featured",
            "#d": "dateCreated",
            "#e": "host",
            "#f": "link",
            "#g": "onDemandLink",
            "#h": "date",
            "#i": "companies",
            "#j": "mainImage",
            "#k": "mainCategories",
            "#l": "tags",
            "#m": "time",
          },
          ExpressionAttributeValues: {
            ":a": data.title,
            ":b": data.description,
            ":c": data.featured,
            ":d": data.dateCreated,
            ":e": data.host,
            ":f": data.link,
            ":g": data.onDemandLink,
            ":h": data.date,
            ":i": data.companies,
            ":j": imagePath,
            ":k": data.mainCategories,
            ":l": tagArray,
            ":m": data.time,
          },
          UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l, #m = :m",
          TableName: 'Webinars'
        }
        await aws.db.update(dbParams).promise();
        return "Success"
      }

    } catch (e) {
      console.log(e);
      return "Error";
    }
  }

  async editAWSWebinar(id, doc, mainCategories, categories) {
    try {

      let data = { ...doc.Item, mainCategories, categories };
      let tagArray = []
      if (data.tags.length > 1) {
        data.tags.forEach((tag) => {
          tagArray = tagArray.concat(tag.id)
        })
      } else { // just 1 
        tagArray = data.tags[0].id
      }
      let imagePath = `images/${id}/${data.mainImage.name}`;
      if (data.mainImage) { // has an image 
        // Remove old image from storage

        // has a new image ! --- here we add new params and add to storage 
        // delete old image from storage 
        var imageParams = {
          Bucket: 'gfit-content',
          Key: `images/${id}/${data.mainImage.name}`,
          Body: data.mainImage
        }
        aws.s3.upload(imageParams, async function (err, imageData) {
          if (err) {
            console.log("error", err);
          } if (imageData) {
            // create new params    --- could probably just do above 
            // create upload params 
            const dbParams = {
              Key: {
                id: id
              },
              ExpressionAttributeNames: {
                "#a": "title",
                "#b": "description",
                "#c": "featured",
                "#d": "dateCreated",
                "#e": "host",
                "#f": "link",
                "#g": "onDemandLink",
                "#h": "date",
                "#i": "companies",
                "#j": "mainImage",
                "#k": "mainCategories",
                "#l": "tags",
                "#m": "time",
              },
              ExpressionAttributeValues: {
                ":a": data.title,
                ":b": data.description,
                ":c": data.featured,
                ":d": data.dateCreated,
                ":e": data.host,
                ":f": data.link,
                ":g": data.onDemandLink,
                ":h": data.date,
                ":i": data.companies,
                ":j": imagePath,
                ":k": data.mainCategories,
                ":l": tagArray,
                ":m": data.time,
              },
              UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l, #m = :m",
              TableName: 'Webinars'
            }
            await aws.db.update(dbParams).promise();
            return "Success"
            // add new image to storage and change data.mainImage to new 
          }
        }) // need delete funct still 

      }

    } catch (err) {
      console.log(err)
      return 'Error'
    }
  }



  async deleteWebinarPost(id, web, softDelete) {
    if (softDelete) {
      // add deleted to blog and push to db
      let setTo = !web.deleted;
      const dbParams = {
        Key: {
          id: id
        },
        ExpressionAttributeNames: {
          "#a": "deleted",
        },
        ExpressionAttributeValues: {
          ":a": setTo,
        },
        UpdateExpression: "SET #a = :a",
        TableName: 'Webinars'
      }

      await aws.db.update(dbParams).promise();
      return "Success"

    } else {
      console.log('hard delete')
      // remove from DB 
      const dbParams = {
        Key: {
          id: id
        },
        TableName: 'Webinars'
      }
      await aws.db.delete(dbParams).promise();
      return "Success"

    }
  }
}
