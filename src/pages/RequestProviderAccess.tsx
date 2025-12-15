import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

const fetchAccessRequest = async (userId: string) => {
  const { data, error } = await supabase
    .from('provider_access_requests')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

const RequestProviderAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: request, isLoading, error } = useQuery({
    queryKey: ['providerAccessRequest', user?.id],
    queryFn: () => fetchAccessRequest(user!.id),
    enabled: !!user,
  });

  const handleRequestAccess = async () => {
    if (!user) return;
    const { error } = await supabase.from('provider_access_requests').insert({ user_id: user.id });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Request Submitted', description: 'Your request for access has been submitted for review.' });
      queryClient.invalidateQueries({ queryKey: ['providerAccessRequest', user.id] });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    if (error) {
      return <p className="text-red-500">Error checking access status.</p>;
    }
    if (request?.status === 'approved') {
      return (
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="font-semibold">You have been approved!</p>
          <Button onClick={() => navigate('/find-a-provider')} className="mt-4">Go to Provider Directory</Button>
        </div>
      );
    }
    if (request?.status === 'pending') {
      return <p>Your access request is currently pending review. You will be notified once it has been processed.</p>;
    }
    if (request?.status === 'denied') {
      return <p>Your access request has been denied. Please contact support for more information.</p>;
    }
    return (
      <>
        <p>As a builder or energy advisor, you can request access to our directory of approved service providers.</p>
        <Button onClick={handleRequestAccess} className="mt-4 w-full">Request Access Now</Button>
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Provider Directory Access</CardTitle>
            <CardDescription>Join our network of professionals.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {renderContent()}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default RequestProviderAccess;