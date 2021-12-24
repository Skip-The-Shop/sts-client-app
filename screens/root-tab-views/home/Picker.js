import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const Picker = ({
  serviceKey,
  items,
  handleUpdateServiceRequest,
  placeholder,
  zIndex,
  onPress,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  useEffect(() => {
    handleUpdateServiceRequest(serviceKey, value);
  }, [value]);
  return (
    <DropDownPicker
      containerStyle={{marginTop: 12, borderWidth: 1, borderRadius: 10}}
      placeholder={placeholder}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      zIndex={zIndex}
      onPress={onPress}
    />
  );
};

export default Picker;
