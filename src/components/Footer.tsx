import { Button } from '@/components/ui/button';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const handleCallContact = () => {
    window.location.href = 'tel:+14038722441';
  };

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            <span>Alberta & Saskatchewan</span>
          </div>
          
          <p className="text-sm text-slate-500 sm:absolute sm:left-1/2 sm:-translate-x-1/2">© 2025 Energy Navigator 9.36. All rights reserved.</p>

          <Button 
            onClick={handleCallContact}
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 hover:bg-transparent"
          >
            <Phone className="h-4 w-4 text-slate-500" />
            <div className="text-right">
              <p className="text-[10.5px] text-slate-500">Need Help? Call Us</p>
              <p className="font-semibold text-slate-500">403-872-2441</p>
            </div>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;