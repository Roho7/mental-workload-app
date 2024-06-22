import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Text, View, YStack } from 'tamagui';
import { useTasks } from '../hooks/useTasks';

type DateNavigatorProps = {
  date: moment.Moment | null;
  setDate: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  range: { start: moment.Moment | null; end: moment.Moment | null };
  setRange: React.Dispatch<
    React.SetStateAction<{
      start: moment.Moment | null;
      end: moment.Moment | null;
    }>
  >;
};

const DateNavigator = ({
  date,
  setDate,
  range,
  setRange,
}: DateNavigatorProps) => {
  const { daysWithTasks } = useTasks();
  const [showCalendar, setShowCalendar] = useState(false);

  const previousDay = useCallback(() => {
    setDate((prevDate) => moment(prevDate).subtract(1, 'days'));
  }, []);

  const nextDay = useCallback(() => {
    setDate((prevDate) => moment(prevDate).add(1, 'days'));
  }, []);

  const displayDate = useMemo(() => {
    if (!date) return '';
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
      return date.format('DD/MM/YYYY');
    }
  }, [date]);

  const handleDayPress = (day: DateData) => {
    const selectedDate = moment(day.dateString);
    if (!range.end && selectedDate.isAfter(range.start)) {
      setDate(null);
      setRange({ start: range.start, end: selectedDate });
    } else {
      setRange({ start: null, end: null });
      setDate(selectedDate);
    }
  };

  const handleLongDayPress = (day: DateData) => {
    const selectedDate = moment(day.dateString);
    if (!range.start || (range.start && range.end)) {
      setRange({ start: selectedDate, end: null });
    }
  };
  const getMarkedDates = () => {
    let markedDates: { [key: string]: any } = {};
    daysWithTasks.forEach((day) => {
      markedDates[day.date] = {
        selected: true,
        marked: true,
        dotColor: day.tasks > 1 ? 'orange' : 'green',
        textColor: '#7E7E7E',
      };
    });
    if (date) {
      markedDates[date.format('YYYY-MM-DD')] = {
        selected: true,
        customContainerStyle: {
          backgroundColor: '#0362FF',
          borderRadius: 20,
          elevation: 4,
        },
        customTextStyle: {
          color: 'white',
        },
      };
    }
    if (range.start) {
      markedDates[range.start.format('YYYY-MM-DD')] = {
        startingDay: true,
        color: '#0362FF',
        textColor: 'white',
      };
    }
    if (range.end && range.start) {
      let start = range.start.clone();
      while (start.isBefore(range.end)) {
        start = start.add(1, 'day');
        markedDates[start.format('YYYY-MM-DD')] = {
          color: '#0A4481',
          textColor: 'white',
        };
      }
      markedDates[range.end.format('YYYY-MM-DD')] = {
        endingDay: true,
        color: '#0362FF',
        textColor: 'white',
      };
    }

    return markedDates;
  };

  return (
    <YStack gap="$4" width="100%" justifyContent="center">
      <View
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        width="100%"
      >
        {!showCalendar && (
          <TouchableOpacity onPress={previousDay}>
            <Feather name="chevron-left" color="white" size={20} />
          </TouchableOpacity>
        )}
        <Text
          onPress={() => setShowCalendar(!showCalendar)}
          textAlign="center"
          marginHorizontal="auto"
        >
          {range.start
            ? `${range.start.format('YYYY-MM-DD')}${range.end ? ` - ${range.end.format('YYYY-MM-DD')}` : ''}`
            : displayDate}
        </Text>
        {!showCalendar && (
          <TouchableOpacity onPress={nextDay}>
            <Feather name="chevron-right" color="white" size={20} />
          </TouchableOpacity>
        )}
      </View>
      {showCalendar && (
        <Calendar
          hideExtraDays
          style={{ borderRadius: 10, backgroundColor: 'black' }}
          theme={{
            backgroundColor: 'black',
            calendarBackground: '#00000',
            textSectionTitleColor: '#b6c1cd',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: 'white',
            selectedDayTextColor: 'white',
            todayTextColor: '#00adf5',
            dayTextColor: '#7E7E7E',
            textDisabledColor: '#d9e1e8',
            selectedDotColor: '#ffffff',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: 'white',
          }}
          markingType={'period'}
          onDayPress={handleDayPress}
          onDayLongPress={handleLongDayPress}
          markedDates={getMarkedDates()}
        />
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({});

export default DateNavigator;
