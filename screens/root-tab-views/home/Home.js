import React, {useState, useContext, useEffect} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
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
import Spinner from 'react-native-loading-spinner-overlay';
import {useFocusEffect} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {Icon} from 'react-native-elements';
import moment from 'moment';

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
    borderWidth: 2,
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
    borderWidth: 2,
    height: 100,
    marginTop: 12,
    borderRadius: 5,
    padding: 12,
    paddingTop: 8,
  },
  buttonWrapper: {
    backgroundColor: COLORS.BLUE,
    padding: 12,
    borderRadius: 4,
  },
});

const RequestService = ({navigation}) => {
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
  const [loading, setLoading] = useState(false);
  const [pickupTime, setPickupTime] = useState({
    date: new Date(),
    open: false,
  });
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

  useFocusEffect(
    React.useCallback(() => {
      getParsedVehicles();
    }, []),
  );

  const fields = [
    {
      placeholder: 'What type of Service do you need?',
      serviceKey: 'ServiceType',
      items: serviceTypes,
    },
    {
      placeholder: 'Which Vehicle Needs Attention?',
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
    try {
      const {ServiceType, Notes, Location, Vehicle} = serviceRequest;
      const {UserId} = user;
      if (ServiceType && Notes && Location && Location) {
        console.log({pickupTime: pickupTime.date});
        setLoading(true);
        const res = await bookService({
          ServiceType,
          Notes,
          Created: new Date().getTime(),
          LocationId: Location,
          ShopNotes: null,
          UserId,
          VehicleId: Vehicle,
          PickupTime: pickupTime.date.toString(),
        });
        await Promise.all(
          images.map(
            async el => await postImage(res.data.ServiceId, 'Service', el),
          ),
        );
        setLoading(false);
        navigation.goBack();
      } else {
        Alert.alert('Please complete all fields');
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const shouldBeDisabled = () => {
    const {ServiceType, Notes, Location, Vehicle} = serviceRequest;
    if (ServiceType && Notes && Location && Vehicle && pickupTime.date) {
      return false;
    }
    return true;
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
        {pickupTime.open ? (
          <DatePicker
            minimumDate={new Date()}
            date={pickupTime.date}
            open={pickupTime.open}
            minuteInterval={15}
            theme="auto"
            modal
            onConfirm={date => {
              console.log({date});
              setPickupTime({
                date,
                open: false,
              });
            }}
            onCancel={() => {
              setPickupTime({
                ...pickupTime,
                open: false,
              });
            }}
          />
        ) : null}
        <TouchableOpacity
          onPress={() =>
            setPickupTime({
              ...pickupTime,
              open: !pickupTime.open,
            })
          }
          style={[
            addWrapper,
            {flexDirection: 'row', justifyContent: 'space-between'},
          ]}>
          <Text style={{alignSelf: 'center'}}>
            {pickupTime.date
              ? moment(pickupTime.date).format('MMMM Do YYYY hh:mma')
              : 'Requested pickup time'}
          </Text>
          <Icon name="calendar" type="font-awesome" />
        </TouchableOpacity>
        <TextInput
          onChangeText={text => handleUpdateServiceRequest('Notes', text)}
          style={shopNotesInput}
          multiline
          placeholder="Notes"
        />
        <Images images={images} setImages={setImages} />
      </View>
      <TouchableOpacity
        disabled={shouldBeDisabled()}
        onPress={requestService}
        style={[
          buttonWrapper,
          {backgroundColor: shouldBeDisabled() ? '#DDD' : '#2962FF'},
        ]}>
        <Text style={buttonText}>Request Quote</Text>
      </TouchableOpacity>
      <Spinner visible={loading} />
    </ScrollView>
  );
};

export default RequestService;
