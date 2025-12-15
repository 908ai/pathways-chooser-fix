"use client";

import { Bell, MessageSquare, Mail } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useUnreadNotificationsWithDetails, UnreadRevisionDetail } from '@/hooks/useUnreadNotificationsWithDetails';
import { Link } from 'react-router-dom';

export const NotificationBell = () => {
  const { unreadRevisions, unreadFeedback, revisionDetails, totalUnread, isLoading } = useUnreadNotificationsWithDetails();

  const uniqueRevisionDetails = revisionDetails.reduce((acc: UnreadRevisionDetail[], current) => {
    if (!acc.find((item) => item.project_id === current.project_id)) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalUnread > 0 && !isLoading && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {totalUnread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have {totalUnread} unread messages.
            </p>
          </div>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {unreadRevisions > 0 && (
              <div>
                <p className="text-sm font-medium leading-none px-2 pt-2">Project Revisions ({unreadRevisions})</p>
                {uniqueRevisionDetails.map((detail) => (
                  <Link 
                    key={detail.project_id}
                    to={`/project/${detail.project_id}?tab=timeline`} 
                    className="flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent"
                  >
                    <MessageSquare className="mt-px h-5 w-5 flex-shrink-0" />
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none truncate">{detail.project_name}</p>
                      <p className="text-sm text-muted-foreground">
                        New comment(s) await your review.
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {unreadFeedback > 0 && (
              <div>
                <p className="text-sm font-medium leading-none px-2 pt-2">Feedback</p>
                <Link to="/my-feedback" className="flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent">
                  <Mail className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Feedback Messages</p>
                    <p className="text-sm text-muted-foreground">
                      You have {unreadFeedback} unread feedback messages.
                    </p>
                  </div>
                </Link>
              </div>
            )}
            {totalUnread === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};