import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Home} from '../../screens/root-tab-views';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
  </Stack.Navigator>
);

export default HomeStack;
