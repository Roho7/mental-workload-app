import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'tamagui';
import { useTasks } from '../hooks/useTasks';

type DateNavigatorProps = {
  date: moment.Moment;
  setDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
};

const DateNavigator = ({ date, setDate }: DateNavigatorProps) => {
  const { getTasksByDate } = useTasks();

  const previousDay = useCallback(() => {
    setDate((prevDate) => moment(prevDate).subtract(1, 'days'));
  }, []);

  const nextDay = useCallback(() => {
    setDate((prevDate) => moment(prevDate).add(1, 'days'));
  }, []);

  const displayDate = useMemo(() => {
    const today = moment();
    const yesterday = moment().subtract(1, 'days');
    const tomorrow = moment().add(1, 'days');

    if (date.isSame(today, 'day')) {
      return 'Today';
    } else if (date.isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else if (date.isSame(tomorrow, 'day')) {
      return 'Tomorrow';
    } else {
      return date.format('YYYY-MM-DD');
    }
  }, [date]);

  return (
    <View
      justifyContent="space-between"
      flexDirection="row"
      alignItems="center"
      width="100%"
    >
      <TouchableOpacity onPress={previousDay}>
        <Feather name="chevron-left" color="white" size={20} />
      </TouchableOpacity>
      <Text>{displayDate}</Text>
      <TouchableOpacity onPress={nextDay}>
        <Feather name="chevron-right" color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DateNavigator;
