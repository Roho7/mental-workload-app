import { useTasks } from '@/components/hooks/useTasks';
import DateNavigator from '@/components/ui/DateNavigator';

import Graph from '@/components/ui/Graph';
import { MwlMap } from '@/components/ui/MwlBadge';
import MwlFeedbackLabel from '@/components/ui/MwlFeedbackLabel';
import TaskCard, { TaskType } from '@/components/ui/TaskCard';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    generateMentalWorkload,
    getTasksByDate,
    getTasksByRange,
    mwlObject,
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
                  marginBlock='$4'
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
                    {mwlObject?.[date?.format('DD-MM-YYYY') || '']?.feedback ||
                      ''}
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
    </SafeAreaView>
  );
};

export default MentalWorkloadScreen;
