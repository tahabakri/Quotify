import { create } from 'zustand';
import { searchQuotes, getQuotes } from '../api/quotes';
import { searchAuthors } from '../api/authors';
import type { QuotableQuote } from '../api/quotes';
import type { QuotableAuthor } from '../api/authors';

export type SearchType = 'quotes' | 'authors';

interface SearchState {
  query: string;
  searchType: SearchType;
  quoteResults: QuotableQuote[];
  authorResults: QuotableAuthor[];
  loading: boolean;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  error: string | null;
  setQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  search: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: '',
  searchType: 'quotes',
  quoteResults: [],
  authorResults: [],
  loading: false,
  hasMore: false,
  totalCount: 0,
  currentPage: 1,
  error: null,

  setQuery: (query) => set({ query }),

  setSearchType: (searchType) => set({ searchType, quoteResults: [], authorResults: [], currentPage: 1 }),

  search: async () => {
    const { query, searchType } = get();
    set({ loading: true, error: null, currentPage: 1 });

    try {
      if (searchType === 'quotes') {
        if (query.trim()) {
          const data = await searchQuotes(query, 1, 20);
          set({ quoteResults: data.quotes, hasMore: data.totalPages > 1, totalCount: data.totalCount });
        } else {
          const data = await getQuotes(1, 20);
          set({ quoteResults: data.quotes, hasMore: data.totalPages > 1, totalCount: data.totalCount });
        }
      } else {
        if (query.trim()) {
          const data = await searchAuthors(query, 1, 20);
          set({ authorResults: data.authors, hasMore: data.totalPages > 1, totalCount: data.totalCount });
        } else {
          const { getAuthors } = await import('../api/authors');
          const data = await getAuthors(1, 20);
          set({ authorResults: data.authors, hasMore: data.totalPages > 1, totalCount: data.totalCount });
        }
      }
    } catch {
      set({ error: 'Failed to search. Please try again.' });
    } finally {
      set({ loading: false });
    }
  },

  loadMore: async () => {
    const { hasMore, loading, query, searchType, currentPage } = get();
    if (!hasMore || loading) return;

    const nextPage = currentPage + 1;
    set({ loading: true });

    try {
      if (searchType === 'quotes') {
        const fetcher = query.trim() ? searchQuotes(query, nextPage, 20) : getQuotes(nextPage, 20);
        const data = await fetcher;
        set((state) => ({
          quoteResults: [...state.quoteResults, ...data.quotes],
          hasMore: data.totalPages > nextPage,
          currentPage: nextPage,
        }));
      } else {
        const { getAuthors } = await import('../api/authors');
        const fetcher = query.trim() ? searchAuthors(query, nextPage, 20) : getAuthors(nextPage, 20);
        const data = await fetcher;
        set((state) => ({
          authorResults: [...state.authorResults, ...data.authors],
          hasMore: data.totalPages > nextPage,
          currentPage: nextPage,
        }));
      }
    } catch {
      set({ error: 'Failed to load more results.' });
    } finally {
      set({ loading: false });
    }
  },

  clearResults: () => set({ quoteResults: [], authorResults: [], hasMore: false, error: null, currentPage: 1 }),
}));
