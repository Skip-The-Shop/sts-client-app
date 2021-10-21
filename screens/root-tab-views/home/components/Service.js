import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import moment from 'moment';
import {Icon} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  metaContainer: {
    height: 40,
    marginTop: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  iconWrapper: {
    backgroundColor: '#979797',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
  },
  requestedText: {
    fontSize: 11,
    color: '#979797',
  },
});

const Service = ({item, index}) => {
  const {ServiceType, Created, Media, Notes} = item;
  const {container, metaContainer, iconWrapper, requestedText} = styles;
  const [showDetails, setShowDetails] = useState(false);
  const renderItem = ({item, index}) => {
    const {ResourceUrl} = item;
    return (
      <Image
        borderRadius={6}
        source={{uri: ResourceUrl}}
        style={{
          height: 150,
          width: 200,
          resizeMode: 'contain',
          marginHorizontal: 4,
        }}
      />
    );
  };
  return (
    <View style={container}>
      <TouchableOpacity style={metaContainer}>
        <View>
          <Text style={{marginBottom: 8}}>
            <Text style={{fontWeight: 'bold'}}>Service Type: </Text>
            {ServiceType}
          </Text>
          <Text style={requestedText}>
            Requested: {moment(parseInt(Created)).format('MMMM Do YYYY')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          style={iconWrapper}>
          <Icon
            name={showDetails ? 'caret-up' : 'caret-down'}
            type="font-awesome"
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {showDetails ? (
        <>
          <FlatList horizontal data={Media} renderItem={renderItem} />
          <Text style={{marginTop: 8}}>Notes: {Notes}</Text>
        </>
      ) : null}
    </View>
  );
};

export default Service;
