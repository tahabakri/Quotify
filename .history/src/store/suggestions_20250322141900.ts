import { create } from 'zustand'
import { supabase } from '../services/supabase/client'

type SuggestionType = 'author' | 'book' | 'quote' | 'recent' | 'trending'

interface SearchSuggestion {
  type: SuggestionType
  text: string
  id?: string
}

interface SuggestionsState {
  suggestions: SearchSuggestion[]
  loading: boolean
  error: string | null
  selectedIndex: number
  recentSearches: string[]
  // Actions
  fetchSuggestions: (query: string) => Promise<void>
  setSelectedIndex: (index: number) => void
  addRecentSearch: (query: string) => void
  clearSuggestions: () => void
}

let searchTimeout: NodeJS.Timeout

export const useSuggestionsStore = create<SuggestionsState>((set, get) => ({
  suggestions: [],
  loading: false,
  error: null,
  selectedIndex: -1,
  recentSearches: JSON.parse(localStorage.getItem('recent_searches') || '[]'),

  fetchSuggestions: async (query: string) => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (!query) {
      set({ suggestions: [], loading: false, error: null })
      return
    }

    // Debounce the search
    searchTimeout = setTimeout(async () => {
      set({ loading: true, error: null })

      try {
        // Search in quotes
        const { data: quotes, error: quotesError } = await supabase
          .from('quotes')
          .select('id, content')
          .ilike('content', `%${query}%`)
          .limit(3)

        if (quotesError) throw quotesError

        // Search in books
        const { data: books, error: booksError } = await supabase
          .from('books')
          .select('id, title')
          .ilike('title', `%${query}%`)
          .limit(3)

        if (booksError) throw booksError

        // Search in authors
        const { data: authors, error: authorsError } = await supabase
          .from('authors')
          .select('id, name')
          .ilike('name', `%${query}%`)
          .limit(3)

        if (authorsError) throw authorsError

        // Get recent searches from state
        const { recentSearches } = get()

        // Combine all suggestions
        const newSuggestions: SearchSuggestion[] = [
          // Recent searches first
          ...recentSearches
            .filter(recent => recent.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 2)
            .map(text => ({ type: 'recent' as const, text })),
          
          // Then quotes
          ...(quotes || []).map(quote => ({
            type: 'quote' as const,
            text: quote.content.length > 60 
              ? quote.content.substring(0, 57) + '...' 
              : quote.content,
            id: quote.id
          })),
          
          // Then authors
          ...(authors || []).map(author => ({
            type: 'author' as const,
            text: author.name,
            id: author.id
          })),
          
          // Finally books
          ...(books || []).map(book => ({
            type: 'book' as const,
            text: book.title,
            id: book.id
          }))
        ]

        set({ suggestions: newSuggestions, loading: false, selectedIndex: -1 })
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Failed to fetch suggestions',
          suggestions: [],
          loading: false
        })
      }
    }, 300)
  },

  setSelectedIndex: (index) => set({ selectedIndex: index }),

  addRecentSearch: (query) => {
    set(state => {
      const newSearches = [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 5)
      localStorage.setItem('recent_searches', JSON.stringify(newSearches))
      return { recentSearches: newSearches }
    })
  },

  clearSuggestions: () => set({ suggestions: [], selectedIndex: -1 })
}))

// Selector hooks
export const useSuggestions = () => useSuggestionsStore(state => state.suggestions)
export const useSuggestionsLoading = () => useSuggestionsStore(state => state.loading)
export const useSuggestionsError = () => useSuggestionsStore(state => state.error)
export const useSelectedIndex = () => useSuggestionsStore(state => state.selectedIndex)
export const useRecentSearches = () => useSuggestionsStore(state => state.recentSearches)

// Actions hook
export const useSuggestionsActions = () => {
  const store = useSuggestionsStore()
  return {
    fetchSuggestions: store.fetchSuggestions,
    setSelectedIndex: store.setSelectedIndex,
    addRecentSearch: store.addRecentSearch,
    clearSuggestions: store.clearSuggestions
  }
}