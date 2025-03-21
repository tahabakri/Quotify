export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  cover_url?: string;
  publisher?: string;
  published_date?: string;
  page_count?: number;
  categories?: string[];
  language?: string;
  preview_link?: string;
  info_link?: string;
  average_rating?: number;
  ratings_count?: number;
  source: 'google_books' | 'open_library';
}

export interface Quote {
  id: string;
  content: string;
  book_title: string;
  author?: string;
  page_number?: number;
  chapter?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  book_id?: string;
  visibility: 'public' | 'private';
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
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  default_visibility: 'public' | 'private';
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedImageRecord {
  id: string;
  quote_id: string;
  image_url: string;
  background_type: string;
  created_at: string;
  metadata: {
    backgroundType: string;
    timestamp: string;
    quoteId: string;
    prompt?: string;
    mood?: string;
    style?: string;
    bookGenre?: string;
    customPrompt?: string;
  };
}

export type SearchResult = Quote | Book;