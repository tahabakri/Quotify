export type { Quote, QuoteSort, QuoteFilters } from './quote';
export type { Author, AuthorSort } from './author';
export type { Book } from './book';
export type { Collection } from './collection';
export type { UserPreferences } from './preferences';

export interface BaseProps {
  className?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type Status = 'idle' | 'loading' | 'success' | 'error';
