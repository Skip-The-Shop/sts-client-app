import React, {useEffect, useState, useContext} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';
import {Icon} from 'react-native-elements';
import {AuthContext} from '../../../hooks/getAuth';
import {listOrderByUser} from '../../../api/tire-order';
import {FlatList} from 'react-native-gesture-handler';
import TireOrder from './TireOrder';
import {useFocusEffect} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    padding: 12,
    flex: 1,
  },
  iconWrapper: {
    backgroundColor: COLORS.BLUE,
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 8,
    justifyContent: 'center',
  },
});

const OrderHistory = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const {container, iconWrapper} = styles;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getOrders();
    }, []),
  );

  const renderItem = ({item, index}) => (
    <TireOrder
      getOrders={getOrders}
      item={item}
      key={index}
      navigation={navigation}
    />
  );

  const getOrders = () => {
    setLoading(true);
    listOrderByUser({UserId: user.UserId}).then(data => {
      setOrders(data);
      console.log({data});
      setLoading(false);
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('PlaceOrder')}
          style={iconWrapper}>
          <Icon
            color={COLORS.WHITE}
            size={18}
            type="font-awesome"
            name="plus"
          />
        </TouchableOpacity>
      ),
    });
    getOrders();
  }, []);

  return (
    <FlatList
      refreshing={loading}
      onRefresh={getOrders}
      contentContainerStyle={container}
      data={orders}
      renderItem={renderItem}
      ListEmptyComponent={() => (
        <View style={{marginTop: '50%'}}>
          <Text style={{textAlign: 'center'}}>No Previous Tire Orders</Text>
        </View>
      )}
    />
  );
};

export default OrderHistory;
