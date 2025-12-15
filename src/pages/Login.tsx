import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (session) {
      const from = location.state?.from?.pathname || '/projects'
      navigate(from, { replace: true })
    }
  }, [session, navigate, location.state])

  // This effect will handle showing toast messages for password recovery
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Check your email",
          description: "A password recovery link has been sent to your email address.",
        })
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto flex justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Sign in to continue to Energy Navigator</CardDescription>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase as any}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
                theme="light"
                view="sign_in"
                redirectTo={`${window.location.origin}/`}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login