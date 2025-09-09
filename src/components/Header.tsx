import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Zap } from 'lucide-react';

interface HeaderProps {
  showSignOut?: boolean;
  onSignOut?: () => void;
  pathwayInfo?: string;
}

const Header = ({ showSignOut = false, onSignOut, pathwayInfo }: HeaderProps) => {
  const location = useLocation();
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">NBC2020 Energy Code Pathways Selector</h1>
          </div>
          {pathwayInfo && (
            <div className="flex items-center gap-2">
              {pathwayInfo.includes('Prescriptive') && (
                <Badge 
                  variant="outline" 
                  className="text-sm font-medium border-2 border-orange-500 text-orange-700 bg-orange-50 dark:border-orange-400 dark:text-orange-300 dark:bg-orange-950/30 px-3 py-1 flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Prescriptive Path
                </Badge>
              )}
              {pathwayInfo.includes('Performance') && (
                <Badge 
                  variant="outline" 
                  className="text-sm font-medium border-2 border-blue-500 text-blue-700 bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-950/30 px-3 py-1 flex items-center gap-1.5"
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
            </nav>
          )}
          <img 
            src="https://oxvhlrvtmfnmdazwgdtp.supabase.co/storage/v1/object/public/company-assets/path4.svg" 
            alt="Sol Invictus Energy Services" 
            className="h-24 w-auto"
          />
          {showSignOut && (
            <Button variant="outline" onClick={onSignOut}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;