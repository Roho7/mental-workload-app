import { useTasks } from '@/components/hooks/useTasks';
import { testIDs } from '@/constants/testID';
import React, { Fragment, useState } from 'react';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H2, View } from 'tamagui';

const CalendarScreen = () => {
  const { daysWithTasks } = useTasks();
  const [selected, setSelected] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState();

  const getDate = (count: number) => {
    const date = new Date();
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const getMarkedDates = () => {
    const markedDates = {
      [selected]: {
        selected: true,
        selectedColor: 'orange',
      },
    };

    daysWithTasks.forEach((day) => {
      markedDates[day.date] = {
        selected: true,
        selectedColor: day.tasks > 1 ? 'orange' : 'green',
      };
    });

    return markedDates;
  };
  const renderCalendarWithCustomMarkingType = () => {
    return (
      <View theme="dark" paddingHorizontal="$2">
        <H2 marginBottom="$4">Tasks Calendar</H2>
        <Calendar
          hideExtraDays
          style={{ borderRadius: 10, backgroundColor: 'black' }}
          theme={{
            backgroundColor: 'black',
            calendarBackground: '#00000',
          }}
          markingType={'custom'}
          onDayPress={(day) => setSelected(day?.dateString)}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
            },
            ...getMarkedDates(),
          }}
        />
      </View>
    );
  };

  const renderExamples = () => {
    return <Fragment>{renderCalendarWithCustomMarkingType()}</Fragment>;
  };

  return (
    <SafeAreaView testID={testIDs.calendars.CONTAINER}>
      {renderExamples()}
    </SafeAreaView>
  );
};

export default CalendarScreen;
