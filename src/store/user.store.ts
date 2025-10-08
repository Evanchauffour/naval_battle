import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  isVerified?: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface UserState {
  user: User | null

  setUser: (user: User) => void
  clearUser: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      // Actions
      setUser: (user: User) => {
        set({ user })
      },

      clearUser: () => {
        set({ user: null })
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user
      })
    }
  )
)

export const useUser = () => {
  const { user } = useUserStore()
  return { user }
}

export const useUserActions = () => {
  const { setUser, clearUser, updateUser } = useUserStore()
  return { setUser, clearUser, updateUser }
}
