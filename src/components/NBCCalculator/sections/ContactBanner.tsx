import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Phone, ChevronDown } from "lucide-react";

export default function ContactBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-gradient-to-r from-slate-50 to-teal-50 border border-slate-200 shadow-sm rounded-lg overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📞</span>
          <div>
            <h3 className="text-md font-semibold text-slate-800">Need Help? We're Here for You!</h3>
            <p className="text-sm text-slate-600 hidden sm:block">
              If you're unsure about anything, please call us directly.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => window.open('tel:403-872-2441', '_self')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Us
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100">
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="px-4 pb-4 pt-2 border-t border-slate-200">
          <p className="text-slate-600 text-sm">
            You'll speak to a real person from our small, local team. We're here to walk you through the process, answer your questions, and help make energy compliance easy and stress-free.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}