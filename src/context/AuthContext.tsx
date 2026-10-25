import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types/user';
import {
  loginUser,
  logoutUser,
  registerUser,
  onAuthChange,
  AuthResponse,
} from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (email: string, pass: string, name: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    const res = await loginUser(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (
    email: string,
    pass: string,
    name: string
  ): Promise<AuthResponse> => {
    const res = await registerUser(email, pass, name);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
