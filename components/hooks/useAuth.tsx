import { auth } from '@/utils/firebase';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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
  signup: (username: string, password: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signup = async (username: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, username, password);
      const res = await signInWithEmailAndPassword(auth, username, password);
      setUser(res.user);
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
      console.log('user', res.user);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to signin User');
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
