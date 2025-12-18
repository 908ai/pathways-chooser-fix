"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Feedback } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatDistanceToNow } from 'date-fns';

export default function FeedbackManager() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeedback = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_feedback_with_user_details');

    if (error) {
      toast({
        title: 'Error fetching feedback',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setFeedbackList(data as Feedback[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
    
    const channel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedback' },
        (payload) => {
          console.log('Feedback change received!', payload);
          fetchFeedback();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedback_responses' },
        (payload) => {
          console.log('Feedback response change received!', payload);
          fetchFeedback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Resolved':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <div>Loading feedback...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submitted</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Unread</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbackList.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>
                  {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>{feedback.user_email}</TableCell>
                <TableCell>{feedback.category}</TableCell>
                <TableCell className="max-w-xs truncate">{feedback.feedback_text}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(feedback.status)}>{feedback.status}</Badge>
                </TableCell>
                <TableCell>
                  {feedback.unread_user_responses_count && feedback.unread_user_responses_count > 0 ? (
                    <Badge variant="destructive">{feedback.unread_user_responses_count}</Badge>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/admin/feedback/${feedback.id}`}>
                      View <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}