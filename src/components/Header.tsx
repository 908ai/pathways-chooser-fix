import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle, Shield, LayoutGrid, PieChart, Calculator, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
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
import { ThemeToggle } from './ThemeToggle';
import { NotificationBell } from './NotificationBell';
import React from 'react';
import { useUnreadFeedback } from '@/hooks/useUnreadFeedback';

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
    <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to={isLoginVariant ? "/login" : "/dashboard"}>
            <img src="/assets/energy-navigator-logo.png" alt="Energy Navigator 9.36 Logo" className="h-[75px] dark:hidden" />
            <img src="/assets/energy-navigator-logo-w.png" alt="Energy Navigator 9.36 Logo" className="h-[75px] hidden dark:block" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          {showSignOut && (
            <Button variant="outline" onClick={onSignOut}>Sign Out</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;