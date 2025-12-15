import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Trash2, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeedbackConversation from './FeedbackConversation';

const fetchFeedback = async () => {
  const { data, error } = await supabase.rpc('get_feedback_with_user_details');
  if (error) throw new Error(error.message);
  return data;
};

const FeedbackManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

  const { data: feedback, isLoading, error } = useQuery({
    queryKey: ['all_feedback'],
    queryFn: fetchFeedback,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ feedbackId, status }: { feedbackId: string; status: string }) => {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', feedbackId);
      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['all_feedback'] });
      queryClient.invalidateQueries({ queryKey: ['unread_notifications'] });

      // Suppress toast for automatic "New" -> "In Progress" update on opening a conversation
      const isAutomaticUpdate = selectedFeedback?.id === variables.feedbackId && variables.status === 'In Progress';
      
      if (!isAutomaticUpdate) {
        toast({ title: 'Success', description: 'Feedback status updated.' });
      }
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to update status: ${error.message}`, variant: 'destructive' });
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: async (feedbackId: string) => {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_feedback'] });
      toast({ title: 'Success', description: 'Feedback entry deleted.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to delete feedback: ${error.message}`, variant: 'destructive' });
    },
  });

  // Automatically update status from "New" to "In Progress" when conversation is opened
  useEffect(() => {
    if (selectedFeedback && selectedFeedback.status === 'New') {
      updateStatusMutation.mutate({ feedbackId: selectedFeedback.id, status: 'In Progress' });
    }
  }, [selectedFeedback]);

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

  if (isLoading) return <div>Loading feedback...</div>;
  if (error) return <div className="text-red-500">Error loading feedback: {error.message}</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
          <CardDescription>Review and manage user-submitted feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[40%]">Feedback</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback && feedback.length > 0 ? feedback.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.status === 'New' && (
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" title="New Feedback"></span>
                      )}
                      {item.user_email || 'Anonymous'}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.feedback_text}</TableCell>
                  <TableCell><a href={item.page_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{item.page_url}</a></TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedFeedback(item)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ feedbackId: item.id, status: 'In Progress' })}>
                            <Clock className="mr-2 h-4 w-4" /> Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ feedbackId: item.id, status: 'Resolved' })}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this feedback?')) {
                                deleteFeedbackMutation.mutate(item.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No feedback submitted yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={!!selectedFeedback} onOpenChange={(isOpen) => !isOpen && setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Conversation</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <FeedbackConversation feedbackId={selectedFeedback.id} userEmail={selectedFeedback.user_email || 'Anonymous'} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackManager;