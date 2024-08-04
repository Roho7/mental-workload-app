import { Feather } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

import React, { Dispatch, useState } from 'react';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, Text, View, XStack } from 'tamagui';

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
      <Button
        onPress={showDatePicker}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
      >
        <XStack alignItems='center' gap='$1'>
          <Feather name='calendar' size={16} color='white' />
          <Text> {date && moment(date.toDate()).format('MMM Do')}</Text>
        </XStack>
        {date && moment(date.toDate()).format('HH:mmA')}
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
