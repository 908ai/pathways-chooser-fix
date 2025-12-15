"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, MessageSquare, Send, User, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectTimelineProps {
  projectId: string;
  projectOwnerId: string;
}

interface ProjectEvent {
  id: string;
  created_at: string;
  event_type: string;
  payload: {
    comment?: string;
    status?: string;
    old_status?: string;
  };
  user_id: string;
  user_email: string; // We'll need to join to get this
  user_role: 'admin' | 'user';
}

const ProjectTimeline = ({ projectId, projectOwnerId }: ProjectTimelineProps) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!projectId) return;
      setLoading(true);

      const { data, error } = await supabase
        .rpc('get_project_events_with_details', { p_project_id: projectId });

      if (error) {
        console.error('Error fetching project events:', error);
      } else {
        // Assuming the RPC returns user details
        const formattedEvents = Array.isArray(data) ? data.map((event: any) => ({
          ...event,
          user_email: event.user_email,
          user_role: event.user_role,
        })) : [];
        setEvents(formattedEvents);
      }
      setLoading(false);
    };

    fetchEvents();

    const subscription = supabase
      .channel(`project_events:${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_events', filter: `project_id=eq.${projectId}` }, async (payload) => {
        const newEvent = payload.new as ProjectEvent;

        // Fetch user details for the new event
        const { data: userDetails, error: userError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', newEvent.user_id)
          .single();
        
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(newEvent.user_id);

        if (userError && userError.code !== 'PGRST116') console.error("Error fetching user role for new event", userError);
        if (authError) console.error("Error fetching user for new event", authError);

        const fullNewEvent: ProjectEvent = {
          ...newEvent,
          user_email: authUser?.user?.email || '',
          user_role: userDetails?.role as 'admin' | 'user' || 'user',
        };
        
        setEvents((prevEvents) => [...prevEvents, fullNewEvent]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [projectId]);

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
    }
    setIsSubmitting(false);
  };

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  }

  const EventItem = ({ event }: { event: ProjectEvent }) => {
    const isAuthor = user?.id === event.user_id;
    const isRevisionRequest = event.event_type === 'revision_request';

    return (
      <div className={`flex items-start gap-4 ${isAuthor ? 'justify-end' : ''}`}>
        {!isAuthor && (
          <Avatar className="h-10 w-10 border">
            <AvatarFallback>{event.user_role === 'admin' ? <Shield className="h-5 w-5" /> : getInitials(event.user_email)}</AvatarFallback>
          </Avatar>
        )}
        <div className={`max-w-md rounded-lg px-4 py-3 ${
          isRevisionRequest 
            ? 'bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800' 
            : isAuthor 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`font-semibold text-sm ${isRevisionRequest ? 'text-yellow-900 dark:text-yellow-200' : ''}`}>
              {isRevisionRequest && <AlertTriangle className="inline-block h-4 w-4 mr-2" />}
              {event.user_role === 'admin' ? 'Admin' : 'User'}
              {isRevisionRequest ? ' requested a revision' : ' commented'}
            </p>
          </div>
          <p className="text-sm">{event.payload.comment}</p>
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

  if (loading) {
    return <p>Loading timeline...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Project Timeline & Revisions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.length > 0 ? (
            events.map(event => <EventItem key={event.id} event={event} />)
          ) : (
            <p className="text-muted-foreground text-center py-8">No comments or revisions yet.</p>
          )}
        </div>
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium mb-2">Add a comment</h4>
          <div className="grid gap-2">
            <Textarea
              placeholder="Type your message here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
            />
            <Button onClick={handleAddComment} disabled={isSubmitting || !newComment.trim()} className="self-end">
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