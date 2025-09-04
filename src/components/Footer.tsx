import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

const Footer = () => {
  const handleCallContact = () => {
    window.location.href = 'tel:+14038722441';
  };

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <a 
            href="https://www.solinvictusenergyservices.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors underline"
          >
            Visit our website: solinvictusenergyservices.com
          </a>
          
          <Button 
            onClick={handleCallContact}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 hover-scale"
          >
            <Phone className="h-4 w-4" />
            Contact Us: 403-872-2441
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;