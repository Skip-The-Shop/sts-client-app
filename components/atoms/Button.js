import React from 'react';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../constants';
const styles = {
  buttonWrapper: {
    backgroundColor: COLORS.BLUE,
    padding: 16,
    borderRadius: 6,
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
};
const Button = ({text, buttonStyle, textStyle, onPress, disabled}) => {
  const {buttonText, buttonWrapper} = styles;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        buttonWrapper,
        buttonStyle,
        disabled ? {backgroundColor: '#979797'} : null,
      ]}>
      <Text style={[buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};
export default Button;
