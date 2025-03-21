import { createContext, useContext, useEffect, useState } from 'react';
import { UserPreferences, defaultPreferences } from '../types/preferences';
import { supabase } from '../services/supabase/client';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => Promise<void>;
  updateNestedPreference: <
    K extends keyof UserPreferences,
    NK extends keyof UserPreferences[K]
  >(
    key: K,
    nestedKey: NK,
    value: UserPreferences[K][NK]
  ) => Promise<void>;
  isLoading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(
  undefined
);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('preferences')
          .single();

        if (error) throw error;

        if (data) {
          setPreferences({
            ...defaultPreferences,
            ...data.preferences,
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, []);

  useEffect(() => {
    // Apply theme preference
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark =
      preferences.theme === 'dark' ||
      (preferences.theme === 'system' && prefersDark);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply font size preference
    root.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }[preferences.fontSize];
  }, [preferences.theme, preferences.fontSize]);

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    try {
      const newPreferences = {
        ...preferences,
        [key]: value,
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert({ preferences: newPreferences });

      if (error) throw error;

      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const updateNestedPreference = async <
    K extends keyof UserPreferences,
    NK extends keyof UserPreferences[K]
  >(
    key: K,
    nestedKey: NK,
    value: UserPreferences[K][NK]
  ) => {
    try {
      const newPreferences = {
        ...preferences,
        [key]: {
          ...(preferences[key] as object),
          [nestedKey]: value,
        },
      } as UserPreferences;

      const { error } = await supabase
        .from('user_preferences')
        .upsert({ preferences: newPreferences });

      if (error) throw error;

      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating nested preference:', error);
      throw error;
    }
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        updateNestedPreference,
        isLoading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}