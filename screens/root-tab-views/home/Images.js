import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {FlatList} from 'react-native-gesture-handler';

const Images = ({images, setImages}) => {
  const renderItem = ({item, index}) => (
    <View>
      <Text>oerghi</Text>
    </View>
  );

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        }}>
        <Text style={{fontWeight: 'bold'}}>Photos (Optional)</Text>
        <View
          style={{
            flexDirection: 'row',
            width: 60,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity>
            <Icon name="camera" type="font-awesome" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="picture-o" type="font-awesome" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList data={images} renderItem={renderItem} horizontal />
    </View>
  );
};
export default Images;
