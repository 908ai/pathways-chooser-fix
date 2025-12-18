"use client";

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackDetails } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

async function fetchFeedbackDetails(feedbackId: string): Promise<FeedbackDetails> {
  const { data, error } = await supabase
    .rpc('get_feedback_details', { p_feedback_id: feedbackId });

  if (error) {
    throw new Error(error.message);
  }
  return data as FeedbackDetails;
}

async function markResponsesAsRead(feedbackId: string) {
  const { error } = await supabase.rpc('mark_feedback_responses_as_read', { p_feedback_id: feedbackId });
  if (error) {
    console.error("Failed to mark as read:", error);
  }
}

export default function FeedbackDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { userRole } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newResponse, setNewResponse] = useState('');

  const { data: feedback, isLoading, error } = useQuery<FeedbackDetails>({
    queryKey: ['feedback', id],
    queryFn: async () => {
      if (!id) throw new Error("No feedback ID provided");
      const details = await fetchFeedbackDetails(id);
      if (details) {
        await markResponsesAsRead(id);
        queryClient.invalidateQueries({ queryKey: ['unread_notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unread_notifications_with_details'] });
        queryClient.invalidateQueries({ queryKey: ['all_feedback'] });
      }
      return details;
    },
    enabled: !!id,
  });

  const addResponseMutation = useMutation({
    mutationFn: async (responseText: string) => {
      if (!id || !user) throw new Error("Missing information");
      const { error } = await supabase.from('feedback_responses').insert({
        feedback_id: id,
        user_id: user.id,
        response_text: responseText,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', id] });
      setNewResponse('');
      toast({ title: "Response sent!" });
    },
    onError: (err: Error) => {
      toast({ title: "Error sending response", description: err.message, variant: 'destructive' });
    }
  });

  const handleAddResponse = () => {
    if (newResponse.trim()) {
      addResponseMutation.mutate(newResponse.trim());
    }
  };

  const getAvatarFallback = (email: string | null) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <p>Feedback not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link to={userRole === 'admin' ? "/admin?tab=feedback" : "/my-feedback"} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feedback List
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Details</CardTitle>
          <CardDescription>Category: {feedback.category} | Status: {feedback.status}</CardDescription>
          {feedback.page_url && <p className="text-sm text-muted-foreground">Page: {feedback.page_url}</p>}
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Original Feedback</h3>
            <p className="p-4 bg-muted rounded-md">{feedback.feedback_text}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Submitted on {format(new Date(feedback.created_at!), 'PPP p')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Conversation</h3>
            <div className="space-y-4">
              {feedback.feedback_responses?.map(response => (
                <div key={response.id} className={`flex items-start gap-4 ${response.user_id === user?.id ? 'justify-end' : ''}`}>
                  {response.user_id !== user?.id && (
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback>{getAvatarFallback(response.user_email)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-md p-3 rounded-lg ${response.user_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{response.response_text}</p>
                    <p className={`text-xs mt-1 ${response.user_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {response.user_email} - {format(new Date(response.created_at!), 'p')}
                    </p>
                  </div>
                  {response.user_id === user?.id && (
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback>{getAvatarFallback(response.user_email)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              placeholder="Type your response..."
              rows={3}
            />
            <Button onClick={handleAddResponse} disabled={addResponseMutation.isPending}>
              {addResponseMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send Response
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}