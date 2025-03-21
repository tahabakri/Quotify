export interface Quote {
  id: string;
  content: string;
  bookId: string;
  category?: string;
  likes: number;
  isAiGenerated: boolean;
  authorId: string;
  createdAt: string;
}

export interface TrendingQuote extends Quote {
  book: {
    title: string;
    coverUrl: string;
  };
  author: {
    name: string;
    imageUrl?: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  quotes: string[];
  coverImage?: string;
  curator: string;
  quoteCount: number;
}