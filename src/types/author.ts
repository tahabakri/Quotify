export interface Author {
  id: string;
  name: string;
  imageUrl?: string;
  bio?: string;
  notableWorks?: {
    id: string;
    title: string;
    year?: number;
    imageUrl?: string;
  }[];
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  genres?: string[];
  followers: number;
  quotesCount: number;
  worksCount: number;
  website?: string;
  wikipediaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorWithStats extends Author {
  mostQuotedWork?: {
    id: string;
    title: string;
    quotesCount: number;
  };
  topGenres: {
    name: string;
    count: number;
  }[];
  monthlyQuotes: {
    month: string;
    count: number;
  }[];
}

export type AuthorSort = 'popular' | 'name' | 'quotesCount' | 'recent';

export interface AuthorFilters {
  genre?: string;
  nationality?: string;
  era?: 'classical' | 'modern' | 'contemporary';
  isAlive?: boolean;
  hasImage?: boolean;
}