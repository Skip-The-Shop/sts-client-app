import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import ScrollContainer from '../../../components/molecules/ScrollContainer';
import {AuthContext} from '../../../hooks/getAuth';
import Button from '../../../components/atoms/Button';
import Locations from './components/Locations';
import Vehicle from './components/Vehicle';
import Service from './components/Service';

const Account = ({}) => {
  const {logout, user} = useContext(AuthContext);
  const {Name, Email, PhoneNumber} = user;
  return (
    <ScrollContainer style={{flex: 1, justifyContent: 'space-between'}}>
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
        <Vehicle user={user} />
        <Service user={user} />
        <Locations user={user} />
      </View>
      <Button onPress={logout} text="Logout" />
    </ScrollContainer>
  );
};
export default Account;