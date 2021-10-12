import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

const Service = ({user}) => {
  const [serviceHistory, setServiceHistory] = useState([]);
  const renderItem = ({item, index}) => <Text>iuerbg</Text>;
  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          Service History
        </Text>
        <TouchableOpacity>
          <Text style={{alignSelf: 'center'}}>Edit</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={serviceHistory}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={{marginTop: 8}}>No Recent Services Rendered</Text>
        )}
      />
    </View>
  );
};

export default Service;
