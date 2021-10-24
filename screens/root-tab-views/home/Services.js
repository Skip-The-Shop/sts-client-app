import React, {useEffect, useContext, useState} from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';
import {getServicesByUserId} from '../../../api/service';
import {AuthContext} from '../../../hooks/getAuth';
import {COLORS} from '../../../constants';
import Service from './components/Service';
import {Icon} from 'react-native-elements/dist/icons/Icon';
const Services = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const {UserId} = user;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const getServices = () => {
    // setLoading(true);
    getServicesByUserId({UserId}).then(s => {
      setServices(s);
      // setLoading(false);
    });
  };

  useEffect(() => {
    getServices();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('RequestService', {
              user,
            })
          }
          style={{
            backgroundColor: COLORS.BLUE,
            height: 30,
            width: 30,
            borderRadius: 15,
            marginRight: 8,
            justifyContent: 'center',
          }}>
          <Icon
            color={COLORS.WHITE}
            size={18}
            type="font-awesome"
            name="plus"
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  const renderItem = ({item, index}) => (
    <Service item={item} index={index} navigation={navigation} />
  );

  return (
    <FlatList
      refreshing={loading}
      onRefresh={() => getServices()}
      style={{backgroundColor: COLORS.WHITE, padding: 12}}
      data={services}
      renderItem={renderItem}
      ListHeaderComponent={
        services && services.length > 0
          ? () => (
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                Service History
              </Text>
            )
          : null
      }
    />
  );
};

export default Services;
