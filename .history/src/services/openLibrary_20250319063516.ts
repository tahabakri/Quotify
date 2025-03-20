const OPEN_LIBRARY_API = 'https://openlibrary.org';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publish_year?: number[];
  cover_i?: number;
  ratings_average?: number;
  description?: string;
  number_of_pages_median?: number;
  subject?: string[];
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
};

class OpenLibraryService {
  private getCoverUrl(coverId: number | undefined): string {
    if (!coverId) return 'https://via.placeholder.com/300x450?text=No+Cover';
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  }

  private buildSearchQuery({ query, filter, genres }: SearchParams): string {
    let searchQuery = query || '';

    if (filter === 'latest') {
      // Sort by publish date, last 2 years
      const twoYearsAgo = new Date().getFullYear() - 2;
      searchQuery += ` publish_year:[${twoYearsAgo} TO *]`;
    }

    if (filter === 'genre' && genres?.length) {
      const genreQuery = genres.map(genre => `subject:${genre}`).join(' OR ');
      searchQuery = searchQuery ? `${searchQuery} (${genreQuery})` : genreQuery;
    }

    // If no specific query, filter, or genres, default to popular books
    if (!searchQuery && filter === 'trending') {
      searchQuery = 'popular:true';
    }

    return searchQuery || '*:*'; // Return all if no query
  }

  async searchBooks(params: SearchParams) {
    const searchQuery = this.buildSearchQuery(params);
    const url = new URL(`${OPEN_LIBRARY_API}/search.json`);
    
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('fields', 'key,title,author_name,first_publish_year,cover_i,ratings_average,description,number_of_pages_median,subject');
    url.searchParams.append('limit', '24');

    try {
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch books from Open Library');
      
      const data: OpenLibraryResponse = await response.json();
      
      return data.docs.map(book => ({
        id: book.key.replace('/works/', ''),
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        coverUrl: this.getCoverUrl(book.cover_i),
        rating: book.ratings_average || Math.random() * 2 + 3, // Use rating if available, otherwise random between 3-5
        publishYear: book.first_publish_year,
        description: book.description,
        pageCount: book.number_of_pages_median,
        categories: book.subject?.slice(0, 5) || [],
      }));
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
      };
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const openLibraryService = new OpenLibraryService();