import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle, Shield } from 'lucide-react';
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

  const navLinks = [
    { path: '/dashboard', label: 'Projects' },
    { path: '/dashboard3', label: 'Analytics' },
    { path: '/calculator', label: 'Calculator' },
    { path: '/building-officials', label: 'Building Officials' },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/dashboard">
            <img src="/assets/energy-navigator-logo.png" alt="Energy Navigator 9.36 Logo" className="h-10" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors",
                  isLinkActive(link.path) && "text-primary font-bold"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border p-0.5">
            <Button variant="ghost" size="sm" className="text-xs font-semibold h-6 px-3 rounded-full bg-slate-100 text-slate-800">EN</Button>
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 h-6 px-3 rounded-full">ES</Button>
          </div>
          {showSignOut && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.email || '')}</AvatarFallback>
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