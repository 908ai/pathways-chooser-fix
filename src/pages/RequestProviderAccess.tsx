import { useAuth } from '@/hooks/useAuth';
import { useProviderAccess } from '@/hooks/useProviderAccess';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const RequestProviderAccess = () => {
  const { user, signOut } = useAuth();
  const { data, refetch, isLoading: isAccessLoading } = useProviderAccess();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // If the hook finishes loading and determines the user has access, redirect them.
    if (!isAccessLoading && data?.hasAccess) {
      toast({
        title: 'Access Granted',
        description: 'Redirecting you to the provider directory.',
      });
      navigate('/find-a-provider');
    }
  }, [data, isAccessLoading, navigate, toast]);

  const handleRequestAccess = async () => {
    if (!user) return;
    setIsRequesting(true);
    try {
      const { error } = await supabase
        .from('provider_access_requests')
        .insert({ user_id: user.id, status: 'pending' });

      if (error) throw error;

      toast({
        title: 'Request Sent!',
        description: 'Your request for access has been submitted for approval.',
      });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit request.',
        variant: 'destructive',
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusContent = () => {
    if (isAccessLoading) {
      return {
        icon: <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />,
        title: 'Checking Access Status...',
        description: 'Please wait while we verify your access permissions.',
        button: <Button disabled>Loading...</Button>,
      };
    }

    if (data?.request?.status === 'pending') {
      return {
        icon: <Clock className="h-12 w-12 text-yellow-500 dark:text-yellow-400" />,
        title: 'Request Pending',
        description: 'Your request to access the service provider directory is currently pending approval. You will be notified once it has been reviewed.',
        button: <Button disabled>Request Pending</Button>,
      };
    }

    // This case should now be handled by the useEffect redirect, but it's a good fallback.
    if (data?.request?.status === 'approved') {
        return {
            icon: <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400" />,
            title: 'Access Approved!',
            description: 'Your request has been approved. You can now access the service provider directory.',
            button: <Button onClick={() => navigate('/find-a-provider')}>Go to Directory</Button>,
        };
    }

    return {
      icon: <ShieldCheck className="h-12 w-12 text-blue-500 dark:text-blue-400" />,
      title: 'Access the Service Provider Directory',
      description: 'Gain access to a curated list of trusted service providers, including energy advisors, HVAC contractors, and more. Access is granted upon admin approval.',
      button: <Button onClick={handleRequestAccess} disabled={isRequesting}>{isRequesting ? 'Sending...' : 'Request Access'}</Button>,
    };
  };

  const { icon, title, description, button } = getStatusContent();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <div className="mx-auto mb-4">{icon}</div>
            <CardTitle className="text-3xl text-card-foreground">{title}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              {button}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default RequestProviderAccess;