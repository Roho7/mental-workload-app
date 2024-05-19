import { useAuth } from '@/components/hooks/useAuth';
import { Link } from 'expo-router';
import React, { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H3, Input, View, YStack } from 'tamagui';

type Props = {};

const SignupPage = (props: Props) => {
  const { signup, user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log('user', user);

  const handleSignUp = async () => {
    try {
      signup(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <YStack alignItems="center" marginBlock="auto" rowGap="$4" width="full">
        <H3>Create a new Account</H3>
        <View rowGap="$2" alignItems="center">
          <Input
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.nativeEvent.text);
            }}
            width="$20"
          />
          <Input
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.nativeEvent.text);
            }}
            width="$20"
          />

          <Button width="$20" onPress={() => handleSignUp()}>
            Submit
          </Button>
          <H3>or</H3>
          <Link href="/login" style={{ color: 'gray' }}>
            Login with existing account
          </Link>
        </View>
      </YStack>
    </SafeAreaView>
  );
};

export default SignupPage;
