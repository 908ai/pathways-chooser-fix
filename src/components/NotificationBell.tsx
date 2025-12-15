import { Bell } from 'lucide-react';
import { useUnreadEvents } from '@/hooks/useUnreadEvents';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const { unreadCount, unreadProjects } = useUnreadEvents();
  const navigate = useNavigate();

  const handleNotificationClick = (projectId: string) => {
    navigate(`/project/${projectId}?tab=timeline`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {unreadProjects.length > 0 ? (
          unreadProjects.map((proj) => (
            <DropdownMenuItem
              key={proj.project_id}
              onClick={() => handleNotificationClick(proj.project_id)}
              className="cursor-pointer"
            >
              <div className="flex justify-between w-full">
                <span className="truncate pr-2">{proj.project_name}</span>
                <span className="flex-shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {proj.count}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};