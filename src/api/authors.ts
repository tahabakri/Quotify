import type { QuotableQuote } from './quotes';

const BASE_URL = 'https://dummyjson.com/quotes';

export interface QuotableAuthor {
  _id: string;
  name: string;
  slug: string;
  bio: string;
  description: string;
  link: string;
  quoteCount: number;
  dateAdded: string;
  dateModified: string;
}

interface DummyJsonQuote {
  id: number;
  quote: string;
  author: string;
}

interface DummyJsonResponse {
  quotes: DummyJsonQuote[];
  total: number;
  skip: number;
  limit: number;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Cache all quotes for author derivation
let allQuotesCache: DummyJsonQuote[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getAllQuotes(): Promise<DummyJsonQuote[]> {
  if (allQuotesCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return allQuotesCache;
  }
  // Fetch all quotes (dummyjson has ~1454 quotes)
  const res = await fetch(`${BASE_URL}?limit=0`);
  if (!res.ok) throw new Error('Failed to fetch quotes');
  const data: DummyJsonResponse = await res.json();
  allQuotesCache = data.quotes;
  cacheTimestamp = Date.now();
  return allQuotesCache;
}

function buildAuthorMap(quotes: DummyJsonQuote[]): Map<string, { name: string; quotes: DummyJsonQuote[] }> {
  const map = new Map<string, { name: string; quotes: DummyJsonQuote[] }>();
  for (const q of quotes) {
    const slug = toSlug(q.author);
    const entry = map.get(slug);
    if (entry) {
      entry.quotes.push(q);
    } else {
      map.set(slug, { name: q.author, quotes: [q] });
    }
  }
  return map;
}

function authorFromEntry(slug: string, entry: { name: string; quotes: DummyJsonQuote[] }): QuotableAuthor {
  return {
    _id: slug,
    name: entry.name,
    slug,
    bio: `Author of ${entry.quotes.length} quote${entry.quotes.length > 1 ? 's' : ''} in our collection.`,
    description: entry.name,
    link: `https://en.wikipedia.org/wiki/${encodeURIComponent(entry.name.replace(/\s+/g, '_'))}`,
    quoteCount: entry.quotes.length,
    dateAdded: '2024-01-01',
    dateModified: '2024-01-01',
  };
}

export async function getAuthors(
  page = 1,
  limit = 20,
  sortBy: 'name' | 'quoteCount' | 'dateAdded' = 'quoteCount',
  order: 'asc' | 'desc' = 'desc'
): Promise<{ authors: QuotableAuthor[]; totalPages: number; totalCount: number }> {
  const quotes = await getAllQuotes();
  const map = buildAuthorMap(quotes);

  let authors = Array.from(map.entries()).map(([slug, entry]) => authorFromEntry(slug, entry));

  if (sortBy === 'name') {
    authors.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    authors.sort((a, b) => b.quoteCount - a.quoteCount);
  }
  if (order === 'asc') authors.reverse();

  const totalCount = authors.length;
  const totalPages = Math.ceil(totalCount / limit);
  const start = (page - 1) * limit;
  authors = authors.slice(start, start + limit);

  return { authors, totalPages, totalCount };
}

export async function getAuthorBySlug(slug: string): Promise<QuotableAuthor> {
  const quotes = await getAllQuotes();
  const map = buildAuthorMap(quotes);
  const entry = map.get(slug);
  if (!entry) throw new Error('Author not found');
  return authorFromEntry(slug, entry);
}

export async function searchAuthors(
  query: string,
  page = 1,
  limit = 20
): Promise<{ authors: QuotableAuthor[]; totalPages: number; totalCount: number }> {
  const quotes = await getAllQuotes();
  const map = buildAuthorMap(quotes);
  const lower = query.toLowerCase();

  let authors = Array.from(map.entries())
    .filter(([, entry]) => entry.name.toLowerCase().includes(lower))
    .map(([slug, entry]) => authorFromEntry(slug, entry));

  authors.sort((a, b) => b.quoteCount - a.quoteCount);

  const totalCount = authors.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const start = (page - 1) * limit;
  authors = authors.slice(start, start + limit);

  return { authors, totalPages, totalCount };
}

function mapDummyToQuotable(q: DummyJsonQuote): QuotableQuote {
  return {
    _id: String(q.id),
    content: q.quote,
    author: q.author,
    authorSlug: toSlug(q.author),
    tags: [],
    length: q.quote.length,
    dateAdded: '2024-01-01',
    dateModified: '2024-01-01',
  };
}

export async function getQuotesByAuthor(
  authorSlug: string,
  page = 1,
  limit = 20
): Promise<{ quotes: QuotableQuote[]; totalPages: number; totalCount: number }> {
  const allQuotes = await getAllQuotes();
  const authorQuotes = allQuotes
    .filter((q) => toSlug(q.author) === authorSlug)
    .map(mapDummyToQuotable);

  const totalCount = authorQuotes.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const start = (page - 1) * limit;
  const quotes = authorQuotes.slice(start, start + limit);

  return { quotes, totalPages, totalCount };
}
