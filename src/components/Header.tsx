import { Button } from './ui/button';
import { LogOut, User, LayoutDashboard, PieChart, LayoutGrid, Calculator } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { NotificationBell } from './NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';
import { useUnreadFeedback } from '@/hooks/useUnreadFeedback';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  showSignOut?: boolean;
  onSignOut?: () => void;
  variant?: 'default' | 'login';
}

const Header = ({ showSignOut = false, onSignOut, variant = 'default' }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [userName, setUserName] = useState<string | null>(null);
  const { data: unreadCount } = useUnreadFeedback();

  const isLoginVariant = variant === 'login';
  const isLinkActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('company_name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (companyData && companyData.company_name) {
          setUserName(companyData.company_name);
        } else if (companyError && companyError.code !== 'PGRST116') {
          console.error("Error fetching company name:", companyError);
        }
      }
    };

    fetchUserName();
  }, [user]);

  const handleAccountClick = () => {
    navigate('/account');
  };

  const getInitials = (email: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }

  const mainNavLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <PieChart className="h-4 w-4" /> },
    { path: '/projects', label: 'Projects', icon: <LayoutGrid className="h-4 w-4" /> },
    { path: '/calculator?showHelp=true', label: 'Calculator', icon: <Calculator className="h-4 w-4" /> },
  ];

  const secondaryNavLinks = [
    { path: '/building-officials', label: 'Building Officials' },
    { path: '/resources', label: 'Resources' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <img src="/sol-invictus-logo.svg" alt="Sol Invictus" className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block">
              Energy Navigator
            </span>
          </a>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          {showSignOut && (
            <>
              {isAdmin && (
                <Button variant="ghost" onClick={() => navigate('/admin')}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigate('/account')}>
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
              <NotificationBell />
              <ThemeToggle />
              <Button variant="ghost" onClick={onSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;