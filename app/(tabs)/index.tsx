import { Text, View } from '@/components/Themed';
import { Button, Pressable, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { tasksDemo } from '@/constants/Tasks';
import DonutChart from '@/components/ui/DonutChart';
import TaskCard from '@/components/ui/TaskCard';

export default function TabOneScreen() {
  return (
    <ScrollView>
      <SafeAreaView className="flex h-screen flex-1 flex-col gap-4 overflow-y-scroll bg-white p-4">
        <View className="bg-transparent">
          <Text className="text-4xl font-semibold text-gray-800">Hi Roho!</Text>
          <Text className="text-sm text-gray-400">
            You have 5 tasks remaining today
          </Text>
          <Pressable>
            <Feather name="sun" />
          </Pressable>
        </View>
        <View className="rounded-lg border border-gray-200 p-4">
          <Text className="text-2xl">Your Day</Text>
          <View className="flex flex-col items-center justify-center">
            <Text className="text-green-500">Smooth Sailing</Text>
            <DonutChart />
          </View>
        </View>
        <Text className="text-2xl">Tasks</Text>
        <ScrollView className="flex flex-col">
          {tasksDemo.map((task, index) => (
            <TaskCard {...task} key={index} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
}
