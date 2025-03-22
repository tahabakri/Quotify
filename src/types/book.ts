import type { Author } from './author';
import type { WithId } from './index';

export interface Book extends WithId {
  title: string;
  author: Author;
  coverUrl?: string;
  category: BookCategory;
  description?: string;
  publishedYear?: number;
  quotesCount: number;
}

export type BookCategory = 
  | 'Philosophy'
  | 'Fiction'
  | 'Poetry'
  | 'Science'
  | 'History'
  | 'Self Help'
  | 'Biography'
  | 'Other';

export interface BookSort {
  field: 'title' | 'author' | 'quotesCount' | 'publishedYear';
  direction: 'asc' | 'desc';
}

export interface BookFilters {
  category?: BookCategory;
  authorId?: string;
  search?: string;
  yearRange?: [number, number];
}