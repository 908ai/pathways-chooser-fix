import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <Card className="bg-gradient-to-r from-slate-800/50 to-teal-800/50 border-slate-400/40 backdrop-blur-md shadow-2xl">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">📞</span>
            <h3 className="text-lg font-semibold text-white">Need Help? We're Here for You!</h3>
          </div>
          <p className="text-slate-100 max-w-2xl mx-auto">
            If you're unsure about anything, please call us directly. You'll speak to a real person from our small, local team. 
            We're here to walk you through the process, answer your questions, and help make energy compliance easy and stress-free.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button size="lg" className="bg-gradient-to-r from-slate-500 to-teal-500 hover:from-slate-600 hover:to-teal-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200" onClick={() => window.open('tel:403-872-2441', '_self')}>
              📞 Call Us: 403-872-2441
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSection;