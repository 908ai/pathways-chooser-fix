import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';

interface FeedbackConversationProps {
  feedbackId: string;
  userEmail: string;
}

const fetchConversation = async (feedbackId: string) => {
  const { data: feedback, error: feedbackError } = await supabase
    .from('feedback')
    .select('*')
    .eq('id', feedbackId)
    .single();

  if (feedbackError) throw feedbackError;

  const { data: responses, error: responsesError } = await supabase
    .from('feedback_responses')
    .select('*')
    .eq('feedback_id', feedbackId)
    .order('created_at', { ascending: true });

  if (responsesError) throw responsesError;

  return { feedback, responses };
};

const responseSchema = z.object({
  response_text: z.string().min(1, "Response cannot be empty."),
});

const FeedbackConversation = ({ feedbackId, userEmail }: FeedbackConversationProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['feedbackConversation', feedbackId],
    queryFn: () => fetchConversation(feedbackId),
  });

  const form = useForm<z.infer<typeof responseSchema>>({
    resolver: zodResolver(responseSchema),
    defaultValues: { response_text: '' },
  });

  const addResponseMutation = useMutation({
    mutationFn: async (values: z.infer<typeof responseSchema>) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase.from('feedback_responses').insert({
        feedback_id: feedbackId,
        user_id: user.id,
        response_text: values.response_text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackConversation', feedbackId] });
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

  if (isLoading) return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4">Error loading conversation: {error.message}</div>;

  const { feedback, responses } = data;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Original Feedback</CardTitle>
          <CardDescription>From: {userEmail} on {new Date(feedback.created_at).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{feedback.feedback_text}</p>
        </CardContent>
      </Card>

      <div className="space-y-4 max-h-[40vh] overflow-y-auto p-2">
        {responses.map((response) => {
          const isAdminReply = response.user_id === user?.id;
          return (
            <div key={response.id} className={`flex items-start gap-3 ${isAdminReply ? 'justify-end' : ''}`}>
              {!isAdminReply && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userEmail.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[75%] rounded-lg p-3 ${isAdminReply ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="text-sm">{response.response_text}</p>
                <p className={`text-xs mt-1 text-right ${isAdminReply ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {new Date(response.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {isAdminReply && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>A</AvatarFallback>
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
  );
};

export default FeedbackConversation;