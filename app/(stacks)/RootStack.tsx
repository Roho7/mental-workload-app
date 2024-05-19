import { Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../../components/hooks/useAuth';

const RootStack = () => {
  const { user } = useAuth();

  return user ? (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="(auth)/login"
    >
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
    </Stack>
  ) : (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="(auth)/login"
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
};

export default RootStack;
