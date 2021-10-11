import aws from './aws';
const {v4: uuidv4} = require('uuid');

export default class RecipesService {
  constructor() {
    this.s3 = aws.s3;
  }

  async getMealTypeByID(id) {
    try {
      const params = {
        TableName: 'MealTypes',
        Key: {
          id: id,
        },
      };
      var result = await aws.db.get(params).promise();
      return result.Item;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getAllAWSMealTypes() {
    try {
      const params = {
        TableName: 'MealTypes',
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
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
      });
      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async createAWSRecipe(doc, mainCategories, categories) {
    try {
      let data = {...doc.Item, mainCategories, categories};
      var recipePostID = uuidv4();
      let imageKey = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${recipePostID}/${data.mainImage.name}`;
      let bodyKey = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${recipePostID}/${data.bodyImage.name}`;

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
      var imageParams = {
        Bucket: 'gfit-content',
        Key: `images/${recipePostID}/${data.mainImage.name}`,
        Body: data.mainImage,
      };

      var bodyParams = {
        Bucket: 'gfit-content',
        Key: `images/${recipePostID}/${data.bodyImage.name}`,
        Body: data.bodyImage,
      };

      aws.s3.upload(bodyParams, function (err, bodyData) {
        if (err) {
          console.error('error', err);
        }
        if (bodyData) {
          aws.s3.upload(imageParams, function (err, imageData) {
            if (err) {
              console.log('error', err);
            }
            if (imageData) {
              var params = {
                TableName: 'Recipes',
                Item: {
                  id: recipePostID,
                  author: data.author,
                  title: data.title,
                  calories: data.calories,
                  carbs: data.carbs,
                  fats: data.fats,
                  fibre: data.fibre,
                  protein: data.protein,
                  serves: data.serves,
                  prepTime: data.prepTime,
                  ingredients: data.ingredients,
                  steps: data.steps,
                  difficulty: data.difficulty,
                  mealTypes: data.mealTypes,
                  dateCreated: data.dateCreated,
                  companies: data.companies,
                  mainImage: imageKey,
                  mainCategories: data.mainCategories,
                  tags: tagArray,
                  deleted: true,
                  bodyImage: bodyKey,
                },
              };

              aws.db
                .put(params, function (err, data) {
                  if (err) {
                    console.error(err);
                    return 'Success';
                  } else {
                    console.error(data);
                    return 'Error';
                  }
                })
                .promise();
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }

  async getRecipePostsAndHidden() {
    try {
      const params = {
        TableName: 'Recipes',
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

  async getAWSRecipePosts() {
    try {
      const params = {
        TableName: 'Recipes',
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

  async getFirst6RecipePosts() {
    try {
      const params = {
        TableName: 'Recipes',
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

  async getAWSRecipePostByID(id) {
    try {
      const params = {
        TableName: 'Recipes',
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

  async getAWSRecipePostByMealType(mealType) {
    try {
      const params = {
        TableName: 'Recipes',
        FilterExpression: 'mealTypes = :mealTypes',
        ExpressionAttributeValues: {
          ':mealTypes': mealType,
        },
      };
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');

      // sort by date
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

  async editRecipeAWS(id, doc) {
    try {
      let data = {...doc.Item};
      const originalRecipe = await this.getAWSRecipePostByID(id);
      let imagePath = '';
      let tagArray = [];
      let bodyPath = '';
      if (typeof data.bodyImage.name !== 'undefined') {
        var bodyParams = {
          Bucket: 'gfit-content',
          Key: `images/${id}/${data.bodyImage.name}`,
          Body: data.bodyImage,
        };
        await aws.s3.upload(bodyParams, async function (err, bodyData) {
          if (err) {
            console.error(err);
          }
          if (bodyData) {
            bodyPath = `https://gfit-content.s3.us-east-2.amazonaws.com/images/${id}/${data.bodyImage.name}`;
          }
        });
        // dont want to do a crazy check for body image so just going to save it
      }

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

      // now compare values -- image new + old
      if (originalRecipe.Item.mainImage !== data.mainImage) {
        // means its a new image -- upload s3 and push db
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
                '#b': 'author',
                '#c': 'calories',
                '#d': 'carbs',
                '#e': 'fats',
                '#f': 'fibre',
                '#g': 'protein',
                '#h': 'serves',
                '#i': 'prepTime',
                '#j': 'ingredients',
                '#k': 'steps',
                '#l': 'difficulty',
                '#m': 'dateCreated',
                '#n': 'companies',
                '#o': 'mainImage',
                '#p': 'mainCategories',
                '#q': 'tags',
                '#r': 'mealTypes',
                '#s': 'bodyImage',
              },
              ExpressionAttributeValues: {
                ':a': data.title,
                ':b': data.author,
                ':c': data.calories,
                ':d': data.carbs,
                ':e': data.fats,
                ':f': data.fibre,
                ':g': data.protein,
                ':h': data.serves,
                ':i': data.prepTime,
                ':j': data.ingredients,
                ':k': data.steps,
                ':l': data.difficulty,
                ':m': data.dateCreated,
                ':n': data.companies,
                ':o': imagePath,
                ':p': data.mainCategories,
                ':q': tagArray,
                ':r': data.mealTypes,
                ':s': bodyPath,
              },
              UpdateExpression:
                'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l, #m = :m, #n = :n, #o = :o, #p = :p, #q = :q, #r = :r, #s = :s',
              TableName: 'Recipes',
            };
            await aws.db.update(dbParams).promise();
            return 'Success';
          }
        });
      } else {
        // not new image -- just upload with data
        imagePath = originalRecipe.Item.mainImage;
        const dbParams = {
          Key: {
            id: id,
          },
          ExpressionAttributeNames: {
            '#a': 'title',
            '#b': 'author',
            '#c': 'calories',
            '#d': 'carbs',
            '#e': 'fats',
            '#f': 'fibre',
            '#g': 'protein',
            '#h': 'serves',
            '#i': 'prepTime',
            '#j': 'ingredients',
            '#k': 'steps',
            '#l': 'difficulty',
            '#m': 'dateCreated',
            '#n': 'companies',
            '#o': 'mainImage',
            '#p': 'mainCategories',
            '#q': 'tags',
            '#r': 'mealTypes',
            '#s': 'bodyImage',
          },
          ExpressionAttributeValues: {
            ':a': data.title,
            ':b': data.author,
            ':c': data.calories,
            ':d': data.carbs,
            ':e': data.fats,
            ':f': data.fibre,
            ':g': data.protein,
            ':h': data.serves,
            ':i': data.prepTime,
            ':j': data.ingredients,
            ':k': data.steps,
            ':l': data.difficulty,
            ':m': data.dateCreated,
            ':n': data.companies,
            ':o': imagePath,
            ':p': data.mainCategories,
            ':q': tagArray,
            ':r': data.mealTypes,
            ':s': bodyPath,
          },
          UpdateExpression:
            'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j, #k = :k, #l = :l, #m = :m, #n = :n, #o = :o, #p = :p, #q = :q, #r = :r, #s = :s',
          TableName: 'Recipes',
        };
        await aws.db.update(dbParams).promise();
        return 'Success';
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  async getRecipeImage(imagePath) {
    const data = await this.s3
      .getObject({
        Bucket: 'gfit-content',
        Key: imagePath,
      })
      .promise();
    console.log(data);
    return data;
  }

  async deleteRecpePost(id, recipe, softDelete) {
    if (softDelete) {
      // add deleted to blog and push to db

      let changeTo = !recipe.deleted;

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
        TableName: 'Recipes',
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
        TableName: 'Recipes',
      };
      await aws.db.delete(dbParams).promise();
      return 'Success';
    }
  }

  // NOT NEEDED ANYMORE SO REMOVED INCASE WE ACCIDENTALLY CALL IT
  async moveFBtoAWSRecipes() {
    try {
      const response = this.firebase.db
        .collection('Recipes')
        .orderBy('title', 'desc')
        .get()
        .then(snapshot => {
          let mealArray = [];
          snapshot.forEach(async doc => {
            // create db Item object
            var recipePostID = uuidv4(); // new erry time
            const dateCreated = new Date(Date.now());
            var params = {
              TableName: 'Recipes',
              Item: {
                id: recipePostID,
                author: '943a4239-ccef-42bc-8399-875f389f5e00', // hard code shae
                title: doc.data().title,
                calories: doc.data().calories,
                carbs: doc.data().carbs,
                fats: doc.data().fats,
                fibre: doc.data().fibre,
                protein: doc.data().protein,
                serves: doc.data().serves,
                prepTime: doc.data().prepTime,
                ingredients: doc.data().ingredients,
                steps: doc.data().steps,
                difficulty: doc.data().difficulty,
                mealTypes: doc.data().meal,
                dateCreated: JSON.stringify(dateCreated),
                companies: 'Global',
                mainImage: '',
                mainCategories: '8e21ccb3-7c88-44fa-8415-cca9d931fc15',
                tags: '', // nothing for now -- add later with image
                deleted: false,
              },
            };
            mealArray.push({...params});
            await aws.db
              .put(params, function (err, data) {
                if (err) {
                  console.log(err);
                  return 'Error';
                } else {
                  console.log(data);
                  return 'Success';
                }
              })
              .promise();
          });
          return mealArray;
        });
      return response;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
}
