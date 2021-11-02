import React, {useContext} from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  SignInStack,
  HomeStack,
  AccountStack,
  OrderTireStack,
} from '../stack-navigators';
import {AuthContext} from '../../hooks/getAuth';
import {Icon} from 'react-native-elements';
import {COLORS} from '../../constants';

const Tab = createBottomTabNavigator();

const getIconSource = ({route, focused}) => {
  const {name} = route;
  switch (name) {
    case 'Home':
      return (
        <Icon
          name="car"
          type="font-awesome"
          color={focused ? COLORS.BLUE : '#979797'}
        />
      );
    case 'Account':
      return (
        <Icon
          name="user"
          type="font-awesome"
          color={focused ? COLORS.BLUE : '#979797'}
        />
      );
    case 'OrderTires':
      return (
        <Image
          style={{height: 45, width: 45, resizeMode: 'contain'}}
          source={
            focused
              ? require('../../images/active_tire.png')
              : require('../../images/inactive_tire.png')
          }
        />
      );
  }
};

export default function BottomTabNavigator() {
  const {user} = useContext(AuthContext);
  const isSignedIn = user && user.Name;
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconName = getIconSource({route, focused});
          return iconName;
        },
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
          <Tab.Screen
            name="OrderTires"
            options={{
              title: 'Order Tires',
            }}
            component={OrderTireStack}
          />
          <Tab.Screen name="Account" component={AccountStack} />
        </>
      )}
    </Tab.Navigator>
  );
}
