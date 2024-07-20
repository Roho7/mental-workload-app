import { useAuth } from '@/components/hooks/useAuth';
import Colors from '@/constants/Colors';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Redirect, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Text } from 'tamagui';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(
  props: {
    name: React.ComponentProps<typeof Feather>['name'];
    color: string;
  } & React.ComponentProps<typeof Feather>
) {
  return <Feather size={28} style={{ color: props.color }} {...props} />;
}
const preferences = AsyncStorage.getItem('userPreferences');

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
  if (!preferences) {
    return <Redirect href='/(onboarding)' />;
  }
  return (
    <SafeAreaView
      style={{ flex: 1, flexGrow: 1, height: '100%', backgroundColor: 'black' }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            padding: 10,
            paddingBottom: 10,
            height: 60,
          },
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
          name='inbox'
          options={{
            title: 'Inbox',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='inbox' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: () => (
              <Avatar size='$2' circular>
                <Avatar.Image
                  accessibilityLabel='Cam'
                  src={`https://ui-avatars.com/api/?name=${user?.displayName}`}
                />
                <Avatar.Fallback backgroundColor='$blue4' />
              </Avatar>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
