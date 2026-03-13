export interface Author {
  _id: string;
  name: string;
  slug: string;
  bio: string;
  description: string;
  link: string;
  quoteCount: number;
  dateAdded?: string;
  dateModified?: string;
  imageUrl?: string;
}

export type AuthorSort = 'name' | 'quoteCount' | 'dateAdded';
