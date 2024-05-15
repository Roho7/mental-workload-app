import { View, Text } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <SafeAreaView className="flex h-full flex-col items-center p-4">
      <Text>Login</Text>
      <View className="flex w-full flex-col items-center" style={{ rowGap: 8 }}>
        <TextInput
          placeholder="Email"
          className="w-40 rounded-sm bg-gray-200 p-2"
        />
        <TextInput
          placeholder="Password"
          className="w-40 rounded-sm bg-gray-200 p-2"
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    padding: 10,
    borderStyle: 'solid',
    borderBlockColor: 'black',
  },
});
