import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Inbox, ChevronRight } from 'lucide-react';

const fetchUserFeedback = async (userId: string | undefined) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('feedback')
    .select('*, feedback_responses(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const MyFeedbackPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: feedbackList, isLoading, error } = useQuery({
    queryKey: ['userFeedback', user?.id],
    queryFn: () => fetchUserFeedback(user?.id),
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <Badge variant="secondary">{status}</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
      case 'Resolved':
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground">My Feedback</h1>
          <p className="text-muted-foreground text-lg">
            Track the status of your feedback and view responses from our team.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Your Submissions
            </CardTitle>
            <CardDescription>
              Click on an item to view the full conversation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
            {error && <p className="text-red-500">Error loading feedback: {error.message}</p>}
            
            {!isLoading && feedbackList && feedbackList.length > 0 ? (
              <div className="space-y-3">
                {feedbackList.map((item) => (
                  <Link to={`/feedback/${item.id}`} key={item.id} className="block">
                    <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusBadge(item.status)}
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <p className="font-medium text-foreground line-clamp-2">{item.feedback_text}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                      <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                        <span>Submitted on {new Date(item.created_at).toLocaleDateString()}</span>
                        {item.feedback_responses[0].count > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {item.feedback_responses[0].count} {item.feedback_responses[0].count === 1 ? 'Reply' : 'Replies'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-12">
                  <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground">No Feedback Submitted</h3>
                  <p className="text-muted-foreground mt-2">
                    You haven't submitted any feedback yet.
                  </p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default MyFeedbackPage;