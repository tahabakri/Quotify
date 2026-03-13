import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote } from '../types/quote';
import type { Collection } from '../types/collection';

interface CollectionsState {
  savedQuotes: Quote[];
  likedQuoteIds: string[];
  collections: Collection[];
  saveQuote: (quote: Quote) => void;
  unsaveQuote: (quoteId: string) => void;
  toggleLike: (quoteId: string) => void;
  isLiked: (quoteId: string) => boolean;
  isSaved: (quoteId: string) => boolean;
  createCollection: (name: string, description?: string) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, quote: Quote) => void;
  removeFromCollection: (collectionId: string, quoteId: string) => void;
  getCollection: (id: string) => Collection | undefined;
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      savedQuotes: [],
      likedQuoteIds: [],
      collections: [],

      saveQuote: (quote) =>
        set((state) => {
          if (state.savedQuotes.some((q) => q._id === quote._id)) return state;
          return { savedQuotes: [...state.savedQuotes, quote] };
        }),

      unsaveQuote: (quoteId) =>
        set((state) => ({
          savedQuotes: state.savedQuotes.filter((q) => q._id !== quoteId),
        })),

      toggleLike: (quoteId) =>
        set((state) => {
          const isLiked = state.likedQuoteIds.includes(quoteId);
          return {
            likedQuoteIds: isLiked
              ? state.likedQuoteIds.filter((id) => id !== quoteId)
              : [...state.likedQuoteIds, quoteId],
          };
        }),

      isLiked: (quoteId) => get().likedQuoteIds.includes(quoteId),

      isSaved: (quoteId) => get().savedQuotes.some((q) => q._id === quoteId),

      createCollection: (name, description) =>
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id: crypto.randomUUID(),
              name,
              description,
              quotes: [],
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),

      addToCollection: (collectionId, quote) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId && !c.quotes.some((q) => q._id === quote._id)
              ? { ...c, quotes: [...c.quotes, quote] }
              : c
          ),
        })),

      removeFromCollection: (collectionId, quoteId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, quotes: c.quotes.filter((q) => q._id !== quoteId) }
              : c
          ),
        })),

      getCollection: (id) => get().collections.find((c) => c.id === id),
    }),
    { name: 'quotify-collections' }
  )
);
