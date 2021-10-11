import React from 'react';
import Swiper from 'react-native-swiper';
import Title from '../../atoms/Title';
import HeroCard from './HeroCard';
import {COLORS} from '../../../constants';

const CONTAINER_HEIGHT = 225;
const Hero = ({items, navigation, aggregationType, showMetadata}: any) => {
  if (items && items.length > 0) {
    return (
      <>
        <Title style={{fontSize: 20}} title="Featured" />
        <Swiper
          activeDotColor={COLORS.BLUE}
          activeDotStyle={{bottom: -20}}
          dotStyle={{bottom: -20}}
          dotColor={'grey'}
          style={{height: CONTAINER_HEIGHT}}>
          {items &&
            items.length > 0 &&
            items.map((el: any, index: any) => (
              <HeroCard
                navigation={navigation}
                height={CONTAINER_HEIGHT}
                item={el}
                index={index}
                aggregationType={el.aggregationType || aggregationType}
                showMetadata={showMetadata}
              />
            ))}
        </Swiper>
      </>
    );
  }
  return null;
};

export default Hero;
