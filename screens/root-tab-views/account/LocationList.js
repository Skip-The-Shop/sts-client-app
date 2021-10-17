import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {COLORS} from '../../../constants';

const UpdateLocations = ({route, navigation}) => {
  const {items, user, refreshToggle, setRefreshToggle} = route.params;
  const setHeaderConfig = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SaveLocation', {
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
  useEffect(() => {
    setHeaderConfig();
  }, []);

  const renderItem = ({item}) => (
    <View style={{paddingVertical: 12}}>
      <Text style={{fontSize: 16}}>{item.label}</Text>
    </View>
  );

  return (
    <FlatList
      style={{
        padding: 12,
        flex: 1,
        backgroundColor: '#FFF',
      }}
      data={items}
      renderItem={renderItem}
    />
  );
};

export default UpdateLocations;
