import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

interface IScrollContainer {
  children: any;
  style?: any;
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#FFF',
  },
});
const {container} = styles;

const ScrollContainer = ({children, style}: IScrollContainer) => (
  <ScrollView nestedScrollEnabled contentContainerStyle={[container, style]}>
    {children}
  </ScrollView>
);

export default ScrollContainer;
