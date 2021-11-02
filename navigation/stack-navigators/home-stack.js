import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SaveLocation} from '../../screens/root-tab-views/account';
import {SaveVehicle} from '../../screens/root-tab-views/account';
import Services from '../../screens/root-tab-views/home/Services';
import RequestService from '../../screens/root-tab-views/home/Home';
import ServiceDetails from '../../screens/root-tab-views/home/ServiceDetails';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Services" component={Services} />
    <Stack.Screen
      options={{
        title: 'Request Quote',
      }}
      name="RequestService"
      component={RequestService}
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
        title: 'Add New Vehicle',
      }}
    />
    <Stack.Screen
      name="ServiceDetails"
      component={ServiceDetails}
      options={{
        title: 'Service Details',
      }}
    />
  </Stack.Navigator>
);

export default HomeStack;
