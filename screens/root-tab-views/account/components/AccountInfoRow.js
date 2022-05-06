import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';

const AccountInfoRow = ({
  items,
  label,
  route,
  navigation,
  user,
  refreshToggle,
  setRefreshToggle,
}) => {
  const renderItem = ({item}) => (
    <View style={{paddingVertical: 12}}>
      <Text style={{fontSize: 16}}>{item.label}</Text>
    </View>
  );

  return (
    <View style={{marginVertical: 8}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          {label}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.push(route, {
              items,
              user,
              refreshToggle,
              setRefreshToggle,
            })
          }>
          <Text style={{alignSelf: 'center'}}>Edit</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ListEmptyComponent={() => (
          <Text style={{marginTop: 8}}>Nothing to display</Text>
        )}
        data={items.slice(0, 3)}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AccountInfoRow;
