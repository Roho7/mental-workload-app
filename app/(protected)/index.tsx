import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/hooks/useAuth';
import { useTasks } from '@/components/hooks/useTasks';
import Dropdown from '@/components/ui/Dropdown';
import TaskCard from '@/components/ui/TaskCard';
import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
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

  const { logout, user } = useAuth();
  const { todaysTasks } = useTasks();
  return (
    <ScrollView>
      <SafeAreaView>
        <YStack padding="$4" gap="$4">
          <View>
            <XStack justifyContent="space-between">
              <H1>Hi {user?.displayName || 'user'}</H1>
              <Dropdown
                action={() => {}}
                elements={[
                  <Button size="$5" onPress={() => logout()}>
                    <XStack gap="$3">
                      <Text>Logout</Text>
                    </XStack>
                  </Button>,
                ]}
              >
                <Avatar size="$5" circular>
                  <Avatar.Image
                    accessibilityLabel="Cam"
                    src={user?.photoURL || ''}
                  />
                  <Avatar.Fallback backgroundColor="$blue4" />
                </Avatar>
              </Dropdown>
            </XStack>
            <H4 color="$accentBackground">
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
              gap="$2"
              paddingTop="$4"
            >
              {cardArray.map((card, index) => {
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
          <H2>Today's Tasks</H2>
          <ScrollView maxHeight="$20">
            {todaysTasks && todaysTasks?.length > 0 ? (
              todaysTasks?.map((task, index) => (
                <TaskCard task={task} key={index} />
              ))
            ) : (
              <View paddingVertical="$2">
                <Text color="$gray10">No tasks for today 🕸 </Text>
              </View>
            )}
          </ScrollView>
          <H1>Inbox</H1>
          <ScrollView maxHeight="$20">
            {todaysTasks && todaysTasks?.length > 0 ? (
              todaysTasks?.map((task, index) => (
                <TaskCard task={task} key={index} />
              ))
            ) : (
              <View paddingVertical="$2">
                <Text color="$gray10">No tasks for today 🕸 </Text>
              </View>
            )}
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </ScrollView>
  );
}
