import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Divider from '../../components/atoms/Divider';
import AuthorService from '../../services/AuthorService';
import HeroVid from '../../components/atoms/HeroVid';
import ScrollContainer from '../../components/molecules/ScrollContainer';
import Title from '../../components/atoms/Title';
import Byline from '../../components/atoms/Byline';
import DifficultyIndicator from '../../components/atoms/DifficultyIndicator';
import TagService from '../../services/TagService';
import {COLORS} from '../../constants';
import LikeButton from '../../components/molecules/LikeButton';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {TouchableOpacity} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import share from '../../images/share.png';

const Exercise = ({route}: any) => {
  const {item} = route.params;
  const {config, fs} = RNFetchBlob;
  const [vidTags, setVidTags] = useState([]);
  const tagService = new TagService();
  const {
    mainImage,
    description,
    title,
    experienceLevel,
    vimeoID,
    onDemandLink,
    author,
    host,
    tags,
  } = item;

  useEffect(async () => {
    tags.forEach(async (tag: any) => {
      const res = await tagService.getTagByID(tag);
      if (!vidTags.some(x => x.id === res.Item.id)) {
        setVidTags(prev => [...prev, res.Item]);
      }
    });
  }, []);

  const handlePress = () => {
    const id = vimeoID.split('/')[3];
    fetch(`https://player.vimeo.com/video/${id}/config`)
      .then(res => res.json())
      .then(res => {
        console.log('a');
        var url =
          res.request.files.hls.cdns[res.request.files.hls.default_cdn].url;
        let RootDir = fs.dirs.MovieDir;
        let date = new Date();
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            path:
              RootDir +
              '/file_' +
              Math.floor(date.getTime() + date.getSeconds() / 2) +
              '.mp4',
            description: 'downloading file...',
            notification: true,
            // useDownloadManager works with Android only
            useDownloadManager: true,
          },
        };
        config(options)
          .fetch('GET', url)
          .then(re => {
            console.log(JSON.stringify(re));
          })
          .catch(e => {
            console.log('error', e);
          });
      });
  };

  return (
    <ScrollContainer style={{flex: 1}}>
      <HeroVid
        vimeoID={onDemandLink ? onDemandLink : vimeoID}
        mainImage={mainImage}
      />
      <View style={{padding: 12}}>
        <View style={{flexDirection: 'row'}}>
          {vidTags.map((el: any) => (
            <Text style={{color: COLORS.BLUE}}>{el && el.tag} </Text>
          ))}
          {experienceLevel &&
            experienceLevel.map((el: any) => (
              <DifficultyIndicator difficulty={el} />
            ))}
        </View>
        <Title style={{fontSize: 16}} title={title} />
        <Byline author={host ? host : author} />
        <Divider />
        {description ? (
          <View>
            <Text>Description</Text>
            <Text>{description}</Text>
          </View>
        ) : null}
        <View style={{flexDirection: 'row'}}>
          <LikeButton />
          <TouchableOpacity onPress={handlePress} style={styles.download}>
            <Image style={{width: 22, height: 21}} source={share} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  square: {
    borderRadius: 4,
    backgroundColor: 'green',
    height: 15,
    width: 15,
    marginRight: 8,
  },
  download: {
    backgroundColor: '#DDD',
    width: 40,
    height: 40,
    paddingTop: 7,
    borderRadius: 50,
    marginLeft: 15,
    alignItems: 'center',
  },
});

export default Exercise;
