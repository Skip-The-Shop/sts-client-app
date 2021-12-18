import React, {useState} from 'react';
import {View} from 'react-native';
import {saveLocation} from '../../../api/locations';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Button from '../../../components/atoms/Button';

const GOOGLE_API_KEY = 'AIzaSyA_CDDCwvesTmDSUeLN9p-SRfO0UhbLxhc';

const UpdateLocations = ({route, navigation}) => {
  const {user} = route.params;
  const [locationToSave, setLocationToSave] = useState(null);

  const saveLocationForUser = async () => {
    await saveLocation({Location: locationToSave});
    navigation.goBack();
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
