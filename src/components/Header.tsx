import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Zap, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import nbcLogo from '@/assets/NBC936-logo.png';

interface HeaderProps {
  showSignOut?: boolean;
  onSignOut?: () => void;
  pathwayInfo?: string;
}

const Header = ({ showSignOut = false, onSignOut, pathwayInfo }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAccountClick = () => {
    navigate('/dashboard?tab=account');
  };

  const getInitials = (email: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <img src={nbcLogo} alt="NBC 9.36 Navigator Logo" className="h-14 [filter:drop-shadow(0_0_15px_#FFF)_drop-shadow(0_0_30px_#fff)] [transition:filter_0.3s_ease]" />
          </div>
          {pathwayInfo && (
            <div className="flex items-center gap-2">
              {pathwayInfo.includes('Prescriptive') && (
                <Badge 
                  variant="outline" 
                  className="text-sm font-medium border-2 border-orange-500 text-orange-700 bg-orange-50 dark:border-orange-400 dark:text-orange-300 dark:bg-orange-950/30 px-3 py-1 flex items-center gap-1.5 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Prescriptive Path
                </Badge>
              )}
              {pathwayInfo.includes('Performance') && (
                <Badge 
                  variant="outline" 
                  className="text-sm font-medium border-2 border-blue-500 text-blue-700 bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-950/30 px-3 py-1 flex items-center gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Performance Path
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {showSignOut && (
            <nav className="flex items-center gap-2 mr-4">
              <Link to="/dashboard">
                <Button variant={location.pathname === '/dashboard' ? 'default' : 'ghost'} size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/calculator">
                <Button variant={location.pathname === '/calculator' ? 'default' : 'ghost'} size="sm">
                  Calculator
                </Button>
              </Link>
              <Link to="/faq">
                <Button variant={location.pathname === '/faq' ? 'default' : 'ghost'} size="sm">
                  FAQ
                </Button>
              </Link>
            </nav>
          )}
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
                    <p className="text-sm font-medium leading-none">My Account</p>
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