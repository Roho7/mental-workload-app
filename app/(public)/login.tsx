import { useAuth } from '@/components/hooks/useAuth';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { Link, Redirect } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H3, H4, Image, Input, Text, View, YStack } from 'tamagui';

type Props = {};

const LoginPage = (props: Props) => {
  const { login, user, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    login(email, password);
  };

  const isUserOnboadingDone = () => {};

  if (user) {
    return <Redirect href='/(protected)' />;
  }
  return (
    <SafeAreaView style={{ rowGap: 16 }}>
      <YStack
        justifyContent='center'
        alignItems='center'
        gap='$4'
        style={{ height: '100%' }}
      >
        <Image
          width={236}
          height={93.3}
          source={require('../../assets/images/logo-long.png')}
        />
        <H4 size='$2'>Login </H4>
        <View rowGap='$2' alignItems='center'>
          <Input
            placeholder='Email'
            onChange={(e) => {
              setEmail(e.nativeEvent.text);
            }}
            keyboardType='email-address'
            width='$20'
            textContentType='emailAddress'
          />
          <Input
            placeholder='Password'
            onChange={(e) => {
              setPassword(e.nativeEvent.text);
            }}
            width='$20'
            textContentType='password'
            secureTextEntry
          />
          <Button width='$20' onPress={() => handleSignIn()}>
            Submit
          </Button>
        </View>
        <H3>or</H3>
        {/* <Button backgroundColor='white' onPress={() => signInWithGoogle}>
          <FontAwesome name='google' color='black' />
          <Text color='black'>Continue with Google</Text>
        </Button> */}
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          onPress={signInWithGoogle}
        />

        <YStack gap='$1'>
          <Text color='$gray10'>New to Serotonin?</Text>
          <Link href='/signup'>
            <Text>Create an Account</Text>
          </Link>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default LoginPage;
