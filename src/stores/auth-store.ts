import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setCookie, getCookie, deleteCookie } from '@/lib/utils'

interface AuthStore {
  refresh_token: string | undefined
  access_token: string | undefined
  user: any | undefined
  loginResult: any | undefined // Store full login response
  setRefreshToken: (token: string) => void
  setAccessToken: (token: string) => void
  setUser: (user: any) => void
  setLoginResult: (result: any) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      refresh_token: undefined,
      access_token: undefined,
      user: undefined,
      loginResult: undefined,
      
      setRefreshToken: (token: string) => {
        set({ refresh_token: token })
        setCookie("refresh_token", token, 15) // 15 days
      },
      
      setAccessToken: (token: string) => {
        set({ access_token: token })
      },
      
      setUser: (user: any) => {
        set({ user })
      },
      
      setLoginResult: (result: any) => {
        set({ loginResult: result })
      },
      
      clearAuth: () => {
        set({ 
          refresh_token: undefined, 
          access_token: undefined, 
          user: undefined,
          loginResult: undefined
        })
        deleteCookie("refresh_token")
      },
      
      isAuthenticated: () => {
        const state = get()
        return !!(state.refresh_token && state.user)
      }
    }),
    {
      name: 'gezcez-oauth-storage',
    }
  )
)