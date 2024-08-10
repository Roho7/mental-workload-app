import { useAuth } from '@/components/hooks/useAuth';
import { useTasks } from '@/components/hooks/useTasks';
import StatsCard from '@/components/ui/StatsCard';
import TaskCard from '@/components/ui/TaskCard';
import { tipsArray } from '@/constants/TaskParameters';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import gAuth from '@react-native-firebase/auth';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  useWindowDimensions,
  Vibration,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Button, H1, H2, ScrollView, Text, View, YStack } from 'tamagui';
import DayDistributionCard from '../../components/ui/homepage/DayDistributionCard';
import DonutCard from '../../components/ui/homepage/DonutCard';

const cardArray = tipsArray.map((tip, index) => {
  <StatsCard
    key={index + Math.random() * 100}
    color='yellow'
    style={{ height: 100, width: '100%' }}
    badge={<FontAwesome5 name='lightbulb' size={14} color='yellow' />}
  >
    <Text fontSize={10}>Tip</Text>
    <View>
      <Text color='$yellow' fontSize={14}>
        {tip}
      </Text>
    </View>
  </StatsCard>;
});

export default function TabOneScreen() {
  const width = useWindowDimensions().width;
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuth();
  const { todaysTasks, fetchTasksAndMwl, todaysApproximateMWL } = useTasks();
  const toast = useToastController();
  const user = gAuth().currentUser;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasksAndMwl();
    setRefreshing(false);
    Vibration.vibrate(10);
    toast.show('Refreshed!', {
      native: true,
    });
  }, [fetchTasksAndMwl]);

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
        <YStack gap='$4' flex={1}>
          <H1>Hi {user?.displayName?.split(' ')[0] || 'user'}!</H1>
          <Carousel
            loop={true}
            snapEnabled={true}
            autoPlay
            autoPlayInterval={8000}
            width={width}
            height={100}
            data={tipsArray.map((tip, index) => (
              <Text>{tip}</Text>
            ))}
            pagingEnabled={true}
            onSnapToItem={(index) => setActiveCardIndex(index)}
            renderItem={({ index, item }) => (
              <StatsCard
                key={index + Math.random() * 100}
                color='yellow'
                style={{ height: 100, width: '90%' }}
                badge={
                  <FontAwesome5 name='lightbulb' size={14} color='yellow' />
                }
              >
                <Text fontSize={10}>Tip</Text>
                <View height='100%'>
                  <Text color='$yellow' fontSize={14}>
                    {item}
                  </Text>
                </View>
              </StatsCard>
            )}
          />
          <DonutCard />
          <DayDistributionCard />

          <View
            display='flex'
            flexDirection='row'
            gap='$2'
            width='100%'
            position='relative'
          >
            <StatsCard
              color='green'
              badge={<FontAwesome5 name='brain' size={14} color='green' />}
            >
              <Text fontSize={10}>Today</Text>
              <View>
                <Text color='$green9' fontSize={16}>
                  Approx. MWL
                </Text>
                <H1>{todaysApproximateMWL.avg}</H1>
              </View>
            </StatsCard>
            <StatsCard
              color='orange'
              badge={<FontAwesome5 name='brain' size={14} color='orange' />}
            >
              <Text fontSize={10}>This week</Text>
              <View>
                <Text color='$orange9' fontSize={16}>
                  Calculated MWL
                </Text>
                <H1>{todaysApproximateMWL.avg}</H1>
              </View>
            </StatsCard>
          </View>
          <View>
            <H2>Today's Tasks</H2>
            {todaysTasks && todaysTasks.length > 0 ? (
              todaysTasks.map((task, index) => (
                <TaskCard task={task} key={index} />
              ))
            ) : (
              <YStack paddingVertical='$2' gap='$2'>
                <Text color='$gray10'>No tasks for today 🕸</Text>
                <Button
                  onPress={() => {
                    router.push('/add-task');
                  }}
                  icon={<Feather name='plus' color='white' />}
                >
                  Add Tasks
                </Button>
              </YStack>
            )}
          </View>
          {/* <View>
            <H2>Inbox</H2>
            {todaysTasks && todaysTasks.length > 0 ? (
              todaysTasks.map((task, index) => (
                <TaskCard task={task} key={index} />
              ))
            ) : (
              <View paddingVertical='$2'>
                <Text color='$gray10'>No tasks for today 🕸</Text>
              </View>
            )}
          </View> */}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
