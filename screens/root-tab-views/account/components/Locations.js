import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {getLocationsForUser, saveLocation} from '../../../../api/locations';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Button from '../../../../components/atoms/Button';

const GOOGLE_API_KEY = 'AIzaSyA_CDDCwvesTmDSUeLN9p-SRfO0UhbLxhc';

const Locations = ({user}) => {
  const [locations, setLocations] = useState([]);
  const [locationToSave, setLocationToSave] = useState({});
  const [fetchTrigger, setFetchTrigger] = useState(false);
  useEffect(() => {
    getLocationsForUser({UserId: user.UserId}).then(loc => {
      setLocations(loc);
    });
  }, [fetchTrigger]);

  const saveLocationForUser = () => {
    saveLocation({Location: locationToSave})
      .then(res => {
        setLocationToSave(null);
        setFetchTrigger(!fetchTrigger);
      })
      .catch(err => {
        console.log({err});
      });
  };

  const renderItem = ({item}) => (
    <View style={{paddingVertical: 12}}>
      <Text style={{fontSize: 16}}>{item.StreetAddress}</Text>
    </View>
  );

  return (
    <View style={{marginTop: 16, flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          Pickup Locations
        </Text>
        <TouchableOpacity>
          <Text style={{alignSelf: 'center'}}>Edit</Text>
        </TouchableOpacity>
      </View>
      {locations && locations.length === 0 ? (
        <GooglePlacesAutocomplete
          style={{flex: 1}}
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
          placeholder="Where can we pick-up your vehicle...">
          {locationToSave ? (
            <Button text={'Save Location'} onPress={saveLocationForUser} />
          ) : null}
        </GooglePlacesAutocomplete>
      ) : (
        <FlatList data={locations} renderItem={renderItem} />
      )}
    </View>
  );
};

export default Locations;
