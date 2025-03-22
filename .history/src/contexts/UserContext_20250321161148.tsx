import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface UserPreferences {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  imageStyle: 'modern' | 'classic' | 'minimal';
  viewMode: 'grid';
}

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
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  toggleDarkMode: () => void;
}

const defaultPreferences: UserPreferences = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  fontSize: 'medium',
  imageStyle: 'modern',
  viewMode: 'grid',
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem('userPreferences');
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, darkMode: e.matches }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    document.documentElement.classList.toggle('dark', preferences.darkMode);
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[preferences.fontSize];
  }, [preferences]);

  const login = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement actual authentication
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        preferences: {
          darkMode: preferences.darkMode,
          fontSize: preferences.fontSize,
          imageStyle: preferences.imageStyle,
          viewMode: preferences.viewMode
        }
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [preferences]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement actual logout
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    if (!user) throw new Error('No user logged in');
    
    setLoading(true);
    try {
      // TODO: Implement actual preferences update
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          preferences: {
            ...prev.preferences!,
            ...newPreferences,
            updated_at: new Date().toISOString()
          }
        };
      });
      setPreferences(prev => ({ ...prev, ...newPreferences }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        updatePreferences,
        updatePreference,
        toggleDarkMode
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