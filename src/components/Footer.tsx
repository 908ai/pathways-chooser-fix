import { Button } from '@/components/ui/button';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const handleCallContact = () => {
    window.location.href = 'tel:+14038722441';
  };

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Alberta & Saskatchewan</span>
          </div>
          
          <p className="text-sm text-muted-foreground sm:absolute sm:left-1/2 sm:-translate-x-1/2">© 2025</p>

          <Button 
            onClick={handleCallContact}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 hover-scale"
          >
            <Phone className="h-4 w-4" />
            <div className="text-left">
              <p className="text-xs">Need Help? Call Us</p>
              <p className="font-semibold">403-872-2441</p>
            </div>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;