import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isResetMode = searchParams.get('mode') === 'reset';
  const [profileType, setProfileType] = useState('');
  const [activeTab, setActiveTab] = useState('signin');

  useEffect(() => {
    // This listener handles the session establishment after clicking the magic link.
    // The actual UI for password reset is handled by the `isResetMode` check.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // The user is now in a temporary session to update their password.
        // No navigation is needed here.
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Form submission - email:', email, 'password length:', password?.length);

    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      console.log('Sign in response:', { error });
      
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Sign in successful');
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully."
        });
        navigate('/');
      }
    } catch (err) {
      console.error('Sign in exception in component:', err);
      setError('An unexpected error occurred');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setIsLoading(true);
    setError('');

    if (!profileType) {
      setError('Please select a profile type.');
      toast({
        title: "Sign Up Failed",
        description: "Please select a profile type.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, profileType);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account."
      });
      setActiveTab('signin');
    }
    
    setIsLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?mode=reset`
    });

    if (error) {
      setError(error.message);
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Reset Email Sent!",
        description: "Check your email for password reset instructions."
      });
    }
    
    setIsLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Password Updated!",
        description: "Your password has been updated successfully."
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  if (isResetMode) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header variant="login" />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-white shadow-sm rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Set New Password</CardTitle>
              <CardDescription className="text-slate-500">Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    name="password"
                    type="password"
                    placeholder="Enter your new password"
                    required
                    minLength={6}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="login" />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl space-y-6">
          <Card className="bg-white shadow-sm rounded-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">Energy Navigator 9.36</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed pt-2 px-6">
                A specialized tool for energy professionals and building owners to navigate NBC 9.36 compliance pathways. Quickly determine the most cost-effective approach for your building project while ensuring regulatory compliance and optimizing energy performance outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-slate-500 mb-4">Sign in to your account</p>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="reset">Reset Password</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-type">Profile Type</Label>
                      <Select onValueChange={setProfileType} required>
                        <SelectTrigger id="profile-type">
                          <SelectValue placeholder="Select your profile type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="builder_contractor">Builder / Contractor</SelectItem>
                          <SelectItem value="building_official">Building Official (AHJ)</SelectItem>
                          <SelectItem value="energy_advisor">Energy Advisor / Modeler</SelectItem>
                          <SelectItem value="designer_architect">Designer / Architect</SelectItem>
                          <SelectItem value="homeowner">Homeowner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        required
                        minLength={6}
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="reset">
                  <form onSubmit={handlePasswordReset} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Reset Email'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;