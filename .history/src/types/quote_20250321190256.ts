import { Author } from './author';

export interface Quote {
  id: string;
  content: string;
  authorId: string;
  author: Author;
  source?: string;
  book?: {
    id: string;
    title: string;
    imageUrl?: string;
  };
  tags: string[];
  likes: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrendingQuote extends Quote {
  trendingScore: number;
  trendingSince: string;
}

export interface QuoteWithContext extends Quote {
  previousQuote?: Quote;
  nextQuote?: Quote;
  relatedQuotes?: Quote[];
}

export type QuoteSort = 'popular' | 'recent' | 'random';

export interface QuoteFilters {
  authorId?: string;
  bookId?: string;
  tags?: string[];
  source?: string;
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
}