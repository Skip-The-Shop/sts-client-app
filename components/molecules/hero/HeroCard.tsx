import React, {useState, useEffect} from 'react';
import {
  Text,
  Dimensions,
  View,
  Linking,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Title from '../../atoms/Title';
import AuthorService from '../../../services/AuthorService';
import DifficultyIndicator from '../../atoms/DifficultyIndicator';
import TagService from '../../../services/TagService';
import featuredGradient from '../../../images/featuredgradient.png';
import {COLORS} from '../../../constants';

const {width} = Dimensions.get('screen');
const TRIMMED_STRING_LENGTH = 26;

interface FeedCard {
  navigation?: any;
  index?: any;
  item?: any;
  style?: any;
  showMetadata?: boolean;
  height?: number;
  aggregationType?: string;
}

const HeroCard = ({
  navigation,
  index,
  item,
  style,
  aggregationType,
}: FeedCard) => {
  const authorService = new AuthorService();
  const tagService = new TagService();
  const {title, author, experienceLevel, tags, difficulty} = item;
  const [authorDetails, setAuthorDetails] = useState('');
  const [vidTags, setVidTags] = useState([]);
  useEffect(() => {
    if (
      aggregationType === 'Blog' ||
      aggregationType === 'Exercise' ||
      aggregationType === 'Recipe'
    ) {
      authorService.getAuthorByID(author).then(auth => {
        setAuthorDetails(auth.Item.tag);
      });
    }
    tags &&
      tags.length > 0 &&
      tags.forEach(async (tag: any) => {
        const res = await tagService.getTagByID(tag);
        setVidTags([res.Item]);
      });
  }, [item]);

  const handlePressNavigate = (item: any) => {
    const route = aggregationType;
    if (route === 'Book') {
      Linking.openURL(item.bookLink);
    } else if (route === 'Webinar') {
      if (item.onDemandLink) {
        navigation.push('Exercise', {
          item,
        });
      } else {
        Linking.openURL(item.link);
      }
    } else {
      navigation.push(route, {
        item,
      });
    }
  };

  return (
    <ImageBackground
      source={{uri: item.mainImage}}
      resizeMode="cover"
      style={{
        height: 200,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      }}
      imageStyle={{borderRadius: 8}}>
      <TouchableOpacity
        style={styles.card}
        key={index}
        onPress={() => handlePressNavigate(item)}>
        <ImageBackground
          source={featuredGradient}
          style={{
            height: 200,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}
          resizeMode="cover">
          <View
            style={{position: 'absolute', zIndex: 999, bottom: 10, left: 10}}>
            <View style={{flexDirection: 'row'}}>
              {vidTags && vidTags.length > 0
                ? vidTags.map((el: any) => {
                    if (el && el.tag)
                      return <Text style={{color: 'white'}}>{el.tag}</Text>;
                  })
                : null}
              {experienceLevel ? (
                <DifficultyIndicator
                  difficulty={experienceLevel[0]}
                  color="white"
                />
              ) : null}
              {difficulty ? (
                <DifficultyIndicator difficulty={difficulty} color="white" />
              ) : null}
            </View>
            <Title
              style={{
                fontSize: 15,
                fontWeight: '500',
                color: 'white',
              }}
              title={title}
            />
            {authorDetails ? (
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.WHITE,
                }}>{`By ${authorDetails}`}</Text>
            ) : null}
            {item.itemCategory && (
              <Text style={{color: 'white', fontSize: 18}}>
                {item.itemCategory.designation}
              </Text>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </ImageBackground>
  );
};
const styles = {
  card: {
    width: '100%',
    height: '100%',
  },
};
export default HeroCard;
