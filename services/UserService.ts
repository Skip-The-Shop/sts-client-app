import axios from 'axios';
import aws from './aws';
import {Auth, API} from 'aws-amplify';
export default class UserService {
  constructor() {
    this.db = aws.db;
    this.auth = aws.apiAuth;
  }

  async getHubspotUsers(users) {
    try {
      const request = {
        host: '1i1q02twr1.execute-api.us-east-2.amazonaws.com',
        method: 'POST',
        data: {users},
        body: JSON.stringify({users}),
        url: 'https://5prixxnad8.execute-api.us-east-2.amazonaws.com/default/getHubspotUsers',
        path: '/default/getHubspotUsers',
        headers: {
          'content-type': 'application/json',
        },
      };
      const signedRequest = this.auth(request);
      var response = await axios(signedRequest);
      return response;
    } catch (error) {
      return [];
    }
  }

  async getWebAnalytics(users) {
    try {
      const request = {
        host: '1i1q02twr1.execute-api.us-east-2.amazonaws.com',
        method: 'POST',
        data: {users},
        body: JSON.stringify({users}),
        url: 'https://nu6vdqnjz0.execute-api.us-east-2.amazonaws.com/default/getUserReport',
        path: '/default/getUserReport-dev',
        headers: {
          'content-type': 'application/json',
        },
      };
      const signedRequest = this.auth(request);
      const response = await axios(signedRequest);
      return response;
    } catch (error) {
      return [];
    }
  }

  async resetPassword(email) {
    try {
      await Auth.forgotPassword(email);
      return 'Success';
    } catch (ex) {
      return 'Error';
    }
  }

  async resetChangePassword(username, code, newPassword) {
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }

  async getUserByEmail(email) {
    try {
      const params = {
        ExpressionAttributeValues: {
          ':a': email,
        },
        FilterExpression: 'email = :a',
        TableName: 'Users',
      };
      let scanResults = [];
      let items;
      do {
        items = await this.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      return scanResults[0];
    } catch (error) {
      console.error(error);
    }
  }

  async passwordUpdate(currentPassword, newPassword) {
    var success = true;
    await Auth.currentAuthenticatedUser()
      .then(async user => {
        await Auth.changePassword(user, currentPassword, newPassword).catch(
          () => {
            success = false;
          },
        );
      })
      .catch(() => {
        success = false;
      });
    return success;
  }

  async createUsers(users, company, companyName) {
    try {
      let a = users;
      while (a.length > 0) {
        const list = a.splice(0, 20);
        const request = {
          host: '1i1q02twr1.execute-api.us-east-2.amazonaws.com',
          method: 'POST',
          data: {list, companyName, company},
          body: JSON.stringify({list, companyName, company}),
          url: 'https://2q98o06gs9.execute-api.us-east-2.amazonaws.com/default/userCreate-dev',
          path: '/default/userCreate-dev',
          headers: {
            'content-type': 'application/json',
          },
        };
        const signedRequest = this.auth(request);
        await axios(signedRequest);
      }
      return 'Success';
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }

  async removeUsers(users) {
    try {
      let a = users;
      while (a.length > 0) {
        const list = a.splice(0, 20);
        const request = {
          host: '1i1q02twr1.execute-api.us-east-2.amazonaws.com',
          method: 'POST',
          data: {list},
          body: JSON.stringify({list}),
          url: 'https://03ryuwqoud.execute-api.us-east-2.amazonaws.com/default/userRemove-dev',
          path: '/default/userRemove-dev',
          headers: {
            'content-type': 'application/json',
          },
        };
        const signedRequest = this.auth(request);
        await axios(signedRequest);
      }
      return 'Success';
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }

  async getBreakdown(users, company) {
    try {
      const params = {
        ExpressionAttributeValues: {
          ':a': 'active',
        },
        ExpressionAttributeNames: {
          '#a': 'status',
        },
        FilterExpression: '#a = :a',
        TableName: 'Users',
      };
      let usersToAdd = [];
      let usersToRemove = [];
      let items;
      do {
        items = await this.db.scan(params).promise();
        users.forEach(user => {
          if (!items.Items.some(x => x.email === user.email)) {
            usersToAdd.push(user);
          }
        });
        items.Items.filter(x => x.companyID === company).forEach(doc => {
          if (!users.some(x => x.email === doc.email)) {
            usersToRemove.push({...doc, id: doc.id});
          }
        });
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      return {usersToAdd, usersToRemove};
    } catch (error) {
      console.error(error);
      return {usersToAdd: null, usersToRemove: null};
    }
  }

  async firstLoginAddUser(id, doc) {
    try {
      const request = {
        host: '1i1q02twr1.execute-api.us-east-2.amazonaws.com',
        method: 'POST',
        data: doc,
        body: JSON.stringify(doc),
        url: 'https://jkvbc083qd.execute-api.us-east-2.amazonaws.com/default/userUpdate-dev',
        path: '/default/userUpdate-dev',
        headers: {
          'content-type': 'application/json',
        },
      };
      const signedRequest = this.auth(request);
      await axios(signedRequest);
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'nickname',
          '#b': 'phoneNumber',
          '#c': 'country',
          '#d': 'state',
          '#e': 'city',
          '#f': 'address',
          '#g': 'postalCode',
          '#h': 'gender',
          '#i': 'language',
          '#j': 'firstLogin',
        },
        ExpressionAttributeValues: {
          ':a': doc.nickName,
          ':b': doc.phoneNumber,
          ':c': doc.country,
          ':d': doc.state,
          ':e': doc.city,
          ':f': doc.address,
          ':g': doc.postalCode,
          ':h': doc.gender,
          ':i': doc.language,
          ':j': false,
        },
        UpdateExpression:
          'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j',
        TableName: 'Users',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch {
      throw 'error adding user';
    }
  }

  async setLifestyleChanges(id, doc) {
    try {
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'lifestyleChanges',
        },
        ExpressionAttributeValues: {
          ':a': doc,
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'Users',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch {
      throw 'error adding user';
    }
  }

  async editUser(id, hubspotId, doc) {
    try {
      let data = {...doc, hubspotID: hubspotId};
      // const request = {
      //   host: '1i1q02twr1.execute-api.us-east-2.amazonaws.com',
      //   method: 'POST',
      //   data: data,
      //   body: JSON.stringify(data),
      //   url: 'https://jkvbc083qd.execute-api.us-east-2.amazonaws.com/default/userUpdate-dev',
      //   path: '/default/userUpdate-dev',
      //   headers: {
      //     'content-type': 'application/json',
      //   },
      // };
      // const signedRequest = this.auth(request);
      // try {
      //   await axios(signedRequest);
      // } catch (error) {
      //   console.log(error);
      // }
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'nickname',
          '#b': 'phoneNumber',
          '#c': 'country',
          '#d': 'state',
          '#e': 'city',
          '#f': 'address',
          '#g': 'postalCode',
          '#h': 'gender',
          '#i': 'language',
          '#j': 'firstLogin',
        },
        ExpressionAttributeValues: {
          ':a': data.nickName,
          ':b': data.phoneNumber,
          ':c': data.country,
          ':d': data.state,
          ':e': data.city,
          ':f': data.address,
          ':g': data.postalCode,
          ':h': data.gender,
          ':i': data.language,
          ':j': false,
        },
        UpdateExpression:
          'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h, #i = :i, #j = :j',
        TableName: 'Users',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }

  updateUserExperienceLevel(userId, experienceLevel) {
    try {
      const response = this.firebase.db
        .collection('Users')
        .doc(userId)
        .update({experienceLevel: experienceLevel});
      return response;
    } catch (exception) {
      console.error(exception);
      return false;
    }
  }

  async getUsersByCompany(company) {
    try {
      const params = {
        FilterExpression: 'companyID = :a',
        ExpressionAttributeValues: {
          ':a': company,
        },
        TableName: 'Users',
      };
      let scanResults = [];
      let items;
      do {
        items = await this.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      return scanResults;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getHubspotUser(hubspotID) {
    try {
      const functionCall =
        this.firebase.functions.httpsCallable('getHubspotUser');
      return await functionCall({hubspotID});
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserNotifications(hubspotID, notif) {
    try {
      const functionCall =
        this.firebase.functions.httpsCallable('setNotification');
      await functionCall({hubspotID, notif});
      return 'Success';
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }

  async setViewedClinic(id) {
    try {
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'viewedClinic',
        },
        ExpressionAttributeValues: {
          ':a': true,
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'Users',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch {
      return 'Error';
    }
  }

  async setViewedHome(id) {
    try {
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'viewedHome',
        },
        ExpressionAttributeValues: {
          ':a': true,
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'Users',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch {
      return 'Error';
    }
  }

  async setViewedExercise(id) {
    try {
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'viewedExercise',
        },
        ExpressionAttributeValues: {
          ':a': true,
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'Users',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch {
      return 'Error';
    }
  }

  async setViewedNutrition(id) {
    try {
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'viewedNutrition',
        },
        ExpressionAttributeValues: {
          ':a': true,
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'Users',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch {
      return 'Error';
    }
  }

  async setViewedChallenges(id) {
    try {
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'viewedChallenges',
        },
        ExpressionAttributeValues: {
          ':a': true,
        },
        UpdateExpression: 'SET #a = :a',
        TableName: 'Users',
      };
      await this.db.update(dbParams).promise();
      return 'Success';
    } catch {
      return 'Error';
    }
  }

  async subscribe(id, endpoint) {
    try {
      const res = await API.post('notificationServer', '/items/subscribe', {
        body: {id, endpoint},
      });
      console.log(res);
      return res;
    } catch (error) {
      return 'Error';
    }
  }

  async favouritePost(favourites, id) {
    try {
      return await this.db
        .update({
          TableName: 'Users',
          Key: {
            id: id,
          },
          ReturnValues: 'ALL_NEW',
          UpdateExpression: 'SET #favourites = :favourites',
          ExpressionAttributeNames: {
            '#favourites': 'favourites',
          },
          ExpressionAttributeValues: {
            ':favourites': favourites,
          },
        })
        .promise();
    } catch (error) {
      return error;
    }
  }

  async unFavouritePost(favourites, id) {
    try {
      return await this.db
        .update({
          TableName: 'Users',
          Key: {
            id: id,
          },
          ReturnValues: 'ALL_NEW',
          UpdateExpression: 'SET #favourites = :favourites',
          ExpressionAttributeNames: {
            '#favourites': 'favourites',
          },
          ExpressionAttributeValues: {
            ':favourites': favourites,
          },
        })
        .promise();
    } catch (error) {
      return error;
    }
  }

  async setClickedClinic(date, id) {
    try {
      return await this.db
        .update({
          TableName: 'Users',
          Key: {
            id: id,
          },
          ReturnValues: 'ALL_NEW',
          UpdateExpression: 'SET #visitedClinicDate = :visitedClinicDate',
          ExpressionAttributeNames: {
            '#visitedClinicDate': 'visitedClinicDate',
          },
          ExpressionAttributeValues: {
            ':visitedClinicDate': date,
          },
        })
        .promise();
    } catch (error) {
      return error;
    }
  }

  async sendEmails(user, users) {
    const request = {
      host: '1i1q02twr1.execute-api.us-east-2.amazonaws.com',
      method: 'POST',
      data: {user, users},
      body: JSON.stringify({user, users}),
      url: 'https://v7xqly4tt5.execute-api.us-east-2.amazonaws.com/default/challengeSendInvite-dev',
      path: '/default/challengeSendInvite-dev',
      headers: {
        'content-type': 'application/json',
      },
    };
    const signedRequest = this.auth(request);
    await axios(signedRequest);
  }
}
