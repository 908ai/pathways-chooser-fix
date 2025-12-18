import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, ArrowLeft } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

interface FeedbackResponse {
  id: string;
  created_at: string;
  response_text: string;
  is_read: boolean;
  user_id: string;
  user_email: string;
}

interface Conversation {
  id: string;
  created_at: string;
  user_id: string;
  feedback_text: string;
  category: string;
  page_url: string;
  status: string;
  feedback_responses: FeedbackResponse[];
}

const fetchConversation = async (feedbackId: string | undefined): Promise<Conversation | null> => {
  if (!feedbackId) throw new Error("Feedback ID is required");

  const { data, error } = await supabase.rpc('get_feedback_details', { p_feedback_id: feedbackId });

  if (error) throw error;

  return data as unknown as Conversation | null;
};

const responseSchema = z.object({
  response_text: z.string().min(1, "Response cannot be empty."),
});

const FeedbackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversation, isLoading, error } = useQuery({
    queryKey: ['feedbackConversation', id],
    queryFn: () => fetchConversation(id),
    enabled: !!id,
  });

  useEffect(() => {
    const markAsRead = async () => {
      if (id) {
        const { error: rpcError } = await supabase
          .rpc('mark_feedback_responses_as_read', { p_feedback_id: id });
        
        if (rpcError) {
          console.error("Failed to mark messages as read:", rpcError);
        } else {
          queryClient.invalidateQueries({ queryKey: ['unread_notifications'] });
        }
      }
    };
    markAsRead();
  }, [id, queryClient]);

  const form = useForm<z.infer<typeof responseSchema>>({
    resolver: zodResolver(responseSchema),
    defaultValues: { response_text: '' },
  });

  const addResponseMutation = useMutation({
    mutationFn: async (values: z.infer<typeof responseSchema>) => {
      if (!user || !id) throw new Error("User not authenticated or feedback ID missing");
      const { error } = await supabase.from('feedback_responses').insert({
        feedback_id: id,
        user_id: user.id,
        response_text: values.response_text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackConversation', id] });
      form.reset();
      toast.success("Reply sent successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to send reply", { description: error.message });
    },
  });

  const onSubmit = (values: z.infer<typeof responseSchema>) => {
    addResponseMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/my-feedback">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Feedback
          </Link>
        </Button>

        {isLoading && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {error && <p className="text-red-500">Error loading conversation: {(error as Error).message}</p>}

        {conversation && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Category: {conversation.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4 max-h-[50vh] overflow-y-auto p-4 border rounded-lg">
                  {/* Original Feedback */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg p-3 bg-muted">
                      <p className="text-sm font-semibold">You</p>
                      <p className="text-sm">{conversation.feedback_text}</p>
                      <p className="text-xs mt-1 text-right text-muted-foreground">
                        {new Date(conversation.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {/* Responses */}
                  {conversation.feedback_responses.map((response: any) => {
                    const isUserReply = response.user_id === user?.id;
                    return (
                      <div key={response.id} className={`flex items-start gap-3 ${isUserReply ? 'justify-end' : ''}`}>
                        {!isUserReply && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{response.user_email?.substring(0, 1).toUpperCase() || 'A'}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[75%] rounded-lg p-3 ${isUserReply ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <p className="text-sm font-semibold">{isUserReply ? 'You' : response.user_email}</p>
                          <p className="text-sm">{response.response_text}</p>
                          <p className={`text-xs mt-1 text-right ${isUserReply ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {new Date(response.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {isUserReply && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 pt-4 border-t">
                    <FormField
                      control={form.control}
                      name="response_text"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Textarea
                              placeholder="Type your reply..."
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={addResponseMutation.isPending} size="icon">
                      {addResponseMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackDetail;