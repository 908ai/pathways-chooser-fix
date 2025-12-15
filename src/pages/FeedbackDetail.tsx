import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, ArrowLeft, User, Shield } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useUnreadFeedback } from '@/hooks/useUnreadFeedback';
import { Json } from '@/integrations/supabase/types';

interface FeedbackResponse {
  id: string;
  created_at: string;
  response_text: string;
  is_read: boolean;
  user_id: string;
  user_email: string;
}

interface FeedbackDetails {
  id: string;
  created_at: string;
  user_id: string;
  feedback_text: string;
  category: string;
  page_url: string | null;
  status: string;
  feedback_responses: FeedbackResponse[];
}

const fetchFeedbackDetails = async (id: string): Promise<FeedbackDetails> => {
  const { data, error } = await supabase.rpc('get_feedback_details', { p_feedback_id: id });
  if (error) throw new Error(error.message);
  return data as unknown as FeedbackDetails;
};

const FeedbackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newResponse, setNewResponse] = useState('');
  const { invalidate: invalidateUnreadCount } = useUnreadFeedback();

  const { data: feedback, isLoading, error } = useQuery({
    queryKey: ['feedbackDetail', id],
    queryFn: () => fetchFeedbackDetails(id!),
    enabled: !!id,
  });

  useEffect(() => {
    const markAsRead = async () => {
      if (feedback && user) {
        const unreadResponseIds = feedback.feedback_responses
          .filter(r => !r.is_read && r.user_id !== user.id)
          .map(r => r.id);

        if (unreadResponseIds.length > 0) {
          const { error } = await supabase.rpc('mark_feedback_responses_as_read', {
            p_response_ids: unreadResponseIds
          });

          if (error) {
            console.error('Failed to mark responses as read:', error);
          } else {
            queryClient.invalidateQueries({ queryKey: ['feedbackDetail', id] });
            invalidateUnreadCount();
          }
        }
      }
    };
    markAsRead();
  }, [feedback, user, id, queryClient, invalidateUnreadCount]);

  const handleAddResponse = async () => {
    if (!newResponse.trim() || !user || !id) return;
    const { error } = await supabase.from('feedback_responses').insert({
      feedback_id: id,
      user_id: user.id,
      response_text: newResponse.trim(),
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setNewResponse('');
      queryClient.invalidateQueries({ queryKey: ['feedbackDetail', id] });
      toast({ title: 'Success', description: 'Your response has been added.' });
    }
  };

  const getStatusVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
      case 'New': return 'default';
      case 'In Progress': return 'secondary';
      case 'Resolved': return 'success';
      default: return 'outline';
    }
  };

  const getInitials = (email: string) => email.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to={isAdmin ? "/admin" : "/my-feedback"}><ArrowLeft className="mr-2 h-4 w-4" /> Back to List</Link>
          </Button>
          {isLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {feedback && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {feedback.feedback_responses.map(response => {
                        const isAuthor = response.user_id === user?.id;
                        const isResponseAdmin = response.user_id !== feedback.user_id; // A simple way to check if it's an admin response
                        return (
                          <div key={response.id} className={`flex items-start gap-4 ${isAuthor ? 'justify-end' : ''}`}>
                            {!isAuthor && (
                              <Avatar className="h-8 w-8 border">
                                <AvatarFallback>{isResponseAdmin ? <Shield size={18} /> : getInitials(response.user_email)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`flex flex-col gap-1 ${isAuthor ? 'items-end' : 'items-start'}`}>
                              <div className={`max-w-md rounded-lg px-3 py-2 ${isAuthor ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm">{response.response_text}</p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <span>{response.user_email}</span>
                                <span title={format(new Date(response.created_at), 'PPpp')}>{' · '}{formatDistanceToNow(new Date(response.created_at), { addSuffix: true })}</span>
                              </div>
                            </div>
                            {isAuthor && (
                              <Avatar className="h-8 w-8 border">
                                <AvatarFallback>{isAdmin ? <Shield size={18} /> : getInitials(response.user_email)}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex w-full items-start space-x-4 pt-4 border-t">
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback>{user ? (isAdmin ? <Shield size={20} /> : getInitials(user.email || '')) : <User />}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea value={newResponse} onChange={e => setNewResponse(e.target.value)} placeholder="Type your response..." />
                        <Button onClick={handleAddResponse} disabled={!newResponse.trim()} className="mt-2">
                          <Send className="mr-2 h-4 w-4" /> Send Response
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback Details</CardTitle>
                    <CardDescription>Submitted on {format(new Date(feedback.created_at), 'PPP')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Status</span>
                      <Badge variant={getStatusVariant(feedback.status)}>{feedback.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Category</span>
                      <span>{feedback.category}</span>
                    </div>
                    {feedback.page_url && (
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Page</span>
                        <a href={feedback.page_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px]">{feedback.page_url}</a>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-muted-foreground">Feedback</span>
                      <p className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">{feedback.feedback_text}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackDetail;