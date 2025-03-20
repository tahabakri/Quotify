const OPEN_LIBRARY_API = 'https://openlibrary.org';
import type { SearchResult } from './googleBooks';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  ratings_average?: number;
  description?: string;
  editions_count?: number; // Number of editions indicates popularity
  has_fulltext?: boolean;
}

interface OpenLibraryResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}

export type SearchParams = {
  query?: string;
  filter?: string;
  genres?: string[];
  page?: number;
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 24;

class OpenLibraryService {
  private getCoverUrl(coverId: number | undefined): string {
    if (!coverId) return 'https://placehold.co/300x450/png?text=No+Cover';
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  }

  private buildSearchQuery({ query, filter, genres }: SearchParams): string {
    const parts: string[] = [];
    
    if (query) {
      parts.push(query);
    }

    // Add filters based on the selected option
    if (filter === 'latest') {
      const twoYearsAgo = new Date().getFullYear() - 2;
      parts.push(`publish_year:[${twoYearsAgo} TO *]`);
    }

    if (filter === 'trending') {
      // For trending books, prioritize:
      // 1. Books with high number of editions (popular)
      // 2. Books that are available in full text (more likely to be notable)
      parts.push('has_fulltext:true');
      // Will sort by editions_count in the results processing
    }

    if (filter === 'genre' && genres?.length) {
      const genreQuery = genres.map(genre => `subject:${genre}`).join(' OR ');
      if (genreQuery) {
        parts.push(`(${genreQuery})`);
      }
    }

    return parts.join(' ') || '*:*';
  }

  async searchBooks(params: SearchParams): Promise<SearchResult> {
    const { page = 0, pageSize = DEFAULT_PAGE_SIZE } = params;
    const searchQuery = this.buildSearchQuery(params);
    const url = new URL(`${OPEN_LIBRARY_API}/search.json`);
    
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('fields', 'key,title,author_name,first_publish_year,cover_i,ratings_average,description,editions_count,has_fulltext');
    url.searchParams.append('limit', (pageSize * 2).toString()); // Fetch more to filter
    url.searchParams.append('offset', (page * pageSize).toString());

    try {
      console.log('Fetching books from Open Library:', url.toString());
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch books from Open Library');
      
      const data: OpenLibraryResponse = await response.json();
      
      let books = data.docs.map(book => ({
        id: book.key.replace('/works/', ''),
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        coverUrl: this.getCoverUrl(book.cover_i),
        rating: book.ratings_average || 0,
        publishYear: book.first_publish_year,
        description: book.description,
        editionsCount: book.editions_count || 0,
      }));

      // For trending, prioritize books with more editions and available full text
      if (params.filter === 'trending') {
        books = books
          .sort((a, b) => b.editionsCount - a.editionsCount)
          .slice(0, pageSize); // Take only the top results after sorting
      }

      return {
        books,
        totalItems: data.numFound,
        hasMore: (page + 1) * pageSize < data.numFound,
      };
    } catch (error) {
      console.error('Error fetching books from Open Library:', error);
      throw error;
    }
  }

  async getBookDetails(workId: string) {
    try {
      const response = await fetch(`${OPEN_LIBRARY_API}/works/${workId}.json`);
      if (!response.ok) throw new Error('Failed to fetch book details');
      
      const data = await response.json();
      return {
        id: workId,
        title: data.title,
        author: data.authors?.[0]?.name || 'Unknown Author',
        coverUrl: this.getCoverUrl(data.covers?.[0]),
        rating: data.ratings_average || 0,
        publishYear: data.first_publish_year,
        description: data.description?.value || data.description,
        editionsCount: data.editions_count,
      };
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  }
}

export const openLibraryService = new OpenLibraryService();