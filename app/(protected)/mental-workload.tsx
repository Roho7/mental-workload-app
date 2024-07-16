import { useTasks } from '@/components/hooks/useTasks';
import DateNavigator from '@/components/ui/DateNavigator';

import Graph from '@/components/ui/Graph';
import MwlModal from '@/components/ui/mental-workload/MwlModal';

import MwlFeedbackLabel from '@/components/ui/MwlFeedbackLabel';
import TaskCard from '@/components/ui/TaskCard';
import { TaskType } from '@/constants/types';
import { useToastController } from '@tamagui/toast';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, Vibration } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {
  Button,
  Card,
  H2,
  H3,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  XStack,
  YStack,
} from 'tamagui';
export type intervalTypes = 'daily' | 'weekly' | 'monthly';

const intervalOptions: intervalTypes[] = ['daily', 'weekly', 'monthly'];

const MentalWorkloadScreen = () => {
  const {
    todaysTasks,
    getTasksByDate,
    getTasksByRange,
    mwlObject,
    fetchTasksAndMwl,
  } = useTasks();
  const width = useWindowDimensions().width;

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
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const toast = useToastController();
  const [openMwlModal, setOpenMwlModal] = useState(false);

  const onRefresh = useCallback(() => {
    Vibration.vibrate(10);
    setRefreshing(true);
    fetchTasksAndMwl();
    setRefreshing(false);
    toast.show('Refreshed!', {
      native: true,
    });
  }, [fetchTasksAndMwl]);

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
    }
  }, [date, selectedInterval, fetchTasksAndMwl]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: '#000',
          padding: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <YStack gap='$4'>
          <H2>Mental Workload</H2>
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
              {mwlObject.current[date?.format('DD-MM-YYYY') || ''] ? (
                <MwlFeedbackLabel
                  mwl={
                    mwlObject?.current?.[date?.format('DD-MM-YYYY') || '']
                      ?.mwl as 1 | 2 | 3 | 4 | 5
                  }
                />
              ) : (
                <Button
                  marginBlock='$4'
                  color='$color'
                  onPress={() => setOpenMwlModal(true)}
                >
                  Calculate Workload
                </Button>
              )}
              <XStack gap='$4'>
                <YStack
                  gap='$2'
                  justifyContent='center'
                  alignItems='center'
                  maxWidth='$8'
                >
                  <H2>{tasksOnSelectedDay?.length || 0}</H2>
                  <Text color='$gray10' textAlign='center'>
                    Tasks Planned
                  </Text>
                </YStack>
                <YStack
                  gap='$2'
                  justifyContent='center'
                  alignItems='center'
                  maxWidth='$8'
                >
                  <H2>
                    {tasksOnSelectedDay?.filter(
                      (task) => task.status === 'done'
                    ).length || 0}
                  </H2>
                  <Text color='$gray10' textAlign='center'>
                    Tasks Completed
                  </Text>
                </YStack>
                <YStack
                  gap='$2'
                  justifyContent='center'
                  alignItems='center'
                  borderWidth='$1'
                  maxWidth='$8'
                  borderColor={
                    ''
                    // mwlObject.current
                    //   ? MwlMap[
                    //       mwlObject?.current?.[date?.format('DD-MM-YYYY') || '']
                    //         ?.mwl
                    //     ].color
                    //   : ''
                  }
                  padding='$2'
                  paddingBlock='$4'
                  borderRadius='$8'
                >
                  <H2>
                    {(mwlObject?.current?.[date?.format('DD-MM-YYYY') || '']
                      ?.mwl as 1 | 2 | 3 | 4 | 5) || 0}
                  </H2>

                  <Text color='$gray10' textAlign='center'>
                    MWL Score
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>
          <View flex={1}>
            <Carousel
              loop={false}
              width={width}
              height={width / 1.5}
              data={[
                <Graph interval={selectedInterval} date={date} range={range} />,
                <Card
                  paddingVertical='$6'
                  paddingHorizontal='$4'
                  borderColor='$blue4'
                  borderWidth='$1'
                  backgroundColor='$background0'
                  borderRadius='$8'
                >
                  <Text>
                    {mwlObject?.current?.[date?.format('DD-MM-YYYY') || '']
                      ?.feedback || ''}
                  </Text>
                </Card>,
              ]}
              style={{ width: '100%' }}
              pagingEnabled={true}
              onSnapToItem={(index) => setActiveCardIndex(index)}
              renderItem={({ index, item }) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <View style={{ width: '90%' }}>{item}</View>
                  </View>
                );
              }}
            />
            <XStack
              style={{
                width: '100%',
                justifyContent: 'center',
              }}
              gap='$2'
              paddingTop='$4'
            >
              {[1, 2].map((card, index) => {
                return (
                  <View
                    key={index}
                    borderRadius={10}
                    backgroundColor={
                      index === activeCardIndex ? '$blue10' : '$gray10'
                    }
                    height={4}
                    width={4}
                  ></View>
                );
              })}
            </XStack>
          </View>
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
      <MwlModal open={openMwlModal} setOpen={setOpenMwlModal} date={date} />
    </SafeAreaView>
  );
};

export default MentalWorkloadScreen;
