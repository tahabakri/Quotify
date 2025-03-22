import { create } from 'zustand'
import type { Quote, Book, SearchResult } from '../services/supabase/types'

export type SearchType = 'quotes' | 'books'

interface SearchFilters {
  authors?: string[]
  tags?: string[]
  genres?: string[]
  quickFilter?: string
  dateRange?: {
    start?: string
    end?: string
  }
}

interface SearchState {
  query: string
  filters: SearchFilters
  results: SearchResult[]
  loading: boolean
  hasMore: boolean
  error: Error | null
  searchType: SearchType
  setQuery: (query: string) => void
  setFilters: (filters: SearchFilters) => void
  setSearchType: (type: SearchType) => void
  search: () => Promise<void>
  loadMore: () => Promise<void>
  clearResults: () => void
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: '',
  filters: {},
  results: [],
  loading: false,
  hasMore: true,
  error: null,
  searchType: 'quotes',

  setQuery: (query) => set({ query }),
  
  setFilters: (filters) => set({ filters }),
  
  setSearchType: (searchType) => set({ searchType }),

  search: async () => {
    const { searchType } = get()
    set({ loading: true, error: null })
    
    try {
      // TODO: Implement actual search with API
      const mockResults: SearchResult[] = searchType === 'quotes' 
        ? [{
            id: '1',
            content: 'Sample quote text',
            book_title: 'Sample Book',
            author: 'Sample Author',
            user_id: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            visibility: 'public'
          } as Quote]
        : [{
            id: '1',
            title: 'Sample Book',
            author: 'Sample Author',
            description: 'A sample book description',
            cover_url: 'https://example.com/cover.jpg',
            published_date: '2025',
            average_rating: 4.5,
            source: 'google_books'
          } as Book]
      
      set({ results: mockResults, hasMore: false })
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Search failed') })
    } finally {
      set({ loading: false })
    }
  },

  loadMore: async () => {
    const { hasMore, loading } = get()
    if (!hasMore || loading) return

    set({ loading: true })
    try {
      // TODO: Implement pagination
      const mockMoreResults: SearchResult[] = []
      set((state) => ({
        results: [...state.results, ...mockMoreResults],
        hasMore: false
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to load more results') })
    } finally {
      set({ loading: false })
    }
  },

  clearResults: () => {
    set({
      results: [],
      hasMore: true,
      error: null
    })
  }
}))

// Selector hooks for better performance
export const useSearchQuery = () => useSearchStore((state) => state.query)
export const useSearchResults = () => useSearchStore((state) => state.results)
export const useSearchLoading = () => useSearchStore((state) => state.loading)
export const useSearchError = () => useSearchStore((state) => state.error)
export const useSearchType = () => useSearchStore((state) => state.searchType)
export const useSearchFilters = () => useSearchStore((state) => state.filters)

// Action hooks
export const useSearchActions = () => {
  const store = useSearchStore()
  return {
    setQuery: store.setQuery,
    setFilters: store.setFilters,
    setSearchType: store.setSearchType,
    search: store.search,
    loadMore: store.loadMore,
    clearResults: store.clearResults
  }
}