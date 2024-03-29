import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SignIn, CreateAccount, VehicleInfo} from '../../screens/root-tab-views';

const Stack = createStackNavigator();

const SignInStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{
        headerShown: false,
        title: 'Sign In',
      }}
      name="SignIn"
      component={SignIn}
    />
    <Stack.Screen
      options={{
        headerShown: false,
        title: 'Create Account',
      }}
      name="CreateAccount"
      component={CreateAccount}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="VehicleInfo"
      component={VehicleInfo}
    />
  </Stack.Navigator>
);

export default SignInStack;
