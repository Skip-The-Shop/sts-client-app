import React, {useContext, useEffect, useState} from 'react';
import {Text, View, RefreshControl} from 'react-native';
import {Icon} from 'react-native-elements';
import {AuthContext} from '../../../hooks/getAuth';
import Button from '../../../components/atoms/Button';
import {getVehiclesForUser} from '../../../api/vehicles';
import {getLocationsForUser} from '../../../api/locations';
import AccountInfoRow from './components/AccountInfoRow';
import {ScrollView} from 'react-native-gesture-handler';

const Account = ({navigation}) => {
  const {logout, user} = useContext(AuthContext);
  const {Name, Email, PhoneNumber} = user;
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const getData = async () => {
    try {
      setRefreshing(true);
      const v = await getVehiclesForUser({UserId: user.UserId});
      v.forEach(vl => {
        vl['label'] = `${vl.Year} ${vl.Make} ${vl.Model}`;
      });
      const l = await getLocationsForUser({UserId: user.UserId});
      l.forEach(loc => {
        loc['label'] = `${loc.StreetAddress}, ${loc.City}, ${loc.Province}`;
      });
      setLocations(l);
      setVehicles(v);
    } catch (e) {
      console.log({e});
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getData();
  }, [refreshToggle]);

  const sections = [
    {
      route: 'VehicleList',
      label: 'Your Saved Vehicles',
      items: vehicles,
    },
    {
      route: 'LocationList',
      label: 'Your Pickup Locations',
      items: locations,
    },
  ];
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getData} />
      }
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 12,
      }}>
      <View style={{flex: 1}}>
        <View style={{marginBottom: 8}}>
          <Text style={{fontWeight: 'bold', fontSize: 17}}>{Name}</Text>
          <Text style={{marginTop: 6, color: '#979797', fontSize: 12}}>
            {PhoneNumber ? PhoneNumber : 'Set Your Phone Number'}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Icon
              iconStyle={{marginTop: 4, marginRight: 4}}
              name="email"
              size={22}
            />
            <Text style={{marginTop: 6, color: '#979797'}}>{Email}</Text>
          </View>
        </View>
        {sections.map(el => (
          <AccountInfoRow
            items={el.items}
            label={el.label}
            route={el.route}
            navigation={navigation}
            user={user}
            refreshToggle={refreshToggle}
            setRefreshToggle={setRefreshToggle}
          />
        ))}
      </View>
      <Button onPress={logout} text="Logout" />
    </ScrollView>
  );
};
export default Account;
