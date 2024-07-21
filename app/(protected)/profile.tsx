import { useAuth } from '@/components/hooks/useAuth';
import { Feather } from '@expo/vector-icons';
import gAuth from '@react-native-firebase/auth';
import React from 'react';
import { Avatar, Button, Card, H2, H4, Text, View, YStack } from 'tamagui';

const ProfileScreen = () => {
  const { logout } = useAuth();
  const user = gAuth().currentUser;
  return (
    <View paddingHorizontal='$2'>
      <H2>Profile</H2>
      <YStack gap='$4'>
        <Avatar size='$12' circular marginHorizontal='auto'>
          <Avatar.Image
            accessibilityLabel='Cam'
            src={`https://ui-avatars.com/api/?name=${user?.displayName}`}
          />
          <Avatar.Fallback backgroundColor='$blue4' />
        </Avatar>
        <Card gap='$2' padding='$4'>
          <H4>Profile Details</H4>
          <Text>
            <Text color='$placeholderColor'>Username: </Text>
            {user?.displayName}
          </Text>
          <Text>
            <Text color='$placeholderColor'>Email: </Text>
            {user?.email}
          </Text>
        </Card>
        <Button
          onPress={logout}
          icon={<Feather name='log-out' color='white' />}
        >
          Logout
        </Button>
        <Button
          backgroundColor='$red10'
          icon={<Feather name='trash' color='white' />}
        >
          Delete account
        </Button>
      </YStack>
    </View>
  );
};

export default ProfileScreen;
