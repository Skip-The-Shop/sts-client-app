import aws from "./aws";
const { v4: uuidv4 } = require("uuid");

export default class PdfService {
  constructor() {
    this.startAfter;
    this.s3 = aws.s3;
    this.db = aws.db;
  }

  async createAWSPDFPost(doc, mainCategories, categories) {
    try {
      
      let data = { ...doc.Item, mainCategories, categories };
      let tagArray = []
      if (data.tags.length > 1) {
        data.tags.forEach((tag) => {
          if(typeof(tag.id) === 'undefined'){
            tagArray = tagArray.concat(tag);
          } else {
            tagArray = tagArray.concat(tag.id)
          }
          
        })
      } else { // just 1 
        if(typeof(data.tags[0].id) === 'undefined'){
          tagArray = tagArray.concat(data.tags[0]);
        } else {
          tagArray = tagArray.concat(data.tags[0].id)
        }
      }
      // upload PDF to s3
      let pdfPostID = uuidv4();
      let imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${pdfPostID}/${data.mainImage.name}`;
      let pdfPath = `pdfs/${pdfPostID}/${data.pdf.name}`;
      var pdfParams = {
        Bucket: 'gfit-content',
        Key: `pdfs/${pdfPostID}/${data.pdf.name}`,
        Body: data.pdf,
        ContentDisposition: "inline",
        ContentType: "application/pdf"
      }
      await aws.s3.upload(pdfParams, async function (err, pdfData) {
        if (err) {
          console.log("error", err);
        } if (pdfData) {
          // pdf uploaded -- upload image
          var imageParams = {
            Bucket: 'gfit-content',
            Key: `images/${pdfPostID}/${data.mainImage.name}`,
            Body: data.mainImage,

          }

          await aws.s3.upload(imageParams, async function (err, imageData) {
            if (err) {
              console.log("error", err);
            } if (imageData) {
              // image uploaded -- push to Dynamo
              var dbParams = {
                TableName: "PDFs",
                Item: {
                  id: pdfPostID,
                  title: data.title,
                  pdf: pdfPath,
                  dateCreated: data.dateCreated,
                  completionTime: data.completionTime,
                  author: data.author,
                  companies: data.companies,
                  experienceLevel: data.experienceLevel,
                  mainCategories: data.mainCategories,
                  mainImage: imagePath,
                  tags: tagArray,
                  deleted: true,
                }
              }
              aws.db.put(dbParams, function (err, data) {
                if (err) {
                  console.log(err);
                  return 'Error'
                } else {
                  console.log(data);
                  return "Success";
                }
              }).promise();
            }
          })
        }
      })
    } catch (error) {
      console.error(error);
      return "Error";
    }
  }


  async getExercisePDFsAll() {
    try {
      const params = {
        TableName: 'PDFs',
        FilterExpression: 'mainCategories = :mainCategories AND deleted = :deleted',
        ExpressionAttributeValues: {
          ':mainCategories': '45dd1cd5-866a-422e-a7e1-89911bf9b5ab', // hardcode exercise
          ':deleted': false
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

  async getAWSPDFsAll() {
    try {
      const params = {
        TableName: 'PDFs',
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

  async getPDFAndHidden() {
    try {
      const params = {
        TableName: 'PDFs',
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



  async getAWSPDFByID(id) {
    try {
      const params = {
        TableName: 'PDFs',
        Key: {
          id: id
        }
      }
      var result = await this.db.get(params).promise();
      return result;

    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async editAWSPDF(id, doc, mainCategories, categories) {
    try {
      
      let data = { ...doc.Item, mainCategories, categories };
      let tagArray = []
      if (data.tags.length > 1) {
        data.tags.forEach((tag) => {
          if(typeof(tag.id) === 'undefined'){
            tagArray = tagArray.concat(tag);
          } else {
            tagArray = tagArray.concat(tag.id)
          }
          
        })
      } else { // just 1 
        if(typeof(data.tags[0].id) === 'undefined'){
          tagArray = tagArray.concat(data.tags[0]);
        } else {
          tagArray = tagArray.concat(data.tags[0].id)
        }
      }
      let imagePath = '';
      let pdfPath = '';
      // check for new PDF file 
      const originalData = await this.getAWSPDFByID(id);

      // set paths 
      if (originalData.Item.mainImage !== data.mainImage) {
        imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${id}/${data.mainImage.name}`;
      } else {
        imagePath = originalData.Item.mainImage;
      }
      if (originalData.Item.pdf !== data.pdf) {
        pdfPath = `pdfs/${id}/${data.pdf.name}`;
      } else {
        pdfPath = originalData.Item.pdf;
      }

      // compare original with new and upload to s3 + dynamo accordingly 
      if (originalData.Item.mainImage !== data.mainImage) {
        // new image -- upload 
        var imageParams = {
          Bucket: 'gfit-content',
          Key: `images/${id}/${data.mainImage.name}`,
          Body: data.mainImage
        }
        await this.s3.upload(imageParams, async function (err, imageData) {
          if (err) {
            console.log("error", err);
          } if (imageData) {

            // image uploaded -- check if new PDF 
            if (originalData.Item.pdf !== data.pdf) {
              // new pdf -- upload to s3
              var pdfParams = {
                Bucket: 'gfit-content',
                Key: `pdfs/${id}/${data.pdf.name}`,
                Body: data.pdf,
                ContentDisposition: "inline",
                ContentType: "application/pdf"
              }
              await this.s3.upload(pdfParams, async function (err, pdfData) {
                if (err) {
                  console.log("error", err);
                } if (pdfData) {

                  // now we can update 
                  const dbParams = {
                    Key: {
                      id: id
                    },
                    ExpressionAttributeNames: {
                      "#a": "title",
                      "#b": "pdf",
                      "#c": "dateCreated",
                      "#d": "completionTime",
                      "#e": "author",
                      "#f": "companies",
                      "#g": "experienceLevel",
                      "#h": "mainCategories",
                      "#i": "mainImage",
                      "#j": "tags",
                    },
                    ExpressionAttributeValues: {
                      ":a": data.title,
                      ":b": pdfPath,
                      ":c": data.dateCreated,
                      ":d": data.completionTime,
                      ":e": data.author,
                      ":f": data.companies,
                      ":g": data.experienceLevel,
                      ":h": data.mainCategories,
                      ":i": imagePath,
                      ":j": tagArray,

                    },
                    UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j",
                    TableName: 'PDFs'
                  }
                  await aws.db.update(dbParams).promise().then(() => {
                    return "Success"
                  });
                }
              })
            } else {
              // not new pdf -- just upload image 
              const dbParams = {
                Key: {
                  id: id
                },
                ExpressionAttributeNames: {
                  "#a": "title",
                  "#b": "pdf",
                  "#c": "dateCreated",
                  "#d": "completionTime",
                  "#e": "author",
                  "#f": "companies",
                  "#g": "experienceLevel",
                  "#h": "mainCategories",
                  "#i": "mainImage",
                  "#j": "tags",
                },
                ExpressionAttributeValues: {
                  ":a": data.title,
                  ":b": pdfPath,
                  ":c": data.dateCreated,
                  ":d": data.completionTime,
                  ":e": data.author,
                  ":f": data.companies,
                  ":g": data.experienceLevel,
                  ":h": data.mainCategories,
                  ":i": imagePath,
                  ":j": tagArray,

                },
                UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j",
                TableName: 'PDFs'
              }
              await aws.db.update(dbParams).promise().then(() => {
                return "Success"
              });
            }
          }
        })
      } else {
        // not new image -- check for new pdf 
        if (originalData.Item.pdf !== data.pdf) {
          // new PDF -- upload to s3
          var pdfParams = {
            Bucket: 'gfit-content',
            Key: `pdfs/${id}/${data.pdf.name}`,
            Body: data.pdf,
            ContentDisposition: "inline",
            ContentType: "application/pdf"
          }
          await this.s3.upload(pdfParams, async function (err, pdfData) {
            if (err) {
              console.log("error", err);
            } if (pdfData) {
              // now we can update 
              const dbParams = {
                Key: {
                  id: id
                },
                ExpressionAttributeNames: {
                  "#a": "title",
                  "#b": "pdf",
                  "#c": "dateCreated",
                  "#d": "completionTime",
                  "#e": "author",
                  "#f": "companies",
                  "#g": "experienceLevel",
                  "#h": "mainCategories",
                  "#i": "mainImage",
                  "#j": "tags",
                },
                ExpressionAttributeValues: {
                  ":a": data.title,
                  ":b": pdfPath,
                  ":c": data.dateCreated,
                  ":d": data.completionTime,
                  ":e": data.author,
                  ":f": data.companies,
                  ":g": data.experienceLevel,
                  ":h": data.mainCategories,
                  ":i": imagePath,
                  ":j": tagArray,

                },
                UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j",
                TableName: 'PDFs'
              }
              await aws.db.update(dbParams).promise().then(() => {
                return "Success"
              });
            }
          })
        } else {
          // not new media -- just upload 
          const dbParams = {
            Key: {
              id: id
            },
            ExpressionAttributeNames: {
              "#a": "title",
              "#b": "pdf",
              "#c": "dateCreated",
              "#d": "completionTime",
              "#e": "author",
              "#f": "companies",
              "#g": "experienceLevel",
              "#h": "mainCategories",
              "#i": "mainImage",
              "#j": "tags",
            },
            ExpressionAttributeValues: {
              ":a": data.title,
              ":b": pdfPath,
              ":c": data.dateCreated,
              ":d": data.completionTime,
              ":e": data.author,
              ":f": data.companies,
              ":g": data.experienceLevel,
              ":h": data.mainCategories,
              ":i": imagePath,
              ":j": tagArray,

            },
            UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j",
            TableName: 'PDFs'
          }
          await aws.db.update(dbParams).promise().then(() => {
            return "Success"
          });
        }
      }
    } catch (e) {
      console.log(e)
      return "Error"
    }
  }


  async deletePDFPost(id, pdf, softDelete) {
    if (softDelete) {
      // add deleted to blog and push to db
      let setTo = !pdf.deleted;
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
        TableName: 'PDFs'
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
        TableName: 'PDFs'
      }
      await aws.db.delete(dbParams).promise();
      return "Success"

    }
  }

  
}