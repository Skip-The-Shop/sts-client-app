import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Account} from '../../screens/root-tab-views/account';

const Stack = createStackNavigator();

const AccountStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={Account} />
  </Stack.Navigator>
);

export default AccountStack;
