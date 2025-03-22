import { create } from 'zustand'
import { createClient, User as SupabaseUser } from '@supabase/supabase-js'
import { persist } from 'zustand/middleware'

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface User {
  id: string
  email?: string
  name?: string
  avatar_url?: string
}

const mapSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? undefined,
    name: supabaseUser.user_metadata.name,
    avatar_url: supabaseUser.user_metadata.avatar_url,
  }
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  session: any | null
  setUser: (user: User | null) => void
  setSession: (session: any) => void
  setError: (error: string | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setError: (error) => set({ error }),

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error
          set({
            user: data.user,
            session: data.session,
          })
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name }
            }
          })
          if (error) throw error
          set({
            user: data.user,
            session: data.session,
          })
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          set({ user: null, session: null })
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null })
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email)
          if (error) throw error
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null })
        try {
          const { user } = get()
          if (!user) throw new Error('No user logged in')

          const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', user.id)

          if (error) throw error
          set({ user: { ...user, ...data } })
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
)

// Auth utilities
export const useAuth = () => {
  const store = useAuthStore()
  return {
    user: store.user,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: !!store.user,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    resetPassword: store.resetPassword,
    updateProfile: store.updateProfile,
  }
}