import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Home} from '../../screens/root-tab-views';
import {SaveLocation} from '../../screens/root-tab-views/account';
import {SaveVehicle} from '../../screens/root-tab-views/account';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{
        title: 'Request Service',
      }}
      name="Home"
      component={Home}
    />
    <Stack.Screen
      name="SaveLocation"
      component={SaveLocation}
      options={{
        title: 'Add Pickup Location',
      }}
    />
    <Stack.Screen
      name="SaveVehicle"
      component={SaveVehicle}
      options={{
        title: 'Add Pickup Location',
      }}
    />
  </Stack.Navigator>
);

export default HomeStack;
