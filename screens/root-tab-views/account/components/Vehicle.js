import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {getVehiclesForUser} from '../../../../api/vehicles';

const Vehicle = ({user}) => {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    getVehiclesForUser({UserId: user.UserId}).then(v => {
      setVehicles(v);
    });
  }, []);

  const renderItem = ({item}) => (
    <View style={{paddingVertical: 12}}>
      <Text style={{fontSize: 16}}>
        {item.Year} {item.Make} {item.Model}
      </Text>
    </View>
  );

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          Your Vehicles
        </Text>
        <TouchableOpacity>
          <Text style={{alignSelf: 'center'}}>Edit</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={vehicles} renderItem={renderItem} />
    </View>
  );
};

export default Vehicle;
