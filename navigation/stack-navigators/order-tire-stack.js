import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OrderTires from '../../screens/root-tab-views/order-tires';

const Stack = createStackNavigator();

const OrderTireStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="OrderTires"
      component={OrderTires}
      options={{
        title: 'Order Tires',
      }}
    />
  </Stack.Navigator>
);

export default OrderTireStack;
