import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {COLORS} from '../../../constants';
import {getLocationsForUser} from '../../../api/locations';

const UpdateLocations = ({route, navigation}) => {
  const {items, user, refreshToggle, setRefreshToggle} = route.params;
  const [locations, setLocations] = useState(items);
  const [refreshing, setRefreshing] = useState(false);
  const setHeaderConfig = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SaveLocation', {
              user,
              refreshToggle,
              setRefreshToggle,
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

  navigation.addListener('focus', () => {
    getLocations();
  });

  useEffect(() => {
    setHeaderConfig();
  }, []);

  const getLocations = () => {
    setRefreshing(true);
    getLocationsForUser({UserId: user.UserId}).then(loc => {
      loc.forEach(loc => {
        loc['label'] = `${loc.StreetAddress}, ${loc.City}, ${loc.Province}`;
      });
      setLocations(loc);
      setRefreshing(false);
    });
  };

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
      refreshing={refreshing}
      onRefresh={getLocations}
      data={locations}
      renderItem={renderItem}
    />
  );
};

export default UpdateLocations;
