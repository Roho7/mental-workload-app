import { useTasks } from '@/components/hooks/useTasks';
import TaskCard from '@/components/ui/TaskCard';
import { TaskType } from '@/constants/types';
import React, { useState } from 'react';
import { Calendar, CalendarUtils, DateData } from 'react-native-calendars';
import { H2, H3, Text, View, YStack } from 'tamagui';

const CalendarScreen = () => {
  const { daysWithTasks, getTasksByDate } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState();
  const [selectedDateTasks, setSelectedDateTasks] = useState<TaskType[]>([]);

  const getDate = (count: number) => {
    const date = new Date();
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const getMarkedDates = () => {
    const markedDates = {
      [selectedDate]: {
        selected: true,
        selectedColor: 'blue',
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

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const tasks = getTasksByDate(new Date(day.dateString));
    setSelectedDateTasks(tasks);
  };

  return (
    <>
      <View theme='dark' paddingHorizontal='$2'>
        <H2 marginBottom='$4'>Tasks Calendar</H2>
        <Calendar
          hideExtraDays
          style={{ borderRadius: 10, backgroundColor: 'black' }}
          theme={{
            backgroundColor: 'black',
            calendarBackground: '#00000',
          }}
          markingType={'custom'}
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
            },
            ...getMarkedDates(),
          }}
        />
      </View>
      {selectedDateTasks && (
        <YStack padding='$4'>
          <H3>Tasks on {selectedDate}</H3>
          {selectedDateTasks.length > 0 ? (
            selectedDateTasks.map((task, index) => (
              <TaskCard task={task} key={index} />
            ))
          ) : (
            <Text>No tasks</Text>
          )}
        </YStack>
      )}
    </>
  );
};

export default CalendarScreen;
