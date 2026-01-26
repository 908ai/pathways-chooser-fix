import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle, Shield, LayoutGrid, PieChart, Calculator, MessageSquare, BarChart3 } from 'lucide-react';
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
  const { isAdmin, isMunicipal, isAgency } = useUserRole();
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

  // Determine the dashboard path based on role
  const dashboardPath = (isMunicipal || isAgency) ? '/municipal-dashboard' : '/dashboard';
  // Determine the dashboard icon based on role (optional, but BarChart3 fits municipal better)
  const DashboardIcon = (isMunicipal || isAgency) ? BarChart3 : PieChart;

  const mainNavLinks = [
    { path: dashboardPath, label: 'Dashboard', icon: <DashboardIcon className="h-4 w-4" /> },
    { path: '/projects', label: 'Projects', icon: <LayoutGrid className="h-4 w-4" /> },
    {
      path: '/calculator?showHelp=true',
      label: 'Start Compliance',
      icon: <Calculator className="h-4 w-4" />,
      isCTA: true,
    },
  ];

  const secondaryNavLinks = [
    { path: '/building-officials', label: 'Building Officials' },
    { path: '/resources', label: 'Resources' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to={isLoginVariant ? "/login" : dashboardPath}>
            <img src="/assets/energy-navigator-logo.png" alt="Energy Navigator 9.36 Logo" className="h-[75px] dark:hidden" />
            <img src="/assets/energy-navigator-logo-w.png" alt="Energy Navigator 9.36 Logo" className="h-[75px] hidden dark:block" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isLoginVariant && (
            <>
              <div className="hidden md:flex items-center gap-4">
                <nav className="flex items-center gap-1">
                  {isAdmin && (
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger
                            className={cn(
                              "group inline-flex h-auto w-max items-center justify-center rounded-md bg-transparent px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                              isLinkActive("/admin") || isLinkActive("/municipal-dashboard")
                                ? "bg-primary/10 text-primary"
                                : "text-primary dark:text-primary hover:bg-accent hover:text-primary/80"
                            )}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Admin
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-1 p-2">
                              <li>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to="/admin"
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">Admin Dashboard</div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                              <li>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to="/municipal-dashboard"
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">Municipal Dashboard</div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  )}
                  
                  {mainNavLinks.map((link: any) => {
                    const basePath = link.path.split('?')[0];
                    const isActive = isLinkActive(basePath);

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          link.isCTA
                            ? cn(
                              "ml-1",
                              "bg-primary text-primary-foreground shadow-sm",
                              "hover:brightness-95 dark:hover:brightness-110",
                              "dark:bg-primary dark:text-primary-foreground",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              isActive && "ring-1 ring-primary/40"
                            )
                            : cn(
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-slate-500 dark:text-slate-400 hover:bg-accent hover:text-accent-foreground"
                            )
                        )}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    );
                  })}
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
            </>
          )}

          <NotificationBell />
          <ThemeToggle />

          {!isLoginVariant && showSignOut && user && (
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
                <DropdownMenuItem onClick={() => navigate('/my-feedback')} className="cursor-pointer flex justify-between items-center">
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>My Feedback</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </DropdownMenuItem>
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