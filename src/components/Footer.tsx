import { Button } from '@/components/ui/button';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const handleCallContact = () => {
    window.location.href = 'tel:+14038722441';
  };

  return (
    <footer className="border-t bg-white dark:bg-slate-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Alberta & Saskatchewan</span>
          </div>
          
          <p className="text-sm text-muted-foreground sm:absolute sm:left-1/2 sm:-translate-x-1/2">© 2025 Energy Navigator 9.36. All rights reserved.</p>

          <Button 
            onClick={handleCallContact}
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 hover:bg-transparent"
          >
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <p className="text-[10.5px] text-muted-foreground leading-[15px]">Need Help? Call Us</p>
              <p className="font-semibold text-muted-foreground">403-872-2441</p>
            </div>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;