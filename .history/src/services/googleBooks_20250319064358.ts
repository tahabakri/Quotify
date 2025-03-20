const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

if (!API_KEY) {
  console.error('Google Books API key not found. Please set VITE_GOOGLE_BOOKS_API_KEY in your .env file');
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
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
};

class GoogleBooksService {
  private getHighQualityImageUrl(thumbnail?: string): string {
    if (!thumbnail) return 'https://via.placeholder.com/300x450?text=No+Cover';
    // Replace HTTP with HTTPS and get higher quality image
    return thumbnail.replace('http:', 'https:').replace('zoom=1', 'zoom=2');
  }

  private buildSearchQuery({ query, filter, genres }: SearchParams): string {
    let searchQuery = query || '';

    if (filter === 'latest') {
      // Sort by newest books
      searchQuery = `${searchQuery} &orderBy=newest`;
    }

    if (filter === 'genre' && genres?.length) {
      const genreQuery = genres.map(genre => `subject:${genre}`).join(' OR ');
      searchQuery = searchQuery ? `${searchQuery} (${genreQuery})` : genreQuery;
    }

    return searchQuery || '*';
  }

  async searchBooks(params: SearchParams) {
    if (!API_KEY) {
      throw new Error('Google Books API key is not configured');
    }

    const searchQuery = this.buildSearchQuery(params);
    const url = new URL(`${GOOGLE_BOOKS_API}/volumes`);
    
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('maxResults', '24');
    url.searchParams.append('printType', 'books');
    
    if (params.filter === 'trending') {
      url.searchParams.append('orderBy', 'relevance');
    }

    try {
      console.log('Fetching books from Google Books API:', url.toString());
      const response = await fetchWithRetry(url.toString());
      const data: GoogleBooksResponse = await response.json();
      
      if (!data || !Array.isArray(data.items)) {
        console.warn('No books found in Google Books API response:', data);
        return [];
      }
      
      return data.items.map(item => ({
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