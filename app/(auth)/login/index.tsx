import React from 'react';
import { StyleSheet } from 'react-native';

import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleLoginButton from '../components/google';
import { H1, H3, View } from 'tamagui';

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <SafeAreaView
      className="flex h-full flex-col items-center justify-center p-4"
      style={{ rowGap: 16 }}
    >
      <H1>Login</H1>
      <View className="flex w-full flex-col items-center" style={{ rowGap: 8 }}>
        <TextInput
          placeholder="Email"
          className="w-[70vw] rounded-md bg-gray-200 p-4"
        />
        <TextInput
          placeholder="Password"
          className="w-[70vw] rounded-md bg-gray-200 p-4"
        />

        <H3>or</H3>
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
