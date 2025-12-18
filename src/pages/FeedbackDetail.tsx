"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, ArrowLeft } from 'lucide-react';
import { Json, FeedbackDetails } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { useUserRole } from '@/hooks/useUserRole';

export default function FeedbackDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { userRole: role } = useUserRole();
  const { toast } = useToast();
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchFeedbackDetails = async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase
      .rpc('get_feedback_details', { p_feedback_id: id });

    if (error) {
      toast({
        title: 'Error fetching feedback details',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setFeedbackDetails(data as FeedbackDetails);
    }
    setLoading(false);
  };

  const markAsRead = async () => {
    if (!id) return;
    const { error } = await supabase.rpc('mark_feedback_responses_as_read', { p_feedback_id: id });
    if (error) {
      console.error('Error marking responses as read:', error);
    }
  };

  useEffect(() => {
    fetchFeedbackDetails();
  }, [id]);

  useEffect(() => {
    if (feedbackDetails) {
      scrollToBottom();
      markAsRead();
    }
  }, [feedbackDetails]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`feedback-thread-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback_responses',
          filter: `feedback_id=eq.${id}`,
        },
        (payload) => {
          console.log('New response received!', payload);
          fetchFeedbackDetails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleResponseSubmit = async () => {
    if (!newResponse.trim() || !user || !id) return;
    setIsSubmitting(true);

    const { error } = await supabase.from('feedback_responses').insert({
      feedback_id: id,
      user_id: user.id,
      response_text: newResponse,
    });

    if (error) {
      toast({
        title: 'Error sending response',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setNewResponse('');
      // The realtime subscription will handle updating the UI
    }
    setIsSubmitting(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    const { error } = await supabase
      .from('feedback')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Status updated' });
      fetchFeedbackDetails();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!feedbackDetails) {
    return <div className="text-center py-10">Feedback not found.</div>;
  }

  const { feedback_responses = [] } = feedbackDetails;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link to={role === 'admin' ? "/admin/feedback" : "/my-feedback"} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Feedback List
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-2">Feedback Details</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Category: <Badge variant="secondary">{feedbackDetails.category}</Badge></span>
                <span>Status: <Badge>{feedbackDetails.status}</Badge></span>
              </div>
            </div>
            {role === 'admin' && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleStatusChange('In Progress')}>Set In Progress</Button>
                <Button size="sm" variant="outline" onClick={() => handleStatusChange('Resolved')}>Set Resolved</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 mb-6 bg-muted/20">
            <p className="font-semibold">Original Feedback:</p>
            <p className="text-muted-foreground">{feedbackDetails.feedback_text}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Submitted on {format(new Date(feedbackDetails.created_at), 'PPP p')}
            </p>
          </div>

          <div className="space-y-4 h-[400px] overflow-y-auto p-4 border rounded-lg">
            {feedback_responses.map((response) => (
              <div
                key={response.id}
                className={`flex flex-col ${response.user_id === user?.id ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-lg ${
                    response.user_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{response.response_text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {response.user_email} - {format(new Date(response.created_at), 'p')}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-start gap-4">
            <Textarea
              placeholder="Type your response..."
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="flex-1"
              rows={3}
            />
            <Button onClick={handleResponseSubmit} disabled={isSubmitting || !newResponse.trim()}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}