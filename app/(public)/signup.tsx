import { useAuth } from '@/components/hooks/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H3, H4, Image, Input, Text, View, YStack } from 'tamagui';

type Props = {};

const SignupPage = (props: Props) => {
  const { signup, user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      signup(email, username, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <YStack alignItems="center" marginBlock="auto" rowGap="$4" width="full">
        <Image
          width={236}
          height={93.3}
          source={require('../../assets/images/logo-long.png')}
        />
        <H4 size="$2">Create a new Account</H4>
        <View rowGap="$2" alignItems="center">
          <Input
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.nativeEvent.text);
            }}
            width="$20"
          />
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
          <Button backgroundColor="white" onPress={() => handleGoogleSignUp}>
            <FontAwesome name="google" color="black" />
            <Text color="black">Continue with Google</Text>
          </Button>
          <Link href="/login" style={{ color: 'gray' }}>
            Login with existing account
          </Link>
        </View>
      </YStack>
    </SafeAreaView>
  );
};

export default SignupPage;
