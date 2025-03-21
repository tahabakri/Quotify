export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover_url?: string | null;
  preview_link?: string;
  info_link?: string;
  published_date?: string;
  average_rating?: number;
  categories?: string[];
}

export interface Quote {
  id: string;
  content: string;
  author: string;
  book_title?: string;
  book_id?: string;
  tags?: string[];
  liked?: boolean;
  theme?: 'light' | 'dark';
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    tags?: string[];
    authors?: string[];
    books?: string[];
    dateRange?: {
      start?: string;
      end?: string;
    };
  };
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  imageStyle: 'modern' | 'classic' | 'minimal';
}

export interface GeneratedImage {
  id: string;
  quote_id: string;
  image_url: string;
  background_type: string;
  theme: 'light' | 'dark';
  style: string;
  created_at: string;
  metadata: {
    width: number;
    height: number;
    prompt: string;
    userPreferences: {
      theme: 'light' | 'dark';
      timestamp: string;
    };
  };
}

export interface DatabaseUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string;
}

export type SearchResult = Book | Quote;