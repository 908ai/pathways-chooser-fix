import { Button } from '@/components/ui/button';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const handleCallContact = () => {
    window.location.href = 'tel:+14038722441';
  };

  return (
    <footer
      className="mt-auto"
      style={{
        backgroundColor: '#1B3A6B',
        borderTop: '3px solid #F5A623'
      }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4" />
            <span>Alberta & Saskatchewan</span>
          </div>
          
          <p className="text-sm text-white/70 sm:absolute sm:left-1/2 sm:-translate-x-1/2">© 2025 Energy Navigator 9.36. All rights reserved.</p>

          <Button
            onClick={handleCallContact}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-white/10 text-white"
          >
            <Phone className="h-4 w-4 text-white/70" />
            <div className="text-right">
              <p className="text-[10.5px] text-white/70 leading-[15px]">Need Help? Call Us</p>
              <p className="font-semibold text-white">403-872-2441</p>
            </div>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;