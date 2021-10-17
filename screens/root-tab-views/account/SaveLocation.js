import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {saveLocation} from '../../../api/locations';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Button from '../../../components/atoms/Button';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {COLORS} from '../../../constants';

const GOOGLE_API_KEY = 'AIzaSyA_CDDCwvesTmDSUeLN9p-SRfO0UhbLxhc';

const UpdateLocations = ({route, navigation}) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.BLUE,
            height: 40,
            width: 40,
            borderRadius: 20,
            marginRight: 8,
            justifyContent: 'center',
          }}>
          <Icon color={COLORS.WHITE} type="font-awesome" name="plus" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const {user, refreshToggle, setRefreshToggle} = route.params;
  const [locationToSave, setLocationToSave] = useState({});

  const saveLocationForUser = async () => {
    await saveLocation({Location: locationToSave});
    setRefreshToggle(!refreshToggle);
  };

  return (
    <View
      style={{
        padding: 12,
        flex: 1,
        backgroundColor: '#FFF',
      }}>
      <GooglePlacesAutocomplete
        onFail={error => console.log({error})}
        onPress={(data, details) => {
          let loc = {};
          loc['Latitude'] = details.geometry.location.lat;
          loc['Longitude'] = details.geometry.location.lng;
          loc['StreetAddress'] = details.name;
          loc['City'] = details.vicinity;
          loc['Country'] =
            data.structured_formatting.secondary_text.split(', ')[2];
          loc['Province'] =
            data.structured_formatting.secondary_text.split(', ')[1];
          loc['UserId'] = user.UserId;
          loc['IsHome'] = true;
          setLocationToSave(loc);
        }}
        fetchDetails={true}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
        }}
        placeholder="Add a new pickup location"
        enablePoweredByContainer={false}>
        {locationToSave ? (
          <Button text={'Save Location'} onPress={saveLocationForUser} />
        ) : null}
      </GooglePlacesAutocomplete>
    </View>
  );
};

export default UpdateLocations;
