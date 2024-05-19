import { SafeAreaView } from 'react-native-safe-area-context';

import DonutChart from '@/components/ui/DonutChart';
import TaskCard, { TaskType } from '@/components/ui/TaskCard';
import { db } from '@/utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { H1, H4, ScrollView, Text, View, YStack } from 'tamagui';

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  useEffect(() => {
    const taskRef = collection(db, 'tbl_tasks');

    const subscriber = onSnapshot(taskRef, {
      next: (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          ...(doc.data() as TaskType),
        }));
        setTasks(tasks as TaskType[]);
        console.log('tasks', tasks);
      },
    });
    return () => subscriber();
  }, []);
  return (
    <ScrollView>
      <SafeAreaView>
        <YStack padding="$4" gap="$4">
          <View>
            <H1>Hi Roho!</H1>
            <H4 color="$accentBackground">You have 5 tasks remaining today</H4>
          </View>
          <View
            borderColor="$blue4"
            borderWidth="$1"
            backgroundColor="$background"
            borderRadius="$8"
            padding="$4"
          >
            <Text className="text-2xl">Your Day</Text>
            <View className="flex flex-col items-center justify-center">
              <Text className="text-green-500">Smooth Sailing</Text>
              <DonutChart />
            </View>
          </View>
          <Text className="text-2xl">Tasks</Text>
          <ScrollView maxHeight="$20">
            {tasks &&
              tasks?.length > 0 &&
              tasks?.map((task, index) => <TaskCard {...task} key={index} />)}
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </ScrollView>
  );
}
