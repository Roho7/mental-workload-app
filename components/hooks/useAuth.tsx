import { GoogleCalendarEventType } from '@/constants/types';
import { auth, db } from '@/utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import gAuth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useToastController } from '@tamagui/toast';
import axios from 'axios';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// GoogleSignin.configure();
GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  webClientId:
    '259742826474-n3htn8iao53j5u0828q6i21up1o7gvto.apps.googleusercontent.com',
});

type AuthContextType = {
  login: (username: string, password: string) => void;
  signup: (email: string, username: string, password: string) => void;
  signInWithGoogle: () => void;
  logout: () => void;

  userPreferences: any | null;
  setUserPreferences: (preferences: any) => void;
  getCalendarEvents: () => Promise<GoogleCalendarEventType[] | undefined>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<any | null>(null);
  const toast = useToastController();

  const signup = async (email: string, username: string, password: string) => {
    try {
      const new_user = await gAuth().createUserWithEmailAndPassword(
        email,
        password
      );

      // await updateProfile(new_user.user, {
      //   displayName: username,
      // });

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
      // Perform the sign-in
      const res = await gAuth().signInWithEmailAndPassword(username, password);

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
      const googleCredential = gAuth.GoogleAuthProvider.credential(
        user.idToken
      );
      await gAuth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
    }
  }

  const logout = async () => {
    console.log('Logging out...');
    await GoogleSignin.signOut();
    await gAuth().signOut();
    await AsyncStorage.setItem('user', '');
    signOut(auth);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        // const userData = await AsyncStorage.getItem('user');
        // if (userData) {
        //   setUser(JSON.parse(userData));
        // }
        const onboardingRef = collection(
          db,
          `tbl_users/${gAuth().currentUser?.uid}/preferences`
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

  // ------------------------------------------------------------------  //
  //                             HELPERS                                 //
  // ------------------------------------------------------------------  //

  const getCalendarEvents = async (): Promise<
    GoogleCalendarEventType[] | undefined
  > => {
    try {
      const { accessToken } = await GoogleSignin.getTokens();
      if (!accessToken) {
        console.log('No access token available');
        return;
      }

      const response = await axios.get(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
          },
        }
      );

      console.log('Calendar events:', response.data.items);
      return response.data.items;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('Token expired, refreshing...');
        try {
          await GoogleSignin.signInSilently();
          // Retry fetching events after refreshing the token
          return getCalendarEvents();
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          // Handle refresh error (e.g., prompt user to sign in again)
        }
      }
    }
  };

  const authContextValue = useMemo(
    () => ({
      login,
      signup,
      signInWithGoogle,
      logout,
      getCalendarEvents,

      userPreferences,
      setUserPreferences,
    }),
    [userPreferences, gAuth().currentUser]
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
