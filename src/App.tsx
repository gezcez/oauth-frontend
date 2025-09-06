import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { AppSelector } from '@/components/app-selector'
import { useAuthStore } from '@/stores/auth-store'
import { useAuthorize } from '@/hooks/auth-hooks'
import { Loader2 } from 'lucide-react'

export  default function App() {
  const [searchParams] = useSearchParams()
  const app_key = searchParams.get('app')
  const redirect_uri = searchParams.get('redirect_uri')
  const [selectedApp, setSelectedApp] = useState<string | null>(app_key)
  
  const { isAuthenticated, refresh_token } = useAuthStore()
  const isAuth = isAuthenticated()
  
  // Only start authorization if we have both auth and app_key
  const shouldAuthorize = isAuth && selectedApp
  const { data: authorizeData, isLoading: isAuthorizing } = useAuthorize(selectedApp || '')
  
  useEffect(() => {
    if (shouldAuthorize && refresh_token && authorizeData) {
      // The backend already provides a complete redirect_uri with token included
      const responseRedirectUri = authorizeData?.redirect_uri
      
      if (responseRedirectUri) {
        // Use the redirect_uri from the response as it already has the token
        setTimeout(() => {
          window.location.href = responseRedirectUri
        }, 1000)
      } else {
        // Fallback: build redirect URL manually
        const baseUrl = redirect_uri || `${window.location.origin}/success`
        const finalUrl = `${baseUrl}?_=${refresh_token}&app=${selectedApp}`
        
        setTimeout(() => {
          window.location.href = finalUrl
        }, 1000)
      }
    }
  }, [shouldAuthorize, refresh_token, authorizeData, redirect_uri, selectedApp])

  // Show loading screen if user is authenticated and we're authorizing
  if (shouldAuthorize && isAuthorizing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-center text-muted-foreground">
              Yetkilendirme kontrol ediliyor...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading screen when app is selected but authorization hasn't started yet
  if (isAuth && selectedApp && !authorizeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-center text-muted-foreground">
              Yetkilendirme başlatılıyor...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show app selector if user is authenticated but no app is selected
  if (isAuth && !selectedApp) {
    return (
      <>
        <AppSelector onAppSelect={setSelectedApp} />
        <Toaster />
      </>
    )
  }

  // Show login/signup forms only if not authenticated AND no app is selected
  if (!isAuth) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Gezcez</CardTitle>
              <CardDescription>
                {selectedApp === 'dashboard' 
                  ? 'Dashboard\'a giriş yapın' 
                  : selectedApp
                  ? `${selectedApp} uygulamasına giriş yapın`
                  : 'Giriş yapın'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                  <TabsTrigger value="signup">Kaydol</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <LoginForm />
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <SignupForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </>
    )
  }

  // Fallback loading state (should rarely be seen)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-center text-muted-foreground">
            Yükleniyor...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
