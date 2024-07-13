import { auth, db } from '@/utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => void;
  signup: (email: string, username: string, password: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const toast = useToastController();

  const signup = async (email: string, username: string, password: string) => {
    try {
      const new_user = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(new_user.user, {
        displayName: username,
      });

      setUser(new_user.user);
      router.replace('/(onboarding)');
    } catch (error: any) {
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            alert('Invalid email address format.');
            throw new Error('Invalid email address format.');
          case 'auth/user-disabled':
            alert('User account is disabled.');
            throw new Error('User account is disabled.');
          case 'auth/user-not-found':
            alert('User not found. Please check your email and password.');
            throw new Error(
              'User not found. Please check your email and password.'
            );
          case 'auth/wrong-password':
            alert('Incorrect password. Please try again.');
            throw new Error('Incorrect password. Please try again.');
          default:
            alert('Failed to login User. Please try again later.');
            throw new Error('Failed to login User. Please try again later.');
        }
      } else {
        alert('An unexpected error occurred.');
        throw new Error('An unexpected error occurred.');
      }
    }
  };

  const login = async (username: string, password: string) => {
    try {
      AsyncStorage.getItem('user').then((res) => {
        if (res !== null) setUser(JSON.parse(res));
        return;
      });
      const res = await signInWithEmailAndPassword(auth, username, password);
      setUser(res.user);
      AsyncStorage.setItem('user', JSON.stringify(res.user));
      const onboardingRef = collection(
        db,
        `tbl_users/${res.user.uid}/preferences`
      );
      const onboardingSnapshot = await getDocs(onboardingRef);

      // Navigate based on the existence of onboarding data
      if (onboardingSnapshot.empty) {
        router.replace('/(onboarding)');
      } else {
        router.replace('/(protected)');
      }
    } catch (error: any) {
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            alert('Invalid email address format.');
            throw new Error('Invalid email address format.');
          case 'auth/user-disabled':
            alert('User account is disabled.');
            throw new Error('User account is disabled.');
          case 'auth/user-not-found':
            alert('User not found. Please check your email and password.');
            throw new Error(
              'User not found. Please check your email and password.'
            );
          case 'auth/wrong-password':
            alert('Incorrect password. Please try again.');
            throw new Error('Incorrect password. Please try again.');
          default:
            alert('Failed to login User. Please try again later.');
            throw new Error('Failed to login User. Please try again later.');
        }
      } else {
        alert('An unexpected error occurred.');
        throw new Error('An unexpected error occurred.');
      }
    }
  };

  const logout = () => {
    AsyncStorage.setItem('user', '');
    signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data from AsyncStorage', error);
      }
    };

    getUser();
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      setUser,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
};
