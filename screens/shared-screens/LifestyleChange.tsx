import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import SessionTypeService from '../../services/SessionTypeService';
import {ScrollView} from 'react-native-gesture-handler';
import Title from '../../components/atoms/Title';
import HalfWidthImageCard from '../../components/molecules/HalfWidthImageCard';
import ProviderService from '../../services/ProviderService';
import PodcastPostService from '../../services/PodcastService';
import BlogPostService from '../../services/BlogPostService';
import VideoPostService from '../../services/VideoPostService';
import {Image} from 'react-native-elements';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import Divider from '../../components/atoms/Divider';

const LifestyleChange = ({route, navigation}: any) => {
  const sessionTypeService = new SessionTypeService();
  const providerService = new ProviderService();
  const podService = new PodcastPostService();
  const blogService = new BlogPostService();
  const videoService = new VideoPostService();
  const {item} = route.params;
  console.log({item});
  const {title, media, id} = item;
  const [sessionDetails, setSessionDetails] = useState([] as any);
  const [mediaDetails, setMediaDetails] = useState([]);

  const getMediaDetails = async () => {
    const arr = [] as any;
    media &&
      media.length > 0 &&
      (await Promise.all(
        media.map(async (m: any) => {
          if (m.mediaType === 'PO') {
            console.log('HERE');
            const val = await podService.getAWSPodcastByID(m.id);
            val.Item.navigationType = 'Podcast';
            arr.push(val.Item);
          } else if (m.mediaType === 'BL') {
            const blog = await blogService.getAWSBlogPostByID(m.id);
            blog.Item.navigationType = 'Blog';
            arr.push(blog.Item);
          } else if (m.mediaType === 'VI') {
            const video = await videoService.getAWSVideoByID(m.id);
            video.Item.navigationType = 'Exercise';
            arr.push(video.Item);
          }
        }),
      ));
    return arr;
  };

  useEffect(() => {
    navigation.setOptions({title});
    sessionTypeService.getAllSessionTypesById(id).then(services => {
      setSessionDetails(services);
    });
    getMediaDetails().then(arr => {
      setMediaDetails(arr);
    });
  }, []);

  const onPressHandler = async (id: string) => {
    const items = [] as any;
    const providers = await providerService.getAllProviders();
    if (providers && providers.length > 0) {
      await Promise.all(
        providers.map(async p => {
          if (p.providerType.includes(id)) {
            p['mainImage'] = `https://ik.imagekit.io/px2s14xrd/${p.profilePic}`;
            p['title'] = p.name;
            p['itemCategory'] = await providerService.getProviderTypeByID(
              p.providerType[0],
            );
            items.push(p);
          }
        }),
      );
      navigation.push('Aggregation', {
        title: 'Provider',
        items,
        aggregationType: 'Provider',
        desc: `These talented providers can help you with your selected service.`,
      });
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#FFF', padding: 12}}>
      {sessionDetails && sessionDetails.length > 0 ? (
        <>
          <Title title="Personalized Care" />
          {sessionDetails.map((el: any) => (
            <HalfWidthImageCard
              title={el.title}
              subtitle={el.description}
              onPress={() => onPressHandler(el.providerType.id)}
            />
          ))}
        </>
      ) : null}
      {mediaDetails && mediaDetails.length > 0 ? (
        <>
          <Divider />
          <View style={{marginTop: 16}}>
            <Title title="More great resources" />
            {mediaDetails.map((el: any) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.push(el.navigationType, {
                    item: el,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  marginTop: 8,
                }}>
                <View style={{flexDirection: 'row', maxWidth: '50%'}}>
                  <Image
                    style={{
                      height: 50,
                      width: 100,
                      borderRadius: 6,
                      marginRight: 8,
                    }}
                    source={{uri: el.mainImage}}
                  />
                  <Title title={el.title} />
                </View>
                <Icon name="caret-right" type="font-awesome" />
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
};

export default LifestyleChange;
