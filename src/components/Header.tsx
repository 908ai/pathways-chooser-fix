import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle, Shield, LayoutGrid, PieChart, Calculator } from 'lucide-react';
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import React from 'react';

interface HeaderProps {
  showSignOut?: boolean;
  onSignOut?: () => void;
}

const Header = ({ showSignOut = false, onSignOut }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [userName, setUserName] = useState<string | null>(null);

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
    { path: '/calculator', label: 'Calculator', icon: <Calculator className="h-4 w-4" /> },
  ];

  const secondaryNavLinks = [
    { path: '/building-officials', label: 'Building Officials' },
    { path: '/resources', label: 'Resources' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="bg-[rgb(255_255_255_/_0.95)] dark:bg-slate-900/90 backdrop-blur-sm border-b dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/dashboard">
            <img src="/assets/energy-navigator-logo.png" alt="Energy Navigator 9.36 Logo" className="h-[55px] dark:hidden" />
            <img src="/assets/energy-navigator-logo-w.png" alt="Energy Navigator 9.36 Logo" className="h-[55px] hidden dark:block" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {mainNavLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isLinkActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 hover:bg-[rgb(216,222,227)] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            <span className="h-4 w-px bg-slate-300 dark:bg-slate-600" aria-hidden="true"></span>

            <nav className="flex items-center gap-4 text-xs font-medium">
              {secondaryNavLinks.map((link, index) => (
                <React.Fragment key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "transition-colors",
                      isLinkActive(link.path)
                        ? "text-primary"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                    )}
                  >
                    {link.label}
                  </Link>
                  {index < secondaryNavLinks.length - 1 && (
                    <span className="h-4 w-px bg-slate-300 dark:bg-slate-600" aria-hidden="true"></span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          <ThemeToggle />

          {showSignOut && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-white border-2 border-[#d8dee3] p-0 hover:bg-slate-100">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-transparent text-slate-900">{getInitials(user.email || '')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName ? `Welcome, ${userName}!` : 'Welcome!'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAccountClick} className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Account Details</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;