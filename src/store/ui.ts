import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  isSearchOpen: boolean
  activeModal: string | null
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSearch: () => void
  openModal: (modalId: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      isSearchOpen: false,
      activeModal: null,
      setTheme: (theme) => set({ theme }),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      openModal: (modalId) => set({ activeModal: modalId }),
      closeModal: () => set({ activeModal: null }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme preference
    }
  )
)

// Theme utilities
export const useTheme = () => {
  const theme = useUIStore((state) => state.theme)
  const setTheme = useUIStore((state) => state.setTheme)

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  return { theme, setTheme, isDark }
}

// Modal utilities
export const useModal = (modalId: string) => {
  const activeModal = useUIStore((state) => state.activeModal)
  const openModal = useUIStore((state) => state.openModal)
  const closeModal = useUIStore((state) => state.closeModal)

  return {
    isOpen: activeModal === modalId,
    openModal: () => openModal(modalId),
    closeModal,
  }
}