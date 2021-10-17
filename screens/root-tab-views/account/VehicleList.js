import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {COLORS} from '../../../constants';
import {getVehiclesForUser, deleteVehicle} from '../../../api/vehicles';
import Swipeout from 'react-native-swipeout';

const UpdateVehicle = ({route, navigation}) => {
  const {items, user, refreshToggle, setRefreshToggle} = route.params;
  const [vehicles, setVehicles] = useState(items);
  const [refreshing, setRefreshing] = useState(false);
  navigation.addListener('focus', () => {
    setRefreshToggle(!refreshToggle);
    getVehicles();
  });

  const setHeaderConfig = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SaveVehicle', {
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

  const getVehicles = () => {
    try {
      setRefreshing(true);
      getVehiclesForUser({UserId: user.UserId}).then(res => {
        res.forEach(vl => {
          vl.label = `${vl.Year} ${vl.Make} ${vl.Model}`;
        });
        setVehicles(res);
      });
    } catch (e) {
      console.log({e});
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setHeaderConfig();
    getVehicles();
  }, []);

  const handleRemoveLocation = async item => {
    await deleteVehicle({Vehicle: item});
    getVehicles();
  };

  const renderItem = ({item}) => {
    const swipeButtons = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => handleRemoveLocation(item),
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
    <View style={{backgroundColor: '#FFF', flex: 1, padding: 12}}>
      <FlatList
        ListEmptyComponent={() => (
          <View style={{marginTop: '75%'}}>
            <Text style={{textAlign: 'center'}}>No Vehicles Found</Text>
          </View>
        )}
        refreshing={refreshing}
        onRefresh={getVehicles}
        data={vehicles}
        renderItem={renderItem}
      />
    </View>
  );
};

export default UpdateVehicle;
