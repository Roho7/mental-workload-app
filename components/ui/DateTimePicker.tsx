import { Feather } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

import React, { Dispatch, useState } from 'react';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, View } from 'tamagui';

const DateTimePicker = ({
  label,
  date,
  setDate,
}: {
  label: string;
  date: Timestamp | null;
  setDate: Dispatch<React.SetStateAction<Timestamp | null>>;
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(Timestamp.fromDate(date));
    hideDatePicker();
  };

  return (
    <View>
      <Button onPress={showDatePicker}>
        <Feather name='calendar' size={16} color='white' />
        {label}
        {date && moment(date.toDate()).format('MMM Do HH:mm')}
      </Button>
      <DateTimePickerModal
        date={date ? date.toDate() : new Date()}
        isVisible={isDatePickerVisible}
        mode='datetime'
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DateTimePicker;
