import React, {useEffect, useContext, useState} from 'react';
import {FlatList, Text, View, TouchableOpacity, Image} from 'react-native';
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

  navigation.addListener('focus', () => getServices());

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
      ListEmptyComponent={() => (
        <View style={{marginTop: '75%'}}>
          <Image
            style={{
              height: 100,
              width: 150,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
            source={require('../../../images/_logo.png')}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RequestService', {
                user,
              })
            }
            style={{
              backgroundColor: COLORS.BLUE,
              padding: 12,
              borderRadius: 6,
            }}>
            <Text
              style={{textAlign: 'center', color: '#FFF', fontWeight: 'bold'}}>
              Request A Quote
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SaveVehicle', {
                user,
              })
            }
            style={{
              backgroundColor: COLORS.BLACK,
              padding: 12,
              borderRadius: 6,
              marginTop: 8,
            }}>
            <Text
              style={{textAlign: 'center', color: '#FFF', fontWeight: 'bold'}}>
              Add A Vehicle
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
