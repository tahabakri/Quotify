const API_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b';

export interface OpenLibraryBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description?: string;
  publishedYear?: number;
  infoLink: string;
}

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

function getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'L'): string {
  return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`;
}

function getCoverPlaceholder(darkMode = false): string {
  const bgColor = darkMode ? '2d3748' : 'f7fafc';
  const textColor = darkMode ? 'a0aec0' : '4a5568';
  return `https://placehold.co/300x450/${bgColor}/${textColor}/png?text=${encodeURIComponent('No Cover')}`;
}

export async function searchBooks(
  query: string,
  page = 0,
  limit = 10
): Promise<{ books: OpenLibraryBook[]; hasMore: boolean; totalItems: number }> {
  const offset = page * limit;
  const searchParams = new URLSearchParams({
    q: query,
    offset: offset.toString(),
    limit: limit.toString(),
    fields: 'key,title,author_name,first_publish_year,cover_i,description',
  });

  const response = await fetch(`${API_BASE_URL}/search.json?${searchParams}`);
  if (!response.ok) throw new Error('Failed to search books');

  const data: OpenLibraryResponse = await response.json();

  const books: OpenLibraryBook[] = data.docs.map((doc) => ({
    id: doc.key.replace('/works/', ''),
    title: doc.title,
    author: doc.author_name?.[0] ?? 'Unknown Author',
    description: typeof doc.description === 'string' ? doc.description : undefined,
    publishedYear: doc.first_publish_year,
    coverUrl: doc.cover_i ? getCoverUrl(doc.cover_i) : getCoverPlaceholder(),
    infoLink: `${API_BASE_URL}${doc.key}`,
  }));

  return {
    books,
    hasMore: offset + limit < data.numFound,
    totalItems: data.numFound,
  };
}

export async function getBookById(id: string): Promise<OpenLibraryBook> {
  const response = await fetch(`${API_BASE_URL}/works/${id}.json`);
  if (!response.ok) throw new Error('Failed to fetch book details');

  const data: OpenLibraryBookDetails = await response.json();

  return {
    id: data.key.replace('/works/', ''),
    title: data.title,
    author: data.authors?.[0]?.name ?? 'Unknown Author',
    description:
      typeof data.description === 'string'
        ? data.description
        : data.description?.value,
    coverUrl: data.covers?.[0] ? getCoverUrl(data.covers[0]) : getCoverPlaceholder(),
    infoLink: `${API_BASE_URL}${data.key}`,
  };
}

export { getCoverPlaceholder };
