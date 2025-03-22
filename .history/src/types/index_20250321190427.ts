// Quote types
export type { Quote, TrendingQuote, QuoteWithContext, QuoteSort, QuoteFilters } from './quote';

// Author types
export type { 
  Author, 
  AuthorWithStats, 
  AuthorSort, 
  AuthorFilters 
} from './author';

// Collection types
export type {
  Collection,
  CollectionWithStats,
  CollectionSort,
  CollectionFilters,
  CollectionTheme,
  CollectionSettings
} from './collection';

// Common types for components
export interface BaseProps {
  className?: string;
}

export interface WithChildren extends BaseProps {
  children: React.ReactNode;
}

export interface WithId {
  id: string;
}

// Response types for data fetching
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Common status types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T, E = ApiError> {
  data: T | null;
  error: E | null;
  status: Status;
}

// Common sorting and filtering
export interface SortOption<T = string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

export interface FilterOption<T = string> {
  label: string;
  value: T;
  count?: number;
  icon?: React.ReactNode;
  group?: string;
}

// Theme and styling
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface Theme {
  mode: ThemeMode;
  fontSize: FontSize;
  accentColor?: string;
  fontFamily?: string;
}