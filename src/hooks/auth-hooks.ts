import { useMutation, useQuery } from '@tanstack/react-query'
import { loginUser, signupUser, authorizeApp, getApps, logoutUser, type LoginRequest, type SignupRequest } from '@/services/api'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

export function useLogin() {
  const { setRefreshToken, setUser, setLoginResult } = useAuthStore()
  
  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: (result) => {
      if (result.status === 200 && result.data.result?.success) {
        const { user, refresh_token } = result?.data
        setRefreshToken(refresh_token)
        setUser(user)
        setLoginResult(result.data) // Store full login result
        toast.success('Giriş başarılı!')
      } else {
        toast.error(result.data.result?.message || 'Giriş başarısız')
      }
    },
    onError: (error) => {
      toast.error('Giriş sırasında bir hata oluştu')
      console.error('Login error:', error)
    }
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) => signupUser(data),
    onSuccess: (result) => {
      if (result.status === 200 && result.data.result?.success) {
        toast.success('Hesap oluşturuldu! Email adresinizi kontrol edin.')
      } else {
        toast.error(result.data.result?.message || 'Hesap oluşturulamadı')
      }
    },
    onError: (error) => {
      toast.error('Hesap oluşturma sırasında bir hata oluştu')
      console.error('Signup error:', error)
    }
  })
}

export function useAuthorize(app_key: string) {
  const { refresh_token } = useAuthStore()
  
  return useQuery({
    queryKey: ['authorize', app_key, refresh_token],
    queryFn: async () => {
      const result = await authorizeApp({ app_key })
      if (result.status === 200 && result.data.result?.success) {
        // Return the full response data, not just result.data
        return result.data
      }
      throw new Error(result.data.result?.message || 'Authorization failed')
    },
    enabled: !!refresh_token && !!app_key,
    retry: false
  })
}

export function useGetApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const result = await getApps()
      if (result.status === 200 && result.data.result?.success) {
        return result.data.apps
      }
      throw new Error(result.data.result?.message || 'Failed to fetch apps')
    },
    retry: false
  })
}

export function useLogout() {
  const { clearAuth } = useAuthStore()
  
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: (result) => {
      clearAuth()
      if (result.status === 200 && result.data.result?.success) {
        toast.success('Başarıyla çıkış yapıldı')
      } else {
        toast.success('Çıkış yapıldı') // Still clear auth even if server request failed
      }
      // Reload the page to reset all state
      setTimeout(() => {
        window.location.reload()
      }, 500)
    },
    onError: (error) => {
      // Even if the server request fails, we should still clear local auth
      clearAuth()
      toast.success('Çıkış yapıldı')
      console.error('Logout error:', error)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  })
}