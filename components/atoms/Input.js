import React from 'react';
import {TextInput} from 'react-native';
const styles = {
  inputWrapper: {
    borderColor: '#000',
    borderWidth: 2,
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
};
const Input = ({placeholder, value, onChangeText, inputStyle}) => {
  const {inputWrapper} = styles;
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[inputWrapper, inputStyle]}
      placeholder={placeholder}
    />
  );
};
export default Input;
