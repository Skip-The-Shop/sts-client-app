import {useState, useEffect, createContext} from 'react';
import React from 'react';
import {login, register} from '../api/auth';
const {AsyncStorage} = require('react-native');

export const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');
  useEffect(() => {
    getSession();
  }, []);
  const getSession = async () => {
    const getUserData = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = await AsyncStorage.getItem('token');
      setUser(JSON.parse(savedUser));
      setToken(JSON.parse(savedToken));
    };
    getUserData();
    return {user, token};
  };

  const handleLogin = async ({email, password}) => {
    await login({Email: email, Password: password});
  };

  const handleRegister = async ({Name, Email, Password, PhoneNumber}) => {
    const reg = await register({
      Name,
      Email,
      Password,
      PhoneNumber,
    });
    return reg;
  };

  const logout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    AsyncStorage.multiRemove(keys);
    getSession();
  };

  return (
    <AuthContext.Provider
      value={{
        getSession,
        handleLogin,
        logout,
        user,
        token,
        handleRegister,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
