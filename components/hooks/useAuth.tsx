import { auth, db } from '@/utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
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

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => void;
  signup: (email: string, username: string, password: string) => void;
  signInWithGoogle: () => void;
  logout: () => void;
  setUser: (user: User) => void;
  userPreferences: any | null;
  setUserPreferences: (preferences: any) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<any | null>(null);
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
      await AsyncStorage.setItem('user', JSON.stringify(new_user.user));
    } catch (error: any) {
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            alert('Invalid email address format.');
            throw new Error('Invalid email address format.');
          case 'auth/user-disabled':
            alert('User account is disabled.');
            throw new Error('User account is disabled.');
          case 'auth/invalid-password':
            alert(
              'Invalid password. Password should be at least 6 characters.'
            );
            throw new Error('Invalid password. Please try again.');
          default:
            alert('Failed to create account. Please try again later.');
            console.log(error);
            throw new Error(
              'Failed to create account. Please try again later.',
              error
            );
        }
      } else {
        alert('An unexpected error occurred.');
        throw new Error('An unexpected error occurred.');
      }
    } finally {
      router.replace('/(onboarding)');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      // Retrieve the user from AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      const userPreferences = await AsyncStorage.getItem('userPreferences');
      if (storedUser !== null) {
        setUser(JSON.parse(storedUser));
      }
      if (userPreferences !== null) {
        setUserPreferences(JSON.parse(userPreferences));
      }

      // Perform the sign-in
      const res = await signInWithEmailAndPassword(auth, username, password);
      setUser(res.user);
      await AsyncStorage.setItem('user', JSON.stringify(res.user));

      router.replace('/(protected)');
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

  async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      // const googleCredential = gAuth.GoogleAuthProvider.credential(
      //   user.idToken
      // );
      // await gAuth().signInWithCredential(googleCredential);
      setUser(user as unknown as User);
    } catch (error) {
      console.error(error);
    }
  }

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
        const onboardingRef = collection(
          db,
          `tbl_users/${user?.uid}/preferences`
        );
        const onboardingSnapshot = await getDocs(onboardingRef);

        setUserPreferences(onboardingSnapshot.docs[0].data());

        await AsyncStorage.setItem(
          'userPreferences',
          JSON.stringify(onboardingSnapshot.docs[0].data())
        );

        setUserPreferences(onboardingSnapshot.docs[0].data());
        router.replace('/(protected)');
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
      signInWithGoogle,
      logout,
      setUser,
      userPreferences,
      setUserPreferences,
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
