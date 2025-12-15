"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeedbackConversation from './FeedbackConversation';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type Feedback = Tables<'feedback'> & { user_email: string };

export const FeedbackManager = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: feedback, isLoading, error } = useQuery<Feedback[]>({
    queryKey: ['all_feedback'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_feedback_with_user_details');
      if (error) throw new Error(error.message);
      return data || [];
    }
  });

  const handleViewConversation = async (feedbackItem: Feedback) => {
    setSelectedFeedback(feedbackItem);
    setIsModalOpen(true);
    if (feedbackItem.status === 'New') {
      updateStatusMutation.mutate({ id: feedbackItem.id, status: 'In Progress', isAutomaticUpdate: true });
    }
    
    const { error } = await supabase.rpc('mark_feedback_responses_as_read', { p_feedback_id: feedbackItem.id });
    if (error) {
      console.error('Error marking feedback as read:', error);
    } else {
      queryClient.invalidateQueries({ queryKey: ['unread_notifications_with_details'] });
      queryClient.invalidateQueries({ queryKey: ['all_feedback'] });
    }
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, isAutomaticUpdate }: { id: string, status: string, isAutomaticUpdate?: boolean }) => {
      const { error } = await supabase.from('feedback').update({ status }).eq('id', id);
      if (error) throw error;
      return { isAutomaticUpdate };
    },
    onSuccess: ({ isAutomaticUpdate }) => {
      queryClient.invalidateQueries({ queryKey: ['all_feedback'] });
      if (!isAutomaticUpdate) {
        toast({ title: 'Success', description: 'Feedback status updated.' });
      }
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to update status: ${error.message}`, variant: 'destructive' });
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
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

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      deleteFeedbackMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading feedback...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Feedback Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{item.user_email}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="max-w-xs truncate">{item.feedback_text}</TableCell>
              <TableCell>
                <Select value={item.status} onValueChange={(value) => handleStatusChange(item.id, value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue>
                      <Badge variant={
                        item.status === 'New' ? 'default' :
                        item.status === 'In Progress' ? 'secondary' :
                        item.status === 'Resolved' ? 'outline' : 'destructive'
                      }>{item.status}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleViewConversation(item)}>View</Button>
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(item.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Feedback Conversation</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <FeedbackConversation
              feedbackId={selectedFeedback.id}
              userEmail={selectedFeedback.user_email}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackManager;