import { Book } from './supabase/types';

const API_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b';

interface OpenLibraryResponse {
  docs: Array<{
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    isbn?: string[];
    cover_i?: number;
    description?: string;
  }>;
  numFound: number;
}

interface OpenLibraryBookDetails {
  key: string;
  title: string;
  authors?: Array<{ name: string }>;
  description?: { value?: string } | string;
  covers?: number[];
  publish_date?: string;
}

function getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'L') {
  return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`;
}

export async function searchBooks(
  query: string,
  options: {
    offset?: number;
    limit?: number;
    sort?: 'relevance' | 'rating' | 'year';
  } = {}
): Promise<{ books: Book[]; total: number }> {
  const {
    offset = 0,
    limit = 10,
    sort = 'relevance',
  } = options;

  const params = new URLSearchParams({
    q: query,
    offset: offset.toString(),
    limit: limit.toString(),
    mode: 'everything',
    has_fulltext: 'true',
    fields: 'key,title,author_name,first_publish_year,isbn,cover_i,description',
  });

  try {
    const response = await fetch(`${API_BASE_URL}/search.json?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch books from OpenLibrary API');
    }

    const data: OpenLibraryResponse = await response.json();

    const books: Book[] = data.docs.map(doc => ({
      id: doc.key.replace('/works/', ''),
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown Author',
      description: typeof doc.description === 'string' ? doc.description : undefined,
      cover_url: doc.cover_i ? getCoverUrl(doc.cover_i) : undefined,
      published_date: doc.first_publish_year?.toString(),
      info_link: `${API_BASE_URL}${doc.key}`,
    }));

    return {
      books,
      total: data.numFound,
    };
  } catch (error) {
    console.error('OpenLibrary API error:', error);
    throw new Error('Failed to search books');
  }
}

export async function getBookById(id: string): Promise<Book> {
  try {
    const response = await fetch(`${API_BASE_URL}/works/${id}.json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch book details from OpenLibrary API');
    }

    const data: OpenLibraryBookDetails = await response.json();

    return {
      id: data.key.replace('/works/', ''),
      title: data.title,
      author: data.authors?.[0]?.name || 'Unknown Author',
      description: typeof data.description === 'string' ? 
        data.description : 
        data.description?.value,
      cover_url: data.covers?.[0] ? getCoverUrl(data.covers[0]) : undefined,
      published_date: data.publish_date,
      info_link: `${API_BASE_URL}${data.key}`,
    };
  } catch (error) {
    console.error('OpenLibrary API error:', error);
    throw new Error('Failed to fetch book details');
  }
}

interface CoverPlaceholderOptions {
  darkMode?: boolean;
  width?: number;
  height?: number;
  text?: string;
}

export function getCoverPlaceholder({
  darkMode = false,
  width = 300,
  height = 450,
  text = 'No Cover Available'
}: CoverPlaceholderOptions = {}) {
  const bgColor = darkMode ? '2d3748' : 'f7fafc';
  const textColor = darkMode ? 'a0aec0' : '4a5568';
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}/png?text=${encodeURIComponent(text)}`;
}