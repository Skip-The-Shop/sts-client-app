import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SignInStack, HomeStack, AccountStack} from '../stack-navigators';
import {AuthContext} from '../../hooks/getAuth';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const {user} = useContext(AuthContext);
  const isSignedIn = user && user.Name;
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarButton: ['SignIn'].includes(route.name)
          ? () => {
              return null;
            }
          : undefined,
        tabBarVisible: route.name === 'SignIn' ? false : true,
        initialRouteName: !isSignedIn ? 'SignIn' : 'Home',
      })}>
      {!isSignedIn ? (
        <Tab.Screen name="SignIn" component={SignInStack} />
      ) : (
        <>
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Account" component={AccountStack} />
        </>
      )}
    </Tab.Navigator>
  );
}
