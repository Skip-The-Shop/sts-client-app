import React from 'react';
import {Image, StyleSheet} from 'react-native';

const Logo = () => {
  return (
    <Image
      source={require('../../images/_logo.png')}
      style={{
        height: 100,
        width: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
      }}
    />
  );
};

export default Logo;
