import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {COLORS} from '../../../constants';
import {getLocationsForUser, deleteLocation} from '../../../api/locations';
import Swipeout from 'react-native-swipeout';

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
    try {
      setRefreshing(true);
      getLocationsForUser({UserId: user.UserId}).then(loc => {
        loc.forEach(loc => {
          loc['label'] = `${loc.StreetAddress}, ${loc.City}, ${loc.Province}`;
        });
        setLocations(loc);
      });
    } catch (e) {
      console.log({e});
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteLocation = async item => {
    await deleteLocation({Location: item});
    getLocations();
  };

  const renderItem = ({item}) => {
    const swipeButtons = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => handleDeleteLocation(item),
      },
    ];
    return (
      <Swipeout right={swipeButtons} style={{backgroundColor: '#FFF'}}>
        <View style={{paddingVertical: 12}}>
          <Text style={{fontSize: 16}}>{item.label}</Text>
        </View>
      </Swipeout>
    );
  };

  return (
    <FlatList
      style={{
        padding: 12,
        flex: 1,
        backgroundColor: '#FFF',
      }}
      ListEmptyComponent={() => (
        <View style={{marginTop: '75%'}}>
          <Text style={{textAlign: 'center'}}>No Locations Found</Text>
        </View>
      )}
      refreshing={refreshing}
      onRefresh={getLocations}
      data={locations}
      renderItem={renderItem}
    />
  );
};

export default UpdateLocations;
