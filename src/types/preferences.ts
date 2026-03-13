export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
}

export const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
};
