import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserPreferences } from '../services/supabase/types';

interface User {
  id: string;
  email: string;
  name?: string;
  preferences?: UserPreferences;
}

interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Implement actual login logic here
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        preferences: {
          id: '1',
          user_id: '1',
          theme: 'light',
          default_visibility: 'public',
          email_notifications: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Implement actual logout logic here
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    if (!user) throw new Error('No user logged in');
    
    setLoading(true);
    try {
      // Implement actual preferences update logic here
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          preferences: {
            ...prev.preferences!,
            ...preferences,
            updated_at: new Date().toISOString()
          }
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        updatePreferences
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
}

export default UserContext;