import aws from "./aws";
const { v4: uuidv4 } = require("uuid");

export default class MeditationService {
    collection = "";

    constructor() {
        this.collection = "Meditations"
        this.s3 = aws.s3;
        this.db = aws.db;
    }

    async createAWSMeditation(doc, mainCategories) {
        try {
            let data = { ...doc.Item, mainCategories };
            let tagArray = []
            if (data.tags.length > 1) {
                data.tags.forEach((tag) => {
                    if (typeof (tag.id) === 'undefined') {
                        tagArray = tagArray.concat(tag);
                    } else {
                        tagArray = tagArray.concat(tag.id)
                    }

                })
            } else if (data.tags.length > 0) { // just 1 
                if (typeof (data.tags[0].id) === 'undefined') {
                    tagArray = tagArray.concat(data.tags[0]);
                } else {
                    tagArray = tagArray.concat(data.tags[0].id)
                }
            }
            // Upload sound file to s3 
            let medPostID = uuidv4();
            let imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${medPostID}/${data.mainImage.name}`;
            let audioPath = `audio/${medPostID}/${data.soundFile.name}`;
            var audioParams = {
                Bucket: 'gfit-content',
                Key: `audio/${medPostID}/${data.soundFile.name}`,
                Body: data.soundFile
            }

            const dateCreated = data.dateCreated === "" ? new Date(Date.now()).toDateString() : data.dateCreated;

            aws.s3.upload(audioParams, function (err, audioData) {
                if (err) {
                    console.log("error", err);
                } if (audioData) {
                    // audio uploaded -- uploading image
                    var imageParams = {
                        Bucket: 'gfit-content',
                        Key: `images/${medPostID}/${data.mainImage.name}`,
                        Body: data.mainImage
                    }
                    aws.s3.upload(imageParams, function (err, imageData) {
                        if (err) {
                            console.log("error", err);
                        } if (imageData) {
                            var dbParams = {
                                TableName: "Meditations",
                                Item: {
                                    id: medPostID,
                                    title: data.title,
                                    description: data.description,
                                    featured: data.featured,
                                    dateCreated,
                                    author: data.author,
                                    duration: data.duration,
                                    experienceLevel: data.experienceLevel,
                                    soundFile: audioPath,
                                    companies: data.companies,
                                    mainImage: imagePath,
                                    mainCategories: data.mainCategories,
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

    async getAWSMeditationsAll() {
        try {
            const params = {
                TableName: 'Meditations',
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

    async getMeditationsAndHidden() {
        try {
            const params = {
                TableName: 'Meditations',
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

    async getAWSMeditationByID(id) {
        try {
            const params = {
                TableName: 'Meditations',
                Key: {
                    id: id
                }
            }
            var result = await this.db.get(params).promise()
            return result
        } catch (ex) {
            console.log(ex);
            return [];
        }
    }

    async editAWSMeditation(id, doc, mainCategories, categories) {   // -- this is a mess but it works --- 
        try {
            // check for new sound file 
            // Get original data
            let data = { ...doc.Item, mainCategories, categories };
            const originalData = await this.getAWSMeditationByID(id);
            let imagePath = '';
            let audioPath = '';
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
                if (typeof (data.tags[0]) === 'undefined' || typeof (data.tags[0].id) === 'undefined') {
                    tagArray = []
                } else {
                    tagArray = tagArray.concat(data.tags[0].id)
                }
            }
            if (originalData.Item.mainImage !== data.mainImage) {
                imagePath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${id}/${data.mainImage.name}`;
            } else {
                imagePath = originalData.Item.mainImage;
            }
            if (originalData.Item.soundFile !== data.soundFile) {
                audioPath = `https://gfit-content.s3-accelerate.amazonaws.com/audio/${id}/${data.soundFile.name}`;
            } else {
                audioPath = originalData.Item.soundFile;
            }
            
            // compare original with new and upload to s3 + dynamo accordingly 
            if (originalData.Item.mainImage !== data.mainImage) {
                // new image 
                // upload
                var imageParams = {
                    Bucket: 'gfit-content',
                    Key: `images/${id}/${data.mainImage.name}`,
                    Body: data.mainImage
                }
                await this.s3.upload(imageParams, async function (err, imageData) {
                    if (err) {
                        console.log("error", err);
                    } if (imageData) {
                        // check for new audio 
                        if (originalData.Item.soundFile !== data.soundFile) {
                            // upload audio 
                            var audioParams = {
                                Bucket: 'gfit-content',
                                Key: `audio/${id}/${data.soundFile.name}`,
                                Body: data.soundFile
                            }
                            await aws.s3.upload(audioParams, async function (err, audioData) {
                                if (err) {
                                    console.log("error", err);
                                } if (audioData) {
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
                                            "#f": "duration",
                                            "#g": "experienceLevel",
                                            "#h": "soundFile",
                                            "#i": "companies",
                                            "#j": "mainImage",
                                            "#k": "mainCategories",
                                            "#l": "tags",
                                        },
                                        ExpressionAttributeValues: {
                                            ":a": data.title,
                                            ":b": data.description,
                                            ":c": data.featured,
                                            ":d": data.dateCreated,
                                            ":e": data.author,
                                            ":f": data.duration,
                                            ":g": data.experienceLevel,
                                            ":h": audioPath,
                                            ":i": data.companies,
                                            ":j": imagePath,
                                            ":k": data.mainCategories,
                                            ":l": tagArray,
                                        },
                                        UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l",
                                        TableName: 'Meditations'
                                    }
                                    await aws.db.update(dbParams).promise();
                                    return "Success"

                                }
                            }) // need delete funct still 
                        } else {
                            // not new audio -- just update 
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
                                    "#f": "duration",
                                    "#g": "experienceLevel",
                                    "#h": "soundFile",
                                    "#i": "companies",
                                    "#j": "mainImage",
                                    "#k": "mainCategories",
                                    "#l": "tags",
                                },
                                ExpressionAttributeValues: {
                                    ":a": data.title,
                                    ":b": data.description,
                                    ":c": data.featured,
                                    ":d": data.dateCreated,
                                    ":e": data.author,
                                    ":f": data.duration,
                                    ":g": data.experienceLevel,
                                    ":h": audioPath,
                                    ":i": data.companies,
                                    ":j": imagePath,
                                    ":k": data.mainCategories,
                                    ":l": tagArray
                                },
                                UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l",
                                TableName: 'Meditations'
                            }
                            await aws.db.update(dbParams).promise();
                            return "Success"
                        }

                    }
                }) // need delete funct still 
            } else {
                // not new image -- check audio 
                if (originalData.Item.soundFile !== data.soundFile) {
                    // upload audio 
                    var audioParams = {
                        Bucket: 'gfit-content',
                        Key: `audio/${id}/${data.soundFile.name}`,
                        Body: data.soundFile
                    }
                    await aws.s3.upload(audioParams, async function (err, audioData) {
                        if (err) {
                            console.log("error", err);
                        } if (audioData) {
                            // now we can update 
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
                                    "#f": "duration",
                                    "#g": "experienceLevel",
                                    "#h": "soundFile",
                                    "#i": "companies",
                                    "#j": "mainImage",
                                    "#k": "mainCategories",
                                    "#l": "tags",
                                },
                                ExpressionAttributeValues: {
                                    ":a": data.title,
                                    ":b": data.description,
                                    ":c": data.featured,
                                    ":d": data.dateCreated,
                                    ":e": data.author,
                                    ":f": data.duration,
                                    ":g": data.experienceLevel,
                                    ":h": audioPath,
                                    ":i": data.companies,
                                    ":j": imagePath,
                                    ":k": data.mainCategories,
                                    ":l": tagArray,
                                },
                                UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l",
                                TableName: 'Meditations'
                            }
                            await aws.db.update(dbParams).promise();
                            return "Success"

                        }
                    }) // need delete funct still 
                } else {
                    // not new audio -- just update 
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
                            "#f": "duration",
                            "#g": "experienceLevel",
                            "#h": "soundFile",
                            "#i": "companies",
                            "#j": "mainImage",
                            "#k": "mainCategories",
                            "#l": "tags",
                        },
                        ExpressionAttributeValues: {
                            ":a": data.title,
                            ":b": data.description,
                            ":c": data.featured,
                            ":d": data.dateCreated,
                            ":e": data.author,
                            ":f": data.duration,
                            ":g": data.experienceLevel,
                            ":h": audioPath,
                            ":i": data.companies,
                            ":j": imagePath,
                            ":k": data.mainCategories,
                            ":l": tagArray,
                        },
                        UpdateExpression: "SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l",
                        TableName: 'Meditations'
                    }
                    await aws.db.update(dbParams).promise();
                    return "Success"
                }

            }
        } catch (e) {
            console.log(e)
            return 'Error'
        }
    }

    async getMeditationImage(imagePath) {
        console.log(imagePath);
        const data = await this.s3.getObject({
            Bucket: 'gfit-content',
            Key: imagePath
        }).promise();
        console.log(data);
        return data;
    }


    async getMeditationAudio(audioPath) {
        try {
            const data = await this.s3.getObject({
                Bucket: 'gfit-content',
                Key: audioPath
            }).promise();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteMeditationPost(id, med, softDelete) {
        if (softDelete) {
            // add deleted to blog and push to db
            let setTo = !med.deleted;
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
                TableName: 'Meditations'
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
                TableName: 'Meditations'
            }
            await aws.db.delete(dbParams).promise();
            return "Success"

        }
    }


}