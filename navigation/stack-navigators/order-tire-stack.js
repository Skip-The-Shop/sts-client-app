import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  PlaceOrder,
  OrderHistory,
} from '../../screens/root-tab-views/order-tires';

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
  </Stack.Navigator>
);

export default OrderTireStack;
