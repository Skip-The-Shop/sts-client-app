import React from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import ScrollContainer from '../../components/molecules/ScrollContainer';
import Title from '../../components/atoms/Title';
import Byline from '../../components/atoms/Byline';
import Divider from '../../components/atoms/Divider';
import DurationIndicator from '../../components/atoms/DurationIndicator';
import TagDisplay from '../../components/molecules/TagDisplay';
import WebView from 'react-native-webview';

const Podcast = ({route}: any) => {
  const {item} = route.params;
  const {duration, title, author, description, tags, spotifyEmbed} = item;
  const SPOITFY_URL_FORMAT = 'https://open.spotify.com/embed-podcast/episode/';
  return (
    <ScrollContainer style={{flex: 1, justifyContent: 'flex-start'}}>
      <WebView
        allow="encrypted-media *"
        allowtransparency={true}
        height={300}
        style={{marginTop: 15, maxHeight: 300}}
        originWhitelist={['https://open.spotify.com*']}
        scalesPageToFit={true}
        source={{
          uri: spotifyEmbed.substring(
            spotifyEmbed.indexOf(SPOITFY_URL_FORMAT),
            spotifyEmbed.indexOf('" '),
          ),
        }}
        renderLoading={() => <ActivityIndicator />}
        width="100%"
      />
      <View style={{flex: 1, marginBottom: 180}}>
        <View style={{flexDirection: 'row'}}>
          <TagDisplay tags={tags} />
          <DurationIndicator duration={duration} />
        </View>
        <Title title={title} />
        <Byline author={author} />
        <Divider />
        <Title title="Description" />
        <Text style={{fontSize: 14}}>{description}</Text>
      </View>
    </ScrollContainer>
  );
};

export default Podcast;
