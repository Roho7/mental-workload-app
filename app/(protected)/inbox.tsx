import { useTasks } from '@/components/hooks/useTasks';
import TaskCard from '@/components/ui/TaskCard';
import { MwlMap } from '@/constants/TaskParameters';
import { TaskType } from '@/constants/types';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  CalendarProvider,
  CalendarUtils,
  WeekCalendar,
} from 'react-native-calendars';
import { H2, H3, Text, View, YStack } from 'tamagui';

const CalendarScreen = () => {
  const { daysWithTasks, getTasksByDate, mwlObject } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState();
  const [weekView, setWeekView] = useState(true);
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
        selectedColor: '#0362FF',
        selectedTextColor: 'white',
      },
    };

    daysWithTasks.forEach((day) => {
      markedDates[day.date] = {
        selected: true,
        selectedColor: MwlMap[Math.round(day.mwl) || 0]?.color || 'yellow',
        selectedTextColor: 'black',
      };
    });

    return markedDates;
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    const tasks = getTasksByDate(new Date(date));
    setSelectedDateTasks(tasks);
  };

  const renderItem = useCallback((task: any) => {
    return <TaskCard task={task} />;
  }, []);

  useEffect(() => {}, [selectedDateTasks]);

  return (
    <>
      <CalendarProvider
        date={moment(new Date()).format('YYYY-MM-DD')}
        onDateChanged={handleDayPress}
        // onMonthChange={onMonthChange}
        showTodayButton
        // disabledOpacity={0.6}
        // theme={todayBtnTheme.current}
        // todayBottomMargin={16}
      >
        <View paddingHorizontal='$2'>
          <H2 marginBottom='$4'>Inbox</H2>

          <WeekCalendar
            testID={'weekCalendar'}
            theme={{
              backgroundColor: 'black',
              calendarBackground: '#00000',
            }}
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
      </CalendarProvider>
    </>
  );
};

export default CalendarScreen;
