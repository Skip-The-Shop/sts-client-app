import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {FlatList} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Images = ({images, setImages}) => {
  const removeImage = index => {
    const arr = images;
    arr.splice(index, 1);
    setImages([...arr]);
  };

  const renderItem = ({item, index}) => {
    return (
      <View>
        <Image
          borderRadius={8}
          source={{uri: item.uri}}
          style={{
            height: 100,
            width: 125,
            resizeMode: 'contain',
            marginRight: 8,
          }}
        />
        <TouchableOpacity
          onPress={() => removeImage(index)}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            borderColor: '#FFF',
            borderWidth: 1,
            borderRadius: 50,
            height: 25,
            width: 25,
            backgroundColor: '#2962FF',
          }}>
          <Icon name="close" type="font-awesome" color="#FFF" size={22} />
        </TouchableOpacity>
      </View>
    );
  };

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
          <TouchableOpacity onPress={() => launchCamera()}>
            <Icon name="camera" type="font-awesome" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const options = {
                mediaType: 'photo',
                allowsMultiple: true,
              };
              launchImageLibrary(options, response => {
                if (response && response.assets && response.assets.length > 0) {
                  const arr = images;
                  setImages([...arr, ...response.assets]);
                }
                console.log({images});
              });
            }}>
            <Icon name="picture-o" type="font-awesome" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList data={images} renderItem={renderItem} horizontal />
    </View>
  );
};
export default Images;
