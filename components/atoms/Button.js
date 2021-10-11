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
const Button = ({text, buttonStyle, textStyle, onPress}) => {
  const {buttonText, buttonWrapper} = styles;
  return (
    <TouchableOpacity onPress={onPress} style={[buttonWrapper, buttonStyle]}>
      <Text style={[buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};
export default Button;
