"use client";

import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle,
  FilePlus,
  FileText,
  History,
  MessageSquare,
  Send,
  Shield,
  XCircle,
} from 'lucide-react';

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
  user_email: string;
  user_role: 'admin' | 'user';
}

interface ProjectHistoryProps {
  events: ProjectEvent[];
}

const ProjectHistory = ({ events }: ProjectHistoryProps) => {
  const { user } = useAuth();

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'project_created':
        return <FilePlus className="h-5 w-5 text-blue-500" />;
      case 'project_submitted':
        return <Send className="h-5 w-5 text-purple-500" />;
      case 'user_comment':
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
      case 'revision_request':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'status_change':
        return <History className="h-5 w-5 text-gray-500" />;
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventDescription = (event: ProjectEvent) => {
    const userName = event.user_role === 'admin' ? 'Admin' : 'User';
    switch (event.event_type) {
      case 'project_created':
        return `${userName} created the project.`;
      case 'project_submitted':
        return `${userName} submitted the project for review.`;
      case 'user_comment':
        return `${userName} commented: "${event.payload.comment}"`;
      case 'revision_request':
        return `Admin requested a revision: "${event.payload.comment}"`;
      case 'status_change':
        return `Admin changed status from ${event.payload.old_status} to ${event.payload.status}.`;
       case 'pass':
        return `Admin approved the project.`;
      case 'fail':
        return `Admin rejected the project.`;
      default:
        return `An event of type ${event.event_type} occurred.`;
    }
  };

  const EventItem = ({ event }: { event: ProjectEvent }) => {
    const isAuthor = user?.id === event.user_id;

    return (
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {getEventIcon(event.event_type)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{getEventDescription(event)}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(event.created_at), "MMM d, yyyy 'at' h:mm a")} by {event.user_email}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Project History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events && events.length > 0 ? (
            [...events]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map(event => <EventItem key={event.id} event={event} />)
          ) : (
            <p className="text-muted-foreground text-center py-8">No history recorded for this project yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectHistory;