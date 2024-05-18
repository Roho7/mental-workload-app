import { User } from 'firebase/auth';
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
  logout: () => void;
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {};

  const logout = () => {
    setUser(null);
  };

  const authContextValue = useMemo(
    () => ({
      user,
      login,
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
