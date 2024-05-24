import { auth } from '@/utils/firebase';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import React, {
  createContext,
  ReactNode,
  useContext,
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
      console.log(email, username, password);
      const new_user = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(new_user.user, {
        displayName: username,
      });

      setUser(new_user.user);
      router.replace('/(protected)');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to login User');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, username, password);
      setUser(res.user);
      router.replace('/(protected)');
      toast.show('Successfully signed in.', { native: false });
    } catch (error) {
      toast.show('Error signing in.', { native: false });
    }
  };

  const logout = () => {
    console.log('logout');
    signOut(auth);
    setUser(null);
  };

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
