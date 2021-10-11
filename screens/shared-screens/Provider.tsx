import React from 'react';
import {Text, View} from 'react-native';
import HeroImage from '../../components/atoms/HeroImage';
import ScrollContainer from '../../components/molecules/ScrollContainer';
import Title from '../../components/atoms/Title';
import {COLORS} from '../../constants';
import Divider from '../../components/atoms/Divider';
import {GFITButton} from '../../components/atoms';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

const Provider = ({navigation, route}: any) => {
  const {item} = route.params;
  const {mainImage, name, state, itemCategory, bio, link, sessions} = item;
  const {designation} = itemCategory;
  const openLink = async () => {
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
  return (
    <ScrollContainer style={{flex: 1}}>
      <HeroImage mainImage={mainImage} />
      <View style={{flexDirection: 'row'}}>
        {state.map((el: any, index: any) => (
          <Text style={{color: COLORS.BLUE, fontSize: 12}}>
            {el.toUpperCase()}
            {index !== state.length && state.length !== 1 ? ',' : null}
          </Text>
        ))}
        <Text style={{fontSize: 12, marginLeft: 12}}>{designation}</Text>
      </View>
      <Title title={name} />
      <Divider />
      <Text style={{color: COLORS.BLUE, fontSize: 14, fontWeight: 'bold'}}>
        About me
      </Text>
      <Text style={{marginTop: 8, lineHeight: 20}}>{bio}</Text>
      <GFITButton
        action={openLink}
        buttonStyle={{width: '100%', marginTop: 24, borderRadius: 25}}
        text="Schedule a call"
      />
    </ScrollContainer>
  );
};

export default Provider;
