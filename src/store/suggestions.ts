import { create } from 'zustand';
import { searchQuotes } from '../api/quotes';
import { searchAuthors } from '../api/authors';

type SuggestionType = 'author' | 'quote' | 'recent';

interface SearchSuggestion {
  type: SuggestionType;
  text: string;
  id?: string;
  slug?: string;
}

interface SuggestionsState {
  suggestions: SearchSuggestion[];
  loading: boolean;
  error: string | null;
  selectedIndex: number;
  recentSearches: string[];
  fetchSuggestions: (query: string) => Promise<void>;
  setSelectedIndex: (index: number) => void;
  addRecentSearch: (query: string) => void;
  clearSuggestions: () => void;
}

let searchTimeout: ReturnType<typeof setTimeout>;

export const useSuggestionsStore = create<SuggestionsState>((set, get) => ({
  suggestions: [],
  loading: false,
  error: null,
  selectedIndex: -1,
  recentSearches: JSON.parse(localStorage.getItem('recent_searches') || '[]'),

  fetchSuggestions: async (query: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);

    if (!query) {
      set({ suggestions: [], loading: false, error: null });
      return;
    }

    searchTimeout = setTimeout(async () => {
      set({ loading: true, error: null });

      try {
        const [quotesData, authorsData] = await Promise.all([
          searchQuotes(query, 1, 3).catch(() => ({ quotes: [], totalPages: 0, totalCount: 0 })),
          searchAuthors(query, 1, 3).catch(() => ({ authors: [], totalPages: 0, totalCount: 0 })),
        ]);

        const { recentSearches } = get();

        const newSuggestions: SearchSuggestion[] = [
          ...recentSearches
            .filter((r) => r.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 2)
            .map((text) => ({ type: 'recent' as const, text })),
          ...quotesData.quotes.map((q) => ({
            type: 'quote' as const,
            text: q.content.length > 60 ? q.content.substring(0, 57) + '...' : q.content,
            id: q._id,
          })),
          ...authorsData.authors.map((a) => ({
            type: 'author' as const,
            text: a.name,
            id: a._id,
            slug: a.slug,
          })),
        ];

        set({ suggestions: newSuggestions, loading: false, selectedIndex: -1 });
      } catch {
        set({ error: 'Failed to fetch suggestions', suggestions: [], loading: false });
      }
    }, 300);
  },

  setSelectedIndex: (index) => set({ selectedIndex: index }),

  addRecentSearch: (query) =>
    set((state) => {
      const newSearches = [query, ...state.recentSearches.filter((s) => s !== query)].slice(0, 5);
      localStorage.setItem('recent_searches', JSON.stringify(newSearches));
      return { recentSearches: newSearches };
    }),

  clearSuggestions: () => set({ suggestions: [], selectedIndex: -1 }),
}));
