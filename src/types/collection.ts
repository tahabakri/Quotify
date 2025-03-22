import { Quote } from './quote';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  curatorId: string;
  curator: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  isPublic: boolean;
  isFeatured: boolean;
  quotes: Quote[];
  quoteCount: number;
  followers: number;
  tags: string[];
  theme?: {
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CollectionWithStats extends Collection {
  topAuthors: {
    id: string;
    name: string;
    quotesCount: number;
  }[];
  topTags: {
    name: string;
    count: number;
  }[];
  recentActivity: {
    type: 'add' | 'remove' | 'reorder';
    quoteId: string;
    timestamp: string;
  }[];
}

export type CollectionSort = 
  | 'popular'
  | 'recent'
  | 'alphabetical'
  | 'quoteCount'
  | 'activityDate';

export interface CollectionFilters {
  curatorId?: string;
  tag?: string;
  isFeatured?: boolean;
  isPublic?: boolean;
  hasTheme?: boolean;
  minQuotes?: number;
}

export interface CollectionTheme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
  accentColor?: string;
  preview?: string;
}

export interface CollectionSettings {
  isPublic: boolean;
  allowComments: boolean;
  showCurator: boolean;
  theme?: CollectionTheme;
  sortOrder?: 'manual' | 'date' | 'author' | 'random';
}