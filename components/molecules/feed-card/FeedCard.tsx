import React from 'react';
import {TouchableOpacity, Text, Dimensions, View} from 'react-native';
import {Exercise} from './FeedCardType';
import {Image} from 'react-native-elements/dist/image/Image';
import Title from '../../atoms/Title';
import {COLORS} from '../../../constants';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import DifficultyIndicator from '../../atoms/DifficultyIndicator';

const {width} = Dimensions.get('screen');

interface FeedCard {
  navigation?: any;
  index?: any;
  item?: any;
  style?: any;
  showMetadata?: boolean;
  height?: number;
  aggregationType?: string;
}

const FeedCard = ({
  navigation,
  index,
  item,
  style,
  showMetadata,
  aggregationType,
}: FeedCard) => {
  const openLink = async (link: string) => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(link, {
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: COLORS.BLUE,
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
      });
    }
  };
  const {experienceLevel, difficulty} = item;

  const handlePressNavigate = (item: Exercise) => {
    const route = aggregationType;
    if (route === 'Book') {
      openLink(item.bookLink);
    } else if (route === 'Webinar') {
      if (item.onDemandLink) {
        navigation.push('Exercise', {
          item,
        });
      } else {
        openLink(item.link);
      }
    } else {
      navigation.push(route, {
        item,
      });
    }
  };

  return (
    <View
      style={{
        maxWidth: style && style.width ? style.width : width,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      }}>
      <TouchableOpacity onPress={() => handlePressNavigate(item)} key={index}>
        <Image
          style={[
            styles.card,
            style,
            {
              resizeMode: 'cover',
              flex: 1,
            },
          ]}
          source={{uri: item.mainImage}}
        />
      </TouchableOpacity>
      {showMetadata && (
        <View style={{marginBottom: 12, marginTop: 6}}>
          <View style={{flexDirection: 'row', marginLeft: 3}}>
            {difficulty && aggregationType !== 'Meditation' ? (
              <DifficultyIndicator suppressText difficulty={difficulty} />
            ) : null}
            {experienceLevel &&
            experienceLevel.length > 0 &&
            aggregationType !== 'Meditation' ? (
              <DifficultyIndicator
                suppressText
                difficulty={experienceLevel[0]}
              />
            ) : null}
            <Title
              title={
                item.title.length > 17
                  ? item.title.substring(0, 17) + '...'
                  : item.title
              }
              style={{marginLeft: 8}}
            />
          </View>
          {item.itemCategory && (
            <Text style={{color: COLORS.BLUE}}>
              {item.itemCategory.designation}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};
const styles = {
  card: {
    width: width * 0.9,
    height: 200,
    borderRadius: 8,
  },
};
export default FeedCard;
