import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Account,
  VehicleList,
  LocationList,
  ServiceList,
  SaveLocation,
} from '../../screens/root-tab-views/account';
import SaveVehicle from '../../screens/root-tab-views/account/SaveVehicle';

const Stack = createStackNavigator();

const AccountStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={Account} />
    <Stack.Screen
      name="VehicleList"
      component={VehicleList}
      options={{
        title: 'Your Saved Vehicles',
      }}
    />
    <Stack.Screen
      name="SaveVehicle"
      component={SaveVehicle}
      options={{
        title: 'Add New Vehicle',
      }}
    />
    <Stack.Screen
      name="LocationList"
      component={LocationList}
      options={{
        title: 'Your Pickup Locations',
      }}
    />
    <Stack.Screen
      name="SaveLocation"
      component={SaveLocation}
      options={{
        title: 'Add Pickup Location',
      }}
    />
    <Stack.Screen
      name="ServiceList"
      component={ServiceList}
      options={{title: 'Your Service History'}}
    />
  </Stack.Navigator>
);

export default AccountStack;
