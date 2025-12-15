import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format, formatDistanceToNow } from 'date-fns'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, MessageSquare, Send, User, Shield } from 'lucide-react'
import { useUnreadProjectEvents } from '@/hooks/useUnreadProjectEvents'
import { useUnreadAdminProjectEvents } from '@/hooks/useUnreadAdminProjectEvents'
import { Database, Json } from '@/integrations/supabase/types'

type ProjectEvent = {
  id: string
  created_at: string
  event_type: string
  payload: Json
  user_id: string
  user_email: string
  user_role: Database['public']['Enums']['app_role']
  is_read: boolean
}

interface ProjectTimelineProps {
  projectId: string
}

const fetchProjectEvents = async (projectId: string): Promise<ProjectEvent[]> => {
  const { data, error } = await supabase.rpc('get_project_events_with_details', {
    p_project_id: projectId,
  })

  if (error) {
    console.error('Error fetching project events:', error)
    throw new Error('Failed to fetch project events')
  }
  return (data as unknown as ProjectEvent[]) || []
}

const markEventsAsRead = async (eventIds: string[], userId: string) => {
    if (eventIds.length === 0) return;

    // We only mark as read events that were not created by the current user
    const { data: eventsToMark, error: fetchError } = await supabase
        .from('project_events')
        .select('id, user_id')
        .in('id', eventIds)
        .neq('user_id', userId);

    if (fetchError) {
        console.error('Error fetching events to mark as read:', fetchError);
        return;
    }

    const idsToMark = eventsToMark.map(e => e.id);

    if (idsToMark.length === 0) return;

    const { error } = await supabase
        .from('project_events')
        .update({ is_read: true })
        .in('id', idsToMark);

    if (error) {
        console.error('Error marking events as read:', error);
    }
};


export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const { user } = useAuth()
  const { isAdmin } = useUserRole()
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()
  const { invalidate: invalidateUserUnread } = useUnreadProjectEvents()
  const { invalidate: invalidateAdminUnread } = useUnreadAdminProjectEvents()

  const { data: events = [], isLoading } = useQuery<ProjectEvent[]>({
    queryKey: ['project_events', projectId],
    queryFn: () => fetchProjectEvents(projectId),
  })

  useEffect(() => {
    if (events.length > 0 && user) {
      const unreadEventIds = events
        .filter(event => !event.is_read)
        .map(event => event.id);

      if (unreadEventIds.length > 0) {
        markEventsAsRead(unreadEventIds, user.id).then(() => {
          // Invalidate queries to update unread counts
          queryClient.invalidateQueries({ queryKey: ['project_events', projectId] })
          invalidateUserUnread()
          invalidateAdminUnread()
        });
      }
    }
  }, [events, projectId, user, queryClient, invalidateAdminUnread, invalidateUserUnread]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return

    const { error } = await supabase.from('project_events').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'user_comment',
      payload: { comment: newComment.trim() },
    })

    if (error) {
      console.error('Error adding comment:', error)
    } else {
      setNewComment('')
      queryClient.invalidateQueries({ queryKey: ['project_events', projectId] })
    }
  }

  const getInitials = (email: string) => email.substring(0, 2).toUpperCase()

  const renderEvent = (event: ProjectEvent) => {
    const isAuthor = event.user_id === user?.id
    const isEventAdmin = event.user_role === 'admin'
    const payload = event.payload as { comment?: string }

    return (
      <div key={event.id} className={`flex items-start gap-4 ${isAuthor ? 'justify-end' : ''}`}>
        {!isAuthor && (
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>{isEventAdmin ? <Shield size={18} /> : getInitials(event.user_email)}</AvatarFallback>
          </Avatar>
        )}
        <div className={`flex flex-col gap-1 ${isAuthor ? 'items-end' : 'items-start'}`}>
          <div
            className={`max-w-md rounded-lg px-3 py-2 ${
              isAuthor ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            <p className="text-sm">{payload.comment}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            <span>{event.user_email}</span>
            <span title={format(new Date(event.created_at), 'PPpp')}>
              {' · '}
              {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        {isAuthor && (
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>{isAdmin ? <Shield size={18} /> : getInitials(event.user_email)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    )
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
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : events.length > 0 ? (
            events
              .filter((event) => event.event_type === 'user_comment' || event.event_type === 'revision_request')
              .map(renderEvent)
          ) : (
            <p className="text-center text-muted-foreground">No comments or revisions yet.</p>
          )}
        </div>

        <div className="mt-6 flex w-full items-start space-x-4">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback>{user ? (isAdmin ? <Shield size={20} /> : getInitials(user.email || '')) : <User />}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full"
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()} className="mt-2">
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}