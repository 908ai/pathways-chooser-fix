"use client";

import { Bell, MessageSquare, Mail } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';
import { Link } from 'react-router-dom';

export const NotificationBell = () => {
  const { unreadRevisions, unreadFeedback, totalUnread, isLoading } = useUnreadNotifications();

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
          <div className="grid gap-2">
            {unreadRevisions > 0 && (
              <Link to="/dashboard" className="flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent">
                <MessageSquare className="mt-px h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Project Revisions</p>
                  <p className="text-sm text-muted-foreground">
                    You have {unreadRevisions} unread revision comments.
                  </p>
                </div>
              </Link>
            )}
            {unreadFeedback > 0 && (
              <Link to="/my-feedback" className="flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent">
                <Mail className="mt-px h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Feedback Messages</p>
                  <p className="text-sm text-muted-foreground">
                    You have {unreadFeedback} unread feedback messages.
                  </p>
                </div>
              </Link>
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