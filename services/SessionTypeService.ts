import aws from './aws';
import PodcastPostService from './PodcastService';
import BlogPostService from './BlogPostService';
import VideoPostService from './VideoPostService';
const {v4: uuidv4} = require('uuid');

export default class SessionTypeService {
  constructor() {
    this.s3 = aws.s3;
    this.db = aws.db;
    this.tableName = 'SessionTypes';
    this.PodcastPostService = new PodcastPostService();
    this.BlogPostService = new BlogPostService();
    this.VideoPostService = new VideoPostService();
  }

  async createSessionType(doc) {
    try {
      const sessionTypeId = uuidv4();
      const {
        SessionTypeDescription,
        SessionTypeName,
        SessionServiceId,
        ProviderType,
        Price,
        Tags,
        mainCategories,
        Providers,
      } = doc.Item;
      let tagArray = [];
      if (Tags.length > 1) {
        Tags.forEach(tag => {
          if (typeof tag.id === 'undefined') {
            tagArray = tagArray.concat(tag);
          } else {
            tagArray = tagArray.concat(tag.id);
          }
        });
      } else {
        // just 1
        if (typeof Tags[0].id === 'undefined') {
          tagArray = tagArray.concat(Tags[0]);
        } else {
          tagArray = tagArray.concat(Tags[0].id);
        }
      }
      const dbParams = {
        TableName: this.tableName,
        Item: {
          id: sessionTypeId,
          title: SessionTypeName,
          description: SessionTypeDescription,
          services: SessionServiceId,
          deleted: false,
          price: Price,
          providerType: ProviderType,
          tags: tagArray,
          category: mainCategories,
          providers: Providers,
        },
      };

      this.db
        .put(dbParams, (err, data) => {
          if (err) {
            console.error(err);
            return 'Error';
          } else {
            console.log(data);
            return 'Success';
          }
        })
        .promise();
    } catch (e) {
      console.error(e);
    }
  }

  async getAllSessionTypesById(SessionServiceId) {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: 'services =:services',
        ExpressionAttributeValues: {
          ':services': SessionServiceId,
        },
      };
      let scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      return scanResults;
    } catch (ex) {
      console.log(ex);
      return [];
    }
  }

  async getSessionTypeById(id) {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: 'id=:id',
        ExpressionAttributeValues: {
          ':id': id,
        },
      };
      let item;
      let scanResults;
      do {
        item = await aws.db.scan(params).promise();
        scanResults = item?.Items[0];
      } while (typeof item.LastEvaluatedKey !== 'undefined');
      return scanResults;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async returnAllSessionTypes() {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: 'deleted =:deleted',
        ExpressionAttributeValues: {
          ':deleted': false,
        },
      };
      const scanResults = [];
      let items;
      do {
        items = await aws.db.scan(params).promise();
        items.Items.forEach(item => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey !== 'undefined');
      return scanResults;
    } catch (e) {
      console.log({e});
      return [];
    }
  }

  /**
   * Use this method to populate the dropdown where you select media to tether to the sessionType in the "More Great Resources" section.
   */
  async returnAllMediaThatCanBeTetheredToASessionType() {
    const media = [];
    const podcasts = await this.PodcastPostService.getAWSPodcastsAll();
    podcasts.forEach(podcast => {
      podcast.mediaType = 'PO';
      media.push(podcast);
    });
    const blogs = await this.BlogPostService.getAWSBlogPostsAll();
    blogs.forEach(blog => {
      blog.mediaType = 'BL';
      media.push(blog);
    });
    const videos = await this.VideoPostService.getAWSVideosAll();
    videos.forEach(video => {
      video.mediaType = 'VI';
      media.push(video);
    });
    return media;
  }

  async editSessionType(id, doc) {
    try {
      const {
        SessionTypeDescription,
        SessionTypeName,
        SessionServiceId,
        ProviderType,
        Price,
        Tags,
        mainCategories,
        Providers,
      } = doc.Item;
      const dbParams = {
        Key: {
          id: id,
        },
        ExpressionAttributeNames: {
          '#a': 'description',
          '#b': 'price',
          '#c': 'providerType',
          '#d': 'services',
          '#e': 'tags',
          '#f': 'title',
          '#g': 'category',
          '#h': 'providers',
        },
        ExpressionAttributeValues: {
          ':a': SessionTypeDescription,
          ':b': Price,
          ':c': ProviderType,
          ':d': SessionServiceId,
          ':e': Tags,
          ':f': SessionTypeName,
          ':g': mainCategories,
          ':h': Providers,
        },
        UpdateExpression:
          'SET #a = :a, #b = :b, #c = :c, #d = :d, #e = :e, #f = :f, #g = :g, #h = :h',
        TableName: this.tableName,
      };
      await this.db.update(dbParams).promise();
    } catch (error) {
      console.error(error);
    }
  }
}
