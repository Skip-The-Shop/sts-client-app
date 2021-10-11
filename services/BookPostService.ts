import aws from "./aws";
const { v4: uuidv4 } = require("uuid");

export default class BookPostService {
    constructor() {
        this.s3 = aws.s3;
        this.db = aws.db;
    }

    async createAWSBookPost(doc, mainCategories, categories) {
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
            var bookPostID = uuidv4();
            let imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${bookPostID}/${data.mainImage.name}`;
            var imageParams = {
                Bucket: 'gfit-content',
                Key: `images/${bookPostID}/${data.mainImage.name}`,
                Body: data.mainImage
            }
            this.s3.upload(imageParams, function (err, imageData) {
                if (err) {
                    console.log("error", err);
                } if (imageData) {
                    var dbParams = {
                        TableName: "Books",
                        Item: {
                            id: bookPostID,
                            title: data.title,
                            description: data.description,
                            featured: data.featured,
                            dateCreated: data.dateCreated,
                            author: data.author,
                            bookLink: data.bookLink,
                            companies: data.companies,
                            mainImage: imagePath,
                            mainCategories: data.mainCategories,
                            tags: tagArray,
                            deleted: true,
                        }
                    }

                    aws.db.put(dbParams, function (err, data) {
                        if (err) {
                            console.error(err);
                            return "Error";
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

    async getBooksAndHidden() {
        try {
            const params = {
                TableName: 'Books',
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

    async getAWSBooksAll() {
        try {
            const params = {
                TableName: 'Books',
                IndexName: "companies-dateCreated-index",
                FilterExpression: '#deleted = :deleted',
                ExpressionAttributeValues: {
                  ':deleted': false,
                  ":companies": "Global"
                },
                ExpressionAttributeNames: {
                  '#deleted': "deleted",
                  "#companies": "companies"
                },
                KeyConditionExpression: "#companies = :companies",
                ScanIndexForward: false,
            }
            let scanResults = [];
            let items;
            items = await aws.db.query(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            
            return scanResults;

        } catch (ex) {
            console.log(ex);
            return [];
        }
    }

    async getAWSBookByID(id) {
        try {
            const params = {
                TableName: 'Books',
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

    async editBookAWS(id, doc) {
        try {

            let data = { ...doc.Item }
            let imagePath = '';
            let tagArray = [];

            // sort tags out + get original Book 
            const originalBook = await this.getAWSBookByID(id);

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

            // compare old to new image 
            if (originalBook.Item.mainImage !== data.mainImage) {
                // new Image 
                imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${id}/${data.mainImage.name}`;
                var imageParams = {
                    Bucket: 'gfit-content',
                    Key: `images/${id}/${data.mainImage.name}`,
                    Body: data.mainImage
                }

                // upload 
                await aws.s3.upload(imageParams, async function (err, imageData) {
                    if (err) {
                        console.log(err);
                    }
                    if (imageData) {
                        const dbParams = {
                            Key: {
                                id: id
                            },
                            ExpressionAttributeNames: {
                                "#a": "title",
                                "#b": "description",
                                "#c": "featured",
                                "#d": "dateCreated",
                                "#e": "author",
                                "#f": "bookLink",
                                "#h": "companies",
                                "#i": "mainImage",
                                "#j": "mainCategories",
                                "#k": "tags",
                            },
                            ExpressionAttributeValues: {
                                ":a": data.title,
                                ":b": data.description,
                                ":c": data.featured,
                                ":d": data.dateCreated,
                                ":e": data.author,
                                ":f": data.bookLink,
                                ":h": data.companies,
                                ":i": imagePath,
                                ":j": data.mainCategories,
                                ":k": tagArray
                            },
                            UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #h = :h, #i = :i, #j = :j, #k = :k",
                            TableName: 'Books'
                        }
                        await aws.db.update(dbParams).promise();
                        return "Success"
                    }
                })
            } else {
                // not new image -- just upload normally 
                imagePath = originalBook.Item.mainImage;
                const dbParams = {
                    Key: {
                        id: id
                    },
                    ExpressionAttributeNames: {
                        "#a": "title",
                        "#b": "description",
                        "#c": "featured",
                        "#d": "dateCreated",
                        "#e": "author",
                        "#f": "bookLink",
                        "#h": "companies",
                        "#i": "mainImage",
                        "#j": "mainCategories",
                        "#k": "tags",
                    },
                    ExpressionAttributeValues: {
                        ":a": data.title,
                        ":b": data.description,
                        ":c": data.featured,
                        ":d": data.dateCreated,
                        ":e": data.author,
                        ":f": data.bookLink,
                        ":h": data.companies,
                        ":i": imagePath,
                        ":j": data.mainCategories,
                        ":k": tagArray
                    },
                    UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #h = :h, #i = :i, #j = :j, #k = :k",
                    TableName: 'Books'
                }
                await aws.db.update(dbParams).promise();
                return "Success"
            }


        } catch (e) {
            console.log(e);
            return "Error"
        }
    }


    async deleteBookPost(id, book, softDelete) {
        if (softDelete) {
            // add deleted to blog and push to db
            let setTo = !book.deleted
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
                TableName: 'Books'
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
                TableName: 'Books'
            }
            await aws.db.delete(dbParams).promise();
            return "Success"

        }
    }

}