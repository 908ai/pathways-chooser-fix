import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const fetchMyFeedback = async (userId: string) => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const MyFeedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: feedbackList, isLoading, error } = useQuery({
    queryKey: ['myFeedback', user?.id],
    queryFn: () => fetchMyFeedback(user!.id),
    enabled: !!user,
  });

  const getStatusVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
      case 'New': return 'default';
      case 'In Progress': return 'secondary';
      case 'Resolved': return 'success';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Feedback</h1>
            <Button onClick={() => navigate('/#feedback')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit New Feedback
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Submitted Feedback</CardTitle>
              <CardDescription>Here is a list of all the feedback you have submitted.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
              {error && <p className="text-red-500">Error loading feedback: {error.message}</p>}
              {!isLoading && !error && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbackList?.map(feedback => (
                      <TableRow key={feedback.id}>
                        <TableCell>{format(new Date(feedback.created_at!), 'PPP')}</TableCell>
                        <TableCell>{feedback.category}</TableCell>
                        <TableCell className="max-w-sm truncate">{feedback.feedback_text}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(feedback.status)}>{feedback.status}</Badge></TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/feedback/${feedback.id}`}>View Details</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {!isLoading && feedbackList?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg font-semibold">No feedback submitted yet.</p>
                  <p className="text-muted-foreground">Click the button above to share your thoughts.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyFeedback;