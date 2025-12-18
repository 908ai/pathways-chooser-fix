"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, MessageSquare, Send, User, Shield, RefreshCw, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQueryClient } from '@tanstack/react-query';

interface ProjectEvent {
  id: string;
  created_at: string;
  event_type: string;
  payload: {
    comment?: string;
    status?: string;
    old_status?: string;
  } | null;
  user_id: string;
  user_email: string;
  user_role: 'admin' | 'user';
}

interface ProjectTimelineProps {
  projectId: string;
  projectOwnerId: string;
  complianceStatus: string;
  events: ProjectEvent[];
  onCommentAdded: () => void;
}

const ProjectTimeline = ({ projectId, projectOwnerId, complianceStatus, events, onCommentAdded }: ProjectTimelineProps) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [events]);

  useEffect(() => {
    const markAsRead = async () => {
      if (!projectId) return;
      const { error } = await supabase.rpc('mark_project_events_as_read', { p_project_id: projectId });
      if (error) {
        console.error('Error marking project events as read:', error);
      } else {
        queryClient.invalidateQueries({ queryKey: ['unread_notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unread_notifications_with_details'] });
      }
    };

    markAsRead();

    const subscription = supabase
      .channel(`project_events:${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_events', filter: `project_id=eq.${projectId}` }, (payload) => {
        onCommentAdded();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [projectId, queryClient, onCommentAdded]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('project_events').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'user_comment',
      payload: { comment: newComment.trim() },
    });

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setNewComment('');
      onCommentAdded();
    }
    setIsSubmitting(false);
  };

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  }

  const EventItem = ({ event }: { event: ProjectEvent }) => {
    const isAuthor = user?.id === event.user_id;
    const isRevisionRequest = event.event_type === 'revision_request';
    const isUpdateRequest = event.event_type === 'update_requested';
    const isUpdateAllowed = event.event_type === 'update_allowed';

    // Filter out non-comment events from this view
    if (
      event.event_type !== 'user_comment' && 
      event.event_type !== 'revision_request' &&
      event.event_type !== 'update_requested' &&
      event.event_type !== 'update_allowed'
    ) {
      return null;
    }

    let bgColor = isAuthor ? 'bg-primary text-primary-foreground' : 'bg-muted';
    let borderColor = '';
    let textColor = '';
    let icon = null;
    let label = event.user_role === 'admin' ? 'Admin' : 'User';
    let actionText = 'commented';

    if (isRevisionRequest) {
      bgColor = 'bg-yellow-100 dark:bg-yellow-900/50';
      borderColor = 'border border-yellow-200 dark:border-yellow-800';
      textColor = 'text-yellow-900 dark:text-yellow-200';
      icon = <AlertTriangle className="inline-block h-4 w-4 mr-2" />;
      actionText = 'requested a revision';
    } else if (isUpdateRequest) {
      bgColor = 'bg-blue-100 dark:bg-blue-900/50';
      borderColor = 'border border-blue-200 dark:border-blue-800';
      textColor = 'text-blue-900 dark:text-blue-200';
      icon = <RefreshCw className="inline-block h-4 w-4 mr-2" />;
      actionText = 'requested to edit project';
    } else if (isUpdateAllowed) {
      bgColor = 'bg-green-100 dark:bg-green-900/50';
      borderColor = 'border border-green-200 dark:border-green-800';
      textColor = 'text-green-900 dark:text-green-200';
      icon = <CheckCircle2 className="inline-block h-4 w-4 mr-2" />;
      actionText = 'allowed edits';
    }

    return (
      <div className={`flex items-start gap-4 ${isAuthor ? 'justify-end' : ''}`}>
        {!isAuthor && (
          <Avatar className="h-10 w-10 border">
            <AvatarFallback>{event.user_role === 'admin' ? <Shield className="h-5 w-5" /> : getInitials(event.user_email)}</AvatarFallback>
          </Avatar>
        )}
        <div className={`max-w-md rounded-lg px-4 py-3 ${bgColor} ${borderColor}`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`font-semibold text-sm ${textColor}`}>
              {icon}
              {label} {actionText}
            </p>
          </div>
          <p className="text-sm">{event.payload?.comment}</p>
          <p className={`text-xs mt-2 opacity-70 ${isAuthor ? 'text-right' : ''}`}>
            {format(new Date(event.created_at), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        {isAuthor && (
          <Avatar className="h-10 w-10 border">
            <AvatarFallback>{getInitials(user?.email || '')}</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  const canComment = complianceStatus === 'needs_revision' || isAdmin;
  const commentEvents = events.filter(e => 
    e.event_type === 'user_comment' || 
    e.event_type === 'revision_request' ||
    e.event_type === 'update_requested' ||
    e.event_type === 'update_allowed'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Project Revisions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {commentEvents && commentEvents.length > 0 ? (
            commentEvents.map(event => <EventItem key={event.id} event={event} />)
          ) : (
            <p className="text-muted-foreground text-center py-8">No comments or revisions yet.</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium mb-2">Add a comment</h4>
          <div className="grid gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Textarea
                      placeholder={canComment ? "Type your message here..." : "Commenting is disabled for this project's current status."}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={isSubmitting || !canComment}
                    />
                  </div>
                </TooltipTrigger>
                {!canComment && (
                  <TooltipContent>
                    <p>You can only comment when the project status is "Needs Revision".</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <Button onClick={handleAddComment} disabled={isSubmitting || !newComment.trim() || !canComment} className="self-end">
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;