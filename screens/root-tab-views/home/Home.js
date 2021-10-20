import React, {useState, useContext} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Picker from './Picker';
import {serviceTypes} from './config';
import {getVehiclesForUser} from '../../../api/vehicles';
import {getLocationsForUser} from '../../../api/locations';
import {AuthContext} from '../../../hooks/getAuth';
import {TextInput} from 'react-native-gesture-handler';
import Images from './Images';
import {postImage} from '../../../api/media';
import {COLORS} from '../../../constants';
import {bookService} from '../../../api/service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    justifyContent: 'space-between',
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
  buttonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shopNotesInput: {
    borderColor: '#000',
    borderWidth: 1,
    height: 220,
    marginTop: 12,
    borderRadius: 5,
    padding: 12,
  },
  buttonWrapper: {
    backgroundColor: COLORS.BLUE,
    padding: 12,
    borderRadius: 4,
  },
});

const Home = ({navigation}) => {
  const {
    container,
    title,
    addWrapper,
    buttonText,
    shopNotesInput,
    buttonWrapper,
  } = styles;
  const {user} = useContext(AuthContext);
  const [serviceRequest, setServiceRequest] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const handleUpdateServiceRequest = (key, value) => {
    let obj = serviceRequest;
    obj[key] = value;
    setServiceRequest({...obj});
  };
  const [images, setImages] = useState([]);

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

  console.log({serviceRequest});

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

  const requestService = async () => {
    const {ServiceType, Notes, Location, Vehicle} = serviceRequest;
    const {UserId} = user;
    const res = await bookService({
      ServiceType,
      Notes,
      Created: new Date().getTime(),
      LocationId: Location,
      ShopNotes: null,
      UserId,
      VehicleId: Vehicle,
    });
    Promise.all(
      images.map(
        async el => await postImage(res.data.ServiceId, 'Service', el),
      ),
    );
  };

  return (
    <ScrollView contentContainerStyle={container}>
      <View>
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
          onChangeText={text => handleUpdateServiceRequest('Notes', text)}
          style={shopNotesInput}
          multiline
          placeholder="Notes"
        />
        <Images images={images} setImages={setImages} />
      </View>
      <TouchableOpacity onPress={requestService} style={buttonWrapper}>
        <Text style={buttonText}>Request Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Home;
