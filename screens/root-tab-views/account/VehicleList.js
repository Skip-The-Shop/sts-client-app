import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {COLORS} from '../../../constants';

const UpdateVehicle = ({route, navigation}) => {
  const {items, user} = route.params;

  useEffect(() => {
    setHeaderConfig();
  }, []);

  const setHeaderConfig = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SaveVehicle', {
              user,
            })
          }
          style={{
            backgroundColor: COLORS.BLUE,
            height: 30,
            width: 30,
            borderRadius: 15,
            marginRight: 8,
            justifyContent: 'center',
          }}>
          <Icon
            color={COLORS.WHITE}
            size={18}
            type="font-awesome"
            name="plus"
          />
        </TouchableOpacity>
      ),
    });
  };

  const renderItem = ({item}) => (
    <View style={{paddingVertical: 12}}>
      <Text style={{fontSize: 16}}>{item.label}</Text>
    </View>
  );

  return (
    <View style={{backgroundColor: '#FFF', flex: 1, padding: 12}}>
      <FlatList data={items} renderItem={renderItem} />
    </View>
  );
};

export default UpdateVehicle;
