import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Picker from './Picker';
import {serviceTypes} from './config';
import {getVehiclesForUser} from '../../../api/vehicles';
import {getLocationsForUser} from '../../../api/locations';
import {AuthContext} from '../../../hooks/getAuth';
import {TextInput} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addWrapper: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 16,
    marginTop: 12,
    borderRadius: 6,
  },
});

const Home = ({navigation}) => {
  const {container, title, addWrapper} = styles;
  const {user} = useContext(AuthContext);
  const [serviceRequest, setServiceRequest] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const handleUpdateServiceRequest = (key, value) => {
    let obj = serviceRequest;
    obj[key] = value;
    setServiceRequest({...obj});
  };

  const getParsedVehicles = () => {
    const {UserId} = user;
    getVehiclesForUser({UserId}).then(v => {
      const parsedVehicles = v.reduce((acc, curr) => {
        acc.push({
          label: `${curr.Year} ${curr.Make} ${curr.Model}`,
          value: curr.VehicleId,
        });
        return acc;
      }, []);
      setVehicles(parsedVehicles);
    });
    getLocationsForUser({UserId}).then(l => {
      const parsedLocations = l.reduce((acc, curr) => {
        acc.push({
          label: `${curr.StreetAddress}, ${curr.City}, ${curr.Province}`,
          value: curr.AddressId,
        });
        return acc;
      }, []);
      setLocations(parsedLocations);
    });
  };

  navigation.addListener('focus', () => {
    getParsedVehicles();
  });

  const fields = [
    {
      placeholder: 'What type of Service do you need?',
      serviceKey: 'ServiceType',
      items: serviceTypes,
    },
    {
      placeholder: 'What Vehicle Needs Attention?',
      serviceKey: 'Vehicle',
      items: vehicles,
      addRoute: 'SaveVehicle',
      addLabel: 'Save A Vehicle',
    },
    {
      placeholder: 'Where can we pick-up your vehicle?',
      serviceKey: 'Location',
      items: locations,
      addRoute: 'SaveLocation',
      addLabel: 'Save A Pickup Location',
    },
  ];

  return (
    <ScrollView contentContainerStyle={container}>
      <Text style={title}>Need Some Work Done?</Text>
      {fields.map((el, index) => {
        const {items, serviceKey, addRoute, addLabel, placeholder} = el;
        return items && items.length > 0 ? (
          <Picker
            zIndex={fields.length - index}
            placeholder={placeholder}
            handleUpdateServiceRequest={handleUpdateServiceRequest}
            serviceRequest={serviceRequest}
            serviceKey={serviceKey}
            items={items}
          />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate(addRoute, {user})}
            style={addWrapper}>
            <Text>{addLabel}</Text>
          </TouchableOpacity>
        );
      })}
      <TextInput
        style={{
          borderColor: '#000',
          borderWidth: 1,
          height: 220,
          marginTop: 12,
          borderRadius: 5,
          padding: 12,
        }}
        multiline
        placeholder="Notes"
      />
    </ScrollView>
  );
};

export default Home;
