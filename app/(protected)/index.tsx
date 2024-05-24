import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/hooks/useAuth';
import { useTasks } from '@/components/hooks/useTasks';
import DonutChart from '@/components/ui/DonutChart';
import TaskCard from '@/components/ui/TaskCard';
import {
  Avatar,
  H1,
  H4,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';

export default function TabOneScreen() {
  const { logout, user } = useAuth();
  const { todaysTasks } = useTasks();

  return (
    <ScrollView>
      <SafeAreaView>
        <YStack padding="$4" gap="$4">
          <View>
            <XStack justifyContent="space-between">
              <H1>Hi {user?.displayName || 'user'}</H1>
              <Avatar size="$5" circular>
                <Avatar.Image
                  accessibilityLabel="Cam"
                  src={user?.photoURL || ''}
                />
                <Avatar.Fallback backgroundColor="$blue4" />
              </Avatar>
            </XStack>
            <H4 color="$accentBackground">You have 5 tasks remaining today</H4>
            <H4 onPress={() => logout()}>Logout</H4>
          </View>
          <View
            borderColor="$blue4"
            borderWidth="$1"
            backgroundColor="$background"
            borderRadius="$8"
            padding="$4"
          >
            <View className="flex flex-col items-center justify-center">
              <Text className="text-green-500">Smooth Sailing</Text>
              <DonutChart />
            </View>
          </View>
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
