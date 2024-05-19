import { useAuth } from '@/components/hooks/useAuth';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H1, H3, Input, View } from 'tamagui';

type Props = {};

const LoginPage = (props: Props) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      login(email, password);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView
      className="flex h-full flex-col items-center justify-center p-4"
      style={{ rowGap: 16 }}
    >
      <H1>Login</H1>
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

        <Button width="$20" onPress={() => handleSignIn()}>
          Submit
        </Button>
        <H3>or</H3>
        <Link href="/login">Login</Link>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
