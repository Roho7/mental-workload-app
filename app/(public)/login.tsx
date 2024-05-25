import { useAuth } from '@/components/hooks/useAuth';
import { useToastController } from '@tamagui/toast';
import { Link } from 'expo-router';
import React, { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H4, Image, Input, Text, View, YStack } from 'tamagui';

type Props = {};

const LoginPage = (props: Props) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToastController();

  const handleSignIn = () => {
    login(email, password);
  };
  return (
    <SafeAreaView
      className="flex h-full flex-col items-center justify-center p-4"
      style={{ rowGap: 16 }}
    >
      <Image
        width={236}
        height={93.3}
        source={require('../../assets/images/logo-long.png')}
      />
      <H4 size="$2">Login</H4>
      <View rowGap="$2" alignItems="center">
        <Input
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.nativeEvent.text);
          }}
          keyboardType="email-address"
          width="$20"
          textContentType="emailAddress"
        />
        <Input
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.nativeEvent.text);
          }}
          width="$20"
          textContentType="password"
          secureTextEntry
        />

        <Button width="$20" onPress={() => handleSignIn()}>
          Submit
        </Button>
      </View>

      <YStack gap="$1">
        <Text color="$gray10">New to Serotonin?</Text>
        <Link href="/signup">
          <Text>Create an Account</Text>
        </Link>
      </YStack>
    </SafeAreaView>
  );
};

export default LoginPage;
