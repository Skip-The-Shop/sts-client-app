import React from 'react';
import Video from 'react-native-video';
import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('screen');

const FullSizeVideo = () => {
  const {video} = styles;
  return (
    <Video
      source={{
        uri: 'https://www.youtube.com/watch?v=9Jm7xt3jXCc',
      }}
      style={video}
    />
  );
};

const styles = {
  video: {
    height,
    width,
  },
};

export default FullSizeVideo;
