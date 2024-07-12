import { useAuth } from '@/components/hooks/useAuth';
import { useTasks } from '@/components/hooks/useTasks';
import Dropdown from '@/components/ui/Dropdown';
import TaskCard from '@/components/ui/TaskCard';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {
  Avatar,
  Button,
  H1,
  H2,
  H4,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';
import DonutCard from '../../components/ui/homepage/DonutCard';
import WeeklyCard from '../../components/ui/homepage/WeeklyCard';

const cardArray = [<DonutCard />, <WeeklyCard />];

export default function TabOneScreen() {
  const width = useWindowDimensions().width;
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, user } = useAuth();
  const { todaysTasks, fetchTasksAndMwl } = useTasks();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasksAndMwl();
    setRefreshing(false);
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
          <View>
            <XStack justifyContent='space-between' alignItems='center'>
              <H1>Hi {user?.displayName || 'user'}</H1>
              <Dropdown
                action={() => {}}
                elements={[
                  <Button size='$5' onPress={logout}>
                    <XStack gap='$3'>
                      <Text>Logout</Text>
                    </XStack>
                  </Button>,
                ]}
              >
                <Avatar size='$3' circular>
                  <Avatar.Image
                    accessibilityLabel='Cam'
                    src={`https://ui-avatars.com/api/?name=${user?.displayName}`}
                  />
                  <Avatar.Fallback backgroundColor='$blue4' />
                </Avatar>
              </Dropdown>
            </XStack>
            <H4 color='$accentBackground'>
              You have {todaysTasks.length} tasks remaining today
            </H4>
          </View>
          <View flex={1}>
            <Carousel
              loop={false}
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
                    index === activeCardIndex ? '#007aff' : '#gray'
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
              <View paddingVertical='$2'>
                <Text color='$gray10'>No tasks for today 🕸</Text>
              </View>
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
