"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackWithUser } from '@/integrations/supabase/types';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, MessageSquare, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type FeedbackDto = Database['public']['Functions']['get_feedback_with_user_details']['Returns']

async function fetchFeedback(): Promise<FeedbackWithUser[]> {
  const { data, error } = await supabase.rpc('get_feedback_with_user_details');

  if (error) {
    console.error('Error fetching feedback:', error);
    throw new Error(error.message);
  }
  
  // The RPC function returns a JSON string, so we need to parse it.
  // The actual return type from rpc is `any`, so we cast it.
  const result = data as any as FeedbackWithUser[];

  return result.map(f => ({
    ...f,
    unread_user_responses_count: f.unread_user_responses_count || 0,
  }));
}

export default function FeedbackManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: feedback, isLoading, error, refetch } = useQuery<FeedbackWithUser[]>({
    queryKey: ['all_feedback'],
    queryFn: fetchFeedback,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_feedback'] });
      toast({
        title: 'Status Updated',
        description: 'The feedback status has been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (id: string, currentStatus: string) => {
    let nextStatus: string;
    switch (currentStatus) {
      case 'New':
        nextStatus = 'In Progress';
        break;
      case 'In Progress':
        nextStatus = 'Resolved';
        break;
      case 'Resolved':
        nextStatus = 'New'; // Or maybe 'Re-opened'
        break;
      default:
        nextStatus = 'New';
    }
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'New':
        return 'destructive';
      case 'In Progress':
        return 'secondary';
      case 'Resolved':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load feedback: {error.message}
        </AlertDescription>
      </Alert>
    );
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
              <TableHead>User</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.user_email || 'Anonymous'}</TableCell>
                <TableCell className="max-w-xs truncate">{item.feedback_text}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category}</Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(item.created_at!), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Button
                    variant={getStatusBadgeVariant(item.status)}
                    size="sm"
                    onClick={() => handleStatusChange(item.id, item.status)}
                    disabled={updateStatusMutation.isPending && updateStatusMutation.variables?.id === item.id}
                  >
                    {item.status}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/feedback/${item.id}`)}
                  >
                    View
                    {item.unread_user_responses_count > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {item.unread_user_responses_count}
                      </span>
                    )}
                    <ArrowRight className="ml-2 h-4 w-4" />
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