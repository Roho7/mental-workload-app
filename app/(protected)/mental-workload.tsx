import { useTasks } from '@/components/hooks/useTasks';
import DateNavigator from '@/components/ui/DateStrip';
import Dropdown from '@/components/ui/Dropdown';
import Graph from '@/components/ui/Graph';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, H2, Text, View, XStack, YStack } from 'tamagui';
export type intervalTypes = 'daily' | 'weekly' | 'monthly';

const intervalOptions: intervalTypes[] = ['daily', 'weekly', 'monthly'];

const MentalWorkloadScreen = () => {
  const { todaysTasks, completedTasks, getTasksByDate } = useTasks();
  const [selectedInterval, setSelectedInterval] = useState<
    'daily' | 'weekly' | 'monthly'
  >(intervalOptions[0]);
  const [date, setDate] = useState(moment());
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    setTotalTasks(getTasksByDate(date.toDate()).length);
  }, [date, selectedInterval]);

  return (
    <SafeAreaView>
      <YStack gap="$4" padding="$4">
        <H2>Mental Workload</H2>
        <Dropdown
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
        </Dropdown>
        <Card
          paddingVertical="$6"
          paddingHorizontal="$4"
          borderColor="$blue4"
          borderWidth="$1"
          backgroundColor="$background075"
          borderRadius="$8"
        >
          <View>
            <XStack justifyContent="center" marginBottom="$4">
              <DateNavigator date={date} setDate={setDate} />
            </XStack>
            <XStack gap="$4" justifyContent="space-between">
              <YStack gap="$2" justifyContent="center" alignItems="center">
                <H2>{totalTasks || todaysTasks.length}</H2>
                <Text color="$gray10">Tasks Planned</Text>
              </YStack>
              <YStack gap="$2" justifyContent="center" alignItems="center">
                <H2>{completedTasks.length}</H2>
                <Text color="$gray10">Tasks Completed</Text>
              </YStack>
              <YStack gap="$2" justifyContent="center" alignItems="center">
                <H2>5</H2>
                <Text color="$gray10">MWL Score</Text>
              </YStack>
            </XStack>
          </View>
        </Card>
        <Graph interval={selectedInterval} />
        <YStack></YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default MentalWorkloadScreen;
