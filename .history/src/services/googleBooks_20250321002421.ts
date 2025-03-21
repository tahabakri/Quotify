import { Book } from './supabase/types';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const DEFAULT_PAGE_SIZE = 24;

if (!API_KEY) {
  console.error('Google Books API key not found. Please set VITE_GOOGLE_BOOKS_API_KEY in your .env file');
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    console.log(`Attempting fetch (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})...`);
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.warn('Unexpected content type:', contentType);
    }
    
    return response.clone();
  } catch (error) {
    console.error('Fetch error:', error);
    
    if (retries > 0) {
      console.log(`Retrying request in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed after ${MAX_RETRIES} retries: ${errorMessage}`);
  }
}

interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
}

interface GoogleBookItem {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

interface GoogleBooksResponse {
  items?: GoogleBookItem[];
  totalItems: number;
}

export type SearchParams = {
  query?: string;
  filter?: string;
  genres?: string[];
  page?: number;
  pageSize?: number;
};

export interface SearchResult {
  books: Array<{
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    rating: number;
    publishYear?: number;
    description?: string;
    pageCount?: number;
    categories?: string[];
    ratingsCount?: number;
  }>;
  totalItems: number;
  hasMore: boolean;
}

class GoogleBooksService {
  private getHighQualityImageUrl(thumbnail?: string): string {
    if (!thumbnail) {
      console.log('No thumbnail provided, using placeholder');
      return 'https://placehold.co/300x450/png?text=No+Cover';
    }
    const highQualityUrl = thumbnail.replace('http:', 'https:').replace('zoom=1', 'zoom=2');
    console.log('Generated high quality image URL:', highQualityUrl);
    return highQualityUrl;
  }

  private buildTrendingQuery(): string {
    // Combine relevance with popularity signals
    return 'orderBy=relevance&langRestrict=en';
  }

  async searchBooks(params: SearchParams): Promise<SearchResult> {
    if (!API_KEY) {
      throw new Error('Google Books API key is not configured');
    }

    const { page = 0, pageSize = DEFAULT_PAGE_SIZE } = params;
    const startIndex = page * pageSize;
    
    const url = new URL(`${GOOGLE_BOOKS_API}/volumes`);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('maxResults', pageSize.toString());
    url.searchParams.append('startIndex', startIndex.toString());
    url.searchParams.append('printType', 'books');
    url.searchParams.append('projection', 'full');

    // Build search query based on filter
    if (params.filter === 'trending') {
      // For trending books, focus on popular and well-rated books
      url.searchParams.append('q', params.query || 'subject:fiction');
      url.searchParams.append('orderBy', 'relevance');
      url.searchParams.append('filter', 'paid-ebooks');
      url.searchParams.append('langRestrict', 'en');
    } else if (params.filter === 'latest') {
      url.searchParams.append('q', `${params.query || '*'} &orderBy=newest`);
    } else if (params.filter === 'genre' && params.genres?.length) {
      const genreQuery = params.genres.map(genre => `subject:${genre}`).join(' OR ');
      url.searchParams.append('q', params.query ? `${params.query} (${genreQuery})` : genreQuery);
    } else {
      url.searchParams.append('q', params.query || '*');
    }

    try {
      console.log('Fetching books from Google Books API:', url.toString());
      const response = await fetchWithRetry(url.toString());
      
      let data: GoogleBooksResponse;
      try {
        const textData = await response.text();
        console.log('Raw API response:', textData.substring(0, 200) + '...');
        data = JSON.parse(textData) as GoogleBooksResponse;
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        throw new Error('Invalid API response format');
      }
      
      if (!data) {
        console.warn('Empty response from Google Books API');
        return { books: [], totalItems: 0, hasMore: false };
      }
      
      if (!Array.isArray(data.items)) {
        console.warn('No books array in API response:', data);
        return { books: [], totalItems: data.totalItems, hasMore: false };
      }
      
      // Sort by popularity for trending results
      let books = data.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.[0] || 'Unknown Author',
        coverUrl: this.getHighQualityImageUrl(item.volumeInfo.imageLinks?.thumbnail),
        rating: item.volumeInfo.averageRating || 0,
        publishYear: item.volumeInfo.publishedDate ? 
          new Date(item.volumeInfo.publishedDate).getFullYear() : undefined,
        description: item.volumeInfo.description,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories,
        ratingsCount: item.volumeInfo.ratingsCount,
      }));

      // For trending, prioritize books with more ratings and better metadata
      if (params.filter === 'trending') {
        books = books
          .filter(book => book.ratingsCount || book.rating > 0) // Only books with some engagement
          .sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0)); // Sort by popularity
      }

      const hasMore = startIndex + books.length < data.totalItems;

      return {
        books,
        totalItems: data.totalItems,
        hasMore,
      };
    } catch (error) {
      console.error('Error fetching books from Google Books API:', error);
      throw error;
    }
  }

  async getBookDetails(bookId: string) {
    try {
      const response = await fetch(
        `${GOOGLE_BOOKS_API}/volumes/${bookId}?key=${API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch book details');
      
      const data: GoogleBookItem = await response.json();
      return {
        id: data.id,
        title: data.volumeInfo.title,
        author: data.volumeInfo.authors?.[0] || 'Unknown Author',
        coverUrl: this.getHighQualityImageUrl(data.volumeInfo.imageLinks?.thumbnail),
        rating: data.volumeInfo.averageRating || 0,
        publishYear: data.volumeInfo.publishedDate ? 
          new Date(data.volumeInfo.publishedDate).getFullYear() : undefined,
        description: data.volumeInfo.description,
        pageCount: data.volumeInfo.pageCount,
        categories: data.volumeInfo.categories,
        ratingsCount: data.volumeInfo.ratingsCount,
      };
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  }
}

export const googleBooksService = new GoogleBooksService();

export async function searchBooks(
  query: string,
  options: {
    offset?: number;
    limit?: number;
    orderBy?: 'relevance' | 'newest';
    langRestrict?: string;
  } = {}
): Promise<{ books: Book[]; total: number }> {
  const {
    offset = 0,
    limit = 10,
    orderBy = 'relevance',
    langRestrict = 'en'
  } = options;

  const params = new URLSearchParams({
    q: query,
    startIndex: offset.toString(),
    maxResults: limit.toString(),
    orderBy,
    langRestrict,
    key: API_KEY,
  });

  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}/volumes?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch books from Google Books API');
    }

    const data: GoogleBooksResponse = await response.json();

    const books: Book[] = (data.items || []).map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown Author',
      description: item.volumeInfo.description,
      cover_url: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
      preview_link: item.volumeInfo.previewLink,
      info_link: item.volumeInfo.infoLink,
      published_date: item.volumeInfo.publishedDate,
      average_rating: item.volumeInfo.averageRating,
      categories: item.volumeInfo.categories,
    }));

    return {
      books,
      total: data.totalItems || 0,
    };
  } catch (error) {
    console.error('Google Books API error:', error);
    throw new Error('Failed to search books');
  }
}

export async function getBookById(id: string): Promise<Book> {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}/volumes/${id}?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch book details from Google Books API');
    }

    const data = await response.json();
    const { volumeInfo } = data;

    return {
      id: data.id,
      title: volumeInfo.title,
      author: volumeInfo.authors?.[0] || 'Unknown Author',
      description: volumeInfo.description,
      cover_url: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
      preview_link: volumeInfo.previewLink,
      info_link: volumeInfo.infoLink,
      published_date: volumeInfo.publishedDate,
      average_rating: volumeInfo.averageRating,
      categories: volumeInfo.categories,
    };
  } catch (error) {
    console.error('Google Books API error:', error);
    throw new Error('Failed to fetch book details');
  }
}