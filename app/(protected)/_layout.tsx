import { TaskProvider } from '@/components/hooks/useTasks';
import Colors from '@/constants/Colors';
import { auth } from '@/utils/firebase';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router, Tabs, useRootNavigationState } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { Text } from 'tamagui';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(
  props: {
    name: React.ComponentProps<typeof Feather>['name'];
    color: string;
  } & React.ComponentProps<typeof Feather>
) {
  return (
    <Feather
      size={28}
      style={{ marginBottom: -3, color: props.color }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const rootNavigationState = useRootNavigationState();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!rootNavigationState?.key) return null;
      setIsLoading(false);
      if (!user) {
        router.replace('/(public)/login');
      }
    });

    // Check auth status on mount
    const user = auth.currentUser;
    if (!user) {
      router.replace('/(public)/login');
    } else {
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <TaskProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="add-task"
          options={{
            title: 'Add Task',

            tabBarIcon: ({ color }) => (
              <TabBarIcon name="plus-circle" color={color} />
            ),
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="mental-workload"
          options={{
            title: 'Mental Workload',
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="brain" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="calendar" color={color} />
            ),
          }}
        />
      </Tabs>
    </TaskProvider>
  );
}
