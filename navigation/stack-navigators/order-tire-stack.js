import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  PlaceOrder,
  OrderHistory,
} from '../../screens/root-tab-views/order-tires';
import Messages from '../../screens/root-tab-views/messages/Messages';

const Stack = createStackNavigator();

const OrderTireStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="OrderHistory"
      component={OrderHistory}
      options={{
        title: 'Order History',
      }}
    />
    <Stack.Screen
      name="PlaceOrder"
      component={PlaceOrder}
      options={{
        title: 'Order Tires',
      }}
    />
    <Stack.Screen
      name="Messages"
      component={Messages}
      options={{
        title: 'Chat',
      }}
    />
  </Stack.Navigator>
);

export default OrderTireStack;
