export interface Quote {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
  length: number;
  dateAdded: string;
  dateModified: string;
}

export type QuoteSort = 'popular' | 'recent' | 'random';

export interface QuoteFilters {
  tag?: string;
  author?: string;
  minLength?: number;
  maxLength?: number;
}
