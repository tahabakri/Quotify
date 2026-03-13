const BASE_URL = 'https://dummyjson.com/quotes';

export interface QuotableQuote {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
  length: number;
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

// Cache all quotes for search (dummyjson has no server-side search for quotes)
let allQuotesCache: DummyJsonQuote[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getAllQuotes(): Promise<DummyJsonQuote[]> {
  if (allQuotesCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return allQuotesCache;
  }
  const res = await fetch(`${BASE_URL}?limit=0`);
  if (!res.ok) throw new Error('Failed to fetch quotes');
  const data: DummyJsonResponse = await res.json();
  allQuotesCache = data.quotes;
  cacheTimestamp = Date.now();
  return allQuotesCache;
}

export async function getQuotes(
  page = 1,
  limit = 20
): Promise<{ quotes: QuotableQuote[]; totalPages: number; totalCount: number }> {
  const skip = (page - 1) * limit;
  const res = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error('Failed to fetch quotes');
  const data: DummyJsonResponse = await res.json();
  return {
    quotes: data.quotes.map(mapDummyToQuotable),
    totalPages: Math.ceil(data.total / limit),
    totalCount: data.total,
  };
}

export async function getRandomQuote(): Promise<QuotableQuote> {
  const res = await fetch(`${BASE_URL}/random`);
  if (!res.ok) throw new Error('Failed to fetch random quote');
  const data: DummyJsonQuote = await res.json();
  return mapDummyToQuotable(data);
}

export async function getRandomQuotes(count = 5): Promise<QuotableQuote[]> {
  const skip = Math.floor(Math.random() * 100);
  const res = await fetch(`${BASE_URL}?limit=${count}&skip=${skip}`);
  if (!res.ok) throw new Error('Failed to fetch random quotes');
  const data: DummyJsonResponse = await res.json();
  return data.quotes.map(mapDummyToQuotable);
}

export async function searchQuotes(
  query: string,
  page = 1,
  limit = 20
): Promise<{ quotes: QuotableQuote[]; totalPages: number; totalCount: number }> {
  const all = await getAllQuotes();
  const lower = query.toLowerCase();
  const filtered = all.filter(
    (q) => q.quote.toLowerCase().includes(lower) || q.author.toLowerCase().includes(lower)
  );
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const start = (page - 1) * limit;
  const quotes = filtered.slice(start, start + limit).map(mapDummyToQuotable);
  return { quotes, totalPages, totalCount };
}
