export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  showNotifications: boolean;
  emailDigest: boolean;
  contentFilters: {
    includeExplicit: boolean;
    showAIGenerated: boolean;
    languageFilter: string[];
  };
  displayOptions: {
    showQuoteImages: boolean;
    showAuthorPhotos: boolean;
    compactView: boolean;
  };
}

export const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  showNotifications: true,
  emailDigest: false,
  contentFilters: {
    includeExplicit: false,
    showAIGenerated: true,
    languageFilter: ['en'],
  },
  displayOptions: {
    showQuoteImages: true,
    showAuthorPhotos: true,
    compactView: false,
  },
};