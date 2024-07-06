import { useTasks } from '@/components/hooks/useTasks';
import DateNavigator from '@/components/ui/DateNavigator';

import Graph from '@/components/ui/Graph';
import { MwlMap } from '@/components/ui/MwlBadge';
import MwlFeedbackLabel from '@/components/ui/MwlFeedbackLabel';
import TaskCard, { TaskType } from '@/components/ui/TaskCard';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  H2,
  H3,
  ScrollView,
  Text,
  XStack,
  YStack,
} from 'tamagui';
export type intervalTypes = 'daily' | 'weekly' | 'monthly';

const intervalOptions: intervalTypes[] = ['daily', 'weekly', 'monthly'];

const MentalWorkloadScreen = () => {
  const {
    todaysTasks,
    generateMentalWorkload,
    getTasksByDate,
    getTasksByRange,
    mwlObject,
  } = useTasks();
  const [selectedInterval, setSelectedInterval] = useState<
    'daily' | 'weekly' | 'monthly'
  >(intervalOptions[1]);
  const [date, setDate] = useState<moment.Moment | null>(moment());
  const [range, setRange] = useState<{
    start: moment.Moment | null;
    end: moment.Moment | null;
  }>({ start: null, end: null });
  const [tasksOnSelectedDay, setTasksOnSelectedDay] = useState<
    TaskType[] | null
  >(null);

  useEffect(() => {
    if (!date) {
      setTasksOnSelectedDay(todaysTasks);
      return;
    }
    if (range.start && range.end) {
      setTasksOnSelectedDay(
        getTasksByRange(range.start.toDate(), range.end.toDate())
      );
      // console.log(getTasksByRange(range.start.toDate(), range.end.toDate()));
    } else {
      setTasksOnSelectedDay(getTasksByDate(date.toDate()));
      // console.log(getTasksByDate(date.toDate()));
    }
  }, [date, selectedInterval]);

  return (
    <SafeAreaView>
      <ScrollView>
        <YStack gap='$4' padding='$4'>
          <H2>Mental Workload</H2>
          {/* <Dropdown
          action={() => setSelectedInterval}
          elements={intervalOptions.map((item) => {
            return (
              <Button size="$5" onPress={() => setSelectedInterval(item)}>
                <XStack gap="$3">
                  <Text style={{ textTransform: 'capitalize' }}>{item}</Text>
                </XStack>
              </Button>
            );
          })}
        >
          <Button borderRadius="$4" marginLeft="auto" backgroundColor="$blue8">
            <Text style={{ textTransform: 'capitalize' }}>
              {selectedInterval}
            </Text>
          </Button>
        </Dropdown> */}
          <Card
            paddingVertical='$6'
            paddingHorizontal='$4'
            borderColor='$blue4'
            borderWidth='$1'
            backgroundColor='$background0'
            borderRadius='$8'
          >
            <YStack alignItems='center'>
              <XStack justifyContent='center' marginBottom='$4'>
                <DateNavigator
                  date={date}
                  setDate={setDate}
                  range={range}
                  setRange={setRange}
                />
              </XStack>
              {mwlObject[date?.format('DD-MM-YYYY') || ''] ? (
                <MwlFeedbackLabel
                  mwl={
                    mwlObject?.[date?.format('DD-MM-YYYY') || '']?.mwl as
                      | 1
                      | 2
                      | 3
                      | 4
                      | 5
                  }
                />
              ) : (
                <Button
                  color='$color'
                  onPress={() => {
                    generateMentalWorkload(date?.toISOString());
                  }}
                >
                  Calculate Workload
                </Button>
              )}
              <XStack gap='$4' justifyContent='space-between'>
                <YStack gap='$2' justifyContent='center' alignItems='center'>
                  <H2>{tasksOnSelectedDay?.length || 0}</H2>
                  <Text color='$gray10'>Tasks Planned</Text>
                </YStack>
                <YStack gap='$2' justifyContent='center' alignItems='center'>
                  <H2>
                    {tasksOnSelectedDay?.filter(
                      (task) => task.status === 'done'
                    ).length || 0}
                  </H2>
                  <Text color='$gray10'>Tasks Completed</Text>
                </YStack>
                <YStack
                  gap='$2'
                  justifyContent='center'
                  alignItems='center'
                  borderWidth='$1'
                  borderColor={MwlMap[5].color}
                  padding='$4'
                  borderRadius='$8'
                >
                  <H2>
                    {(mwlObject?.[date?.format('DD-MM-YYYY') || '']?.mwl as
                      | 1
                      | 2
                      | 3
                      | 4
                      | 5) || 0}
                  </H2>

                  <Text color='$gray10'>MWL Score</Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>
          <Text>
            {mwlObject?.[date?.format('DD-MM-YYYY') || '']?.feedback || ''}
          </Text>
          <Graph interval={selectedInterval} date={date} range={range} />
          {tasksOnSelectedDay && (
            <YStack padding='$4'>
              <H3>Tasks on {date?.format('YYYY-MM-DD')}</H3>
              {tasksOnSelectedDay.length > 0 ? (
                tasksOnSelectedDay.map((task, index) => (
                  <TaskCard task={task} key={index} />
                ))
              ) : (
                <Text>No tasks</Text>
              )}
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MentalWorkloadScreen;
