import { useAuth } from '@/components/hooks/useAuth';
import Colors from '@/constants/Colors';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!user) {
    return <Redirect href='/login' />;
  }
  return (
    <SafeAreaView style={{ flex: 1, flexGrow: 1, backgroundColor: 'black' }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name='home' color={color} />,
            headerRight: () => (
              <Link href='/modal' asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name='info-circle'
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
          name='add-task'
          options={{
            title: 'Add Task',

            tabBarIcon: ({ color }) => (
              <TabBarIcon name='plus-circle' color={color} />
            ),
            headerRight: () => (
              <Link href='/modal' asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name='info-circle'
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
          name='mental-workload'
          options={{
            title: 'Mental Workload',
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name='brain' size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='calendar'
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='calendar' color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
