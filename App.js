import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './navigation/tab-navigator/index.js';
import AuthProvider from './hooks/getAuth.js';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
