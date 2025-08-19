import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/store/auth';
import { clearOnLogout } from './useAuthClean'; // Assuming useAuthClean has clearOnLogout

interface AuthSessionContextType {
  isAuthenticated: boolean | null; // null means loading
  signIn: (token: string, refreshToken?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionContextType | undefined>(undefined);

export const AuthSessionProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const setZustandToken = useAuthStore((state) => state.setJWTToken);
  const clearZustandToken = useAuthStore((state) => state.clearJWTToken);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const token = await SecureStore.getItemAsync('JWTToken');
        if (token) {
          setZustandToken(token);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error('Failed to load tokens from SecureStore:', e);
        setIsAuthenticated(false);
      }
    };
    loadTokens();
  }, [setZustandToken]);

  const signIn = async (token: string, refreshToken?: string) => {
    await SecureStore.setItemAsync('JWTToken', token);
    setZustandToken(token);
    if (refreshToken) {
      await SecureStore.setItemAsync('JWTRefreshToken', refreshToken);
    }
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await clearOnLogout(); // Clears all relevant SecureStore and AsyncStorage items
    clearZustandToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthSessionContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => {
  const context = useContext(AuthSessionContext);
  if (context === undefined) {
    throw new Error('useAuthSession must be used within an AuthSessionProvider');
  }
  return context;
};
