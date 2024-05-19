import { Feather } from '@expo/vector-icons';
import React, { Dispatch, useState } from 'react';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, View } from 'tamagui';

const DateTimePicker = ({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: Dispatch<React.SetStateAction<Date | null>>;
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(date);
    hideDatePicker();
  };

  return (
    <View>
      <Button onPress={showDatePicker}>
        <Feather name="calendar" size={16} color="white" />
        {date ? date?.toDateString() : 'Due Date'}
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DateTimePicker;
