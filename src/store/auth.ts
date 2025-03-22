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

// UI Animation and Feedback States
type AnimationState = 'idle' | 'pending' | 'success' | 'error'
type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  type: NotificationType
  message: string
  id: string
  duration?: number
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
  animationState: AnimationState
  notifications: Notification[]
  setUser: (user: User | null) => void
  setSession: (session: any) => void
  setError: (error: string | null) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  dismissNotification: (id: string) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,
      animationState: 'idle',
      notifications: [],
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setError: (error) => set({ error }),
      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          { ...notification, id: generateId() }
        ]
      })),
      dismissNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      })),

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null, animationState: 'pending' })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error
          set({
            user: mapSupabaseUser(data.user),
            session: data.session,
            animationState: 'success'
          })
          get().addNotification({
            type: 'success',
            message: 'Successfully signed in!',
            duration: 3000,
          })
        } catch (error) {
          set({ 
            error: (error as Error).message,
            animationState: 'error'
          })
          get().addNotification({
            type: 'error',
            message: (error as Error).message,
            duration: 5000,
          })
        } finally {
          set({ isLoading: false })
          setTimeout(() => set({ animationState: 'idle' }), 1000)
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null, animationState: 'pending' })
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
            user: mapSupabaseUser(data.user),
            session: data.session,
            animationState: 'success'
          })
          get().addNotification({
            type: 'success',
            message: 'Account created successfully! Welcome aboard.',
            duration: 4000,
          })
        } catch (error) {
          set({ 
            error: (error as Error).message,
            animationState: 'error'
          })
          get().addNotification({
            type: 'error',
            message: (error as Error).message,
            duration: 5000,
          })
        } finally {
          set({ isLoading: false })
          setTimeout(() => set({ animationState: 'idle' }), 1000)
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null, animationState: 'pending' })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          set({ 
            user: null, 
            session: null,
            animationState: 'success'
          })
          get().addNotification({
            type: 'info',
            message: 'You have been signed out',
            duration: 3000,
          })
        } catch (error) {
          set({ 
            error: (error as Error).message,
            animationState: 'error'
          })
          get().addNotification({
            type: 'error',
            message: (error as Error).message,
            duration: 5000,
          })
        } finally {
          set({ isLoading: false })
          setTimeout(() => set({ animationState: 'idle' }), 1000)
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null, animationState: 'pending' })
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email)
          if (error) throw error
          set({ animationState: 'success' })
          get().addNotification({
            type: 'success',
            message: 'Password reset instructions sent to your email',
            duration: 5000,
          })
        } catch (error) {
          set({ 
            error: (error as Error).message,
            animationState: 'error'
          })
          get().addNotification({
            type: 'error',
            message: (error as Error).message,
            duration: 5000,
          })
        } finally {
          set({ isLoading: false })
          setTimeout(() => set({ animationState: 'idle' }), 1000)
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null, animationState: 'pending' })
        try {
          const { user } = get()
          if (!user) throw new Error('No user logged in')

          const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', user.id)

          if (error) throw error
          set({ 
            user: { ...user, ...data },
            animationState: 'success'
          })
          get().addNotification({
            type: 'success',
            message: 'Profile updated successfully',
            duration: 3000,
          })
        } catch (error) {
          set({ 
            error: (error as Error).message,
            animationState: 'error'
          })
          get().addNotification({
            type: 'error',
            message: (error as Error).message,
            duration: 5000,
          })
        } finally {
          set({ isLoading: false })
          setTimeout(() => set({ animationState: 'idle' }), 1000)
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
    animationState: store.animationState,
    notifications: store.notifications,
    addNotification: store.addNotification,
    dismissNotification: store.dismissNotification,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    resetPassword: store.resetPassword,
    updateProfile: store.updateProfile,
  }
}