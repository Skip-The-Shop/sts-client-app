import aws from "./aws";
const { v4: uuidv4 } = require("uuid");

export default class BodyPartService {
    constructor() {
        this.db = aws.db;
        this.s3 = aws.s3; 
    }

    async createAWSTag(doc, image){
        try{
            let data = { ...doc.Item };
            let tagID = uuidv4(); 
            // get mainCategory id ? --- 
            let imagePath = '';
            if (image !== null) {
              imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/tags/${tagID}/${image.name}`;
              const imageParams = {
                Bucket: 'gfit-content',
                Key: `tags/${tagID}/${image.name}`,
                Body: image,
                ACL: "public-read"
              }
              await aws.s3.upload(imageParams).promise();
            }
            
            var dbParams = {
                TableName: "BodyPart",
                Item: {
                   id: tagID,
                   tag: data.tag,
                   textColor: data.textColor,
                   backgroundColor: data.backgroundColor,
                   image: imagePath
                }
            }
            aws.db.put(dbParams, function(err, data){
                if (err) {
                    console.error(err);
                    return "Error";
                } else {
                    console.error(data);
                    return "Success";
                }
            })
            return "Success";
        }catch(e){
            console.log(e); 
            return "Error";
        }
    }

    async getTagByID(id){
        try {
            const params = {
              TableName: 'BodyPart',
              Key: {
                id: id
              }
            }
            const result = await aws.db.get(params).promise();
            return result;
      
          } catch (ex) {
            console.log(ex);
            return [];
          }
    }

    async getAllAWSTags() {
        try {
            const params = {
              TableName: 'BodyPart',
            }
            let scanResults = [];
            let items;
            do {
              items = await aws.db.scan(params).promise();
              items.Items.forEach((item) => scanResults.push(item));
              params.ExclusiveStartKey = items.LastEvaluatedKey;
            } while (typeof items.LastEvaluatedKey !== "undefined");

            return scanResults;
      
          } catch (ex) {
            console.log(ex);
            return [];
          }
    }


}