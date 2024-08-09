import { useAuth } from '@/components/hooks/useAuth';
import { useTasks } from '@/components/hooks/useTasks';
import TaskCard from '@/components/ui/TaskCard';
import { Feather } from '@expo/vector-icons';
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
import {
  Button,
  H1,
  H2,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';
import DayDistributionCard from '../../components/ui/homepage/DayDistributionCard';
import DonutCard from '../../components/ui/homepage/DonutCard';
const cardArray = [<DonutCard />, <DayDistributionCard />];

export default function TabOneScreen() {
  const width = useWindowDimensions().width;
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuth();
  const { todaysTasks, fetchTasksAndMwl } = useTasks();
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
          <H1>Hi {user?.displayName || 'user'}!</H1>

          <View>
            <Carousel
              loop={true}
              snapEnabled={true}
              autoPlay
              autoPlayInterval={5000}
              width={width}
              height={width / 1.5}
              data={cardArray}
              style={{ width: '100%' }}
              pagingEnabled={true}
              onSnapToItem={(index) => setActiveCardIndex(index)}
              renderItem={({ index, item }) => (
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
              )}
            />
            <XStack
              style={{
                width: '100%',
                justifyContent: 'center',
              }}
              gap='$2'
              paddingTop='$4'
            >
              {cardArray.map((_, index) => (
                <View
                  key={index}
                  borderRadius={10}
                  backgroundColor={
                    index === activeCardIndex ? '#007aff' : 'gray'
                  }
                  height={4}
                  width={4}
                />
              ))}
            </XStack>
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
