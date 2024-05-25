import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/hooks/useAuth';
import { useTasks } from '@/components/hooks/useTasks';
import DonutChart from '@/components/ui/DonutChart';
import Dropdown from '@/components/ui/Dropdown';
import TaskCard from '@/components/ui/TaskCard';
import { useState } from 'react';
import {
  Avatar,
  Button,
  H1,
  H4,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';

type WeekMwlType = { day: string; mwl: number };

const weekMap: Record<number, WeekMwlType> = {
  0: { day: 'Sun', mwl: 2 },
  1: { day: 'Mon', mwl: 3 },
  2: { day: 'Tue', mwl: 6 },
  3: { day: 'Wed', mwl: 3 },
  4: { day: 'Thu', mwl: 1 },
  5: { day: 'Fri', mwl: 3 },
  6: { day: 'Sat', mwl: 4 },
};

export default function TabOneScreen() {
  const { logout, user } = useAuth();
  const { todaysTasks } = useTasks();

  const [today, setToday] = useState(weekMap[new Date().getDay()].day);

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
            <H4 color="$accentBackground">You have 5 tasks remaining today</H4>
          </View>
          <ScrollView horizontal>
            <XStack gap="$4">
              <View
                borderColor="$blue4"
                borderWidth="$1"
                backgroundColor="$background"
                borderRadius="$8"
                padding="$4"
                style={{ width: '100vw' }}
              >
                <View className="flex flex-col items-center justify-center">
                  <Text className="text-green-500">Smooth Sailing</Text>
                  <DonutChart />
                </View>
              </View>
              <View
                borderColor="$blue4"
                borderWidth="$1"
                backgroundColor="$background"
                borderRadius="$8"
                padding="$4"
                style={{ width: '100vw' }}
              >
                <View className="flex flex-col items-center justify-center">
                  <XStack gap="$4">
                    {[0, 1, 2, 3, 4, 5, 6].map((item: number) => {
                      return (
                        <YStack key={item} gap="$2" alignItems="center">
                          <View
                            width="$1"
                            height="$14"
                            borderRadius="$4"
                            backgroundColor="$blue5"
                            padding="$1"
                          >
                            <View
                              marginTop="auto"
                              style={{ height: `${weekMap[item].mwl * 10}%` }}
                              borderRadius="$4"
                              backgroundColor="$blue10"
                            ></View>
                          </View>
                          <Text
                            color={
                              weekMap[item].day === today
                                ? '$blue11'
                                : '$gray10'
                            }
                          >
                            {weekMap[item].day}
                          </Text>
                        </YStack>
                      );
                    })}
                  </XStack>
                </View>
              </View>
            </XStack>
          </ScrollView>
          <Text className="text-2xl">Today's Tasks</Text>
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
          <Text className="text-2xl">Inbox</Text>
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
