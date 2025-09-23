import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mail, ChevronDown } from "lucide-react";

export default function BuildingOfficialContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-gradient-to-r from-slate-800/50 to-blue-800/50 border border-slate-400/40 backdrop-blur-md shadow-lg rounded-lg overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">❓</span>
          <div>
            <h3 className="text-md font-semibold text-white">Need to Verify Something?</h3>
            <p className="text-sm text-slate-200 hidden sm:block">
              We welcome questions from plan reviewers or inspectors.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-slate-500 to-blue-500 hover:from-slate-600 hover:to-blue-600 text-white font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
            asChild
          >
            <a href="mailto:info@sies.energy?subject=Building Official Inquiry">
              <Mail className="h-4 w-4 mr-2" />
              Contact Our Team
            </a>
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
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
        <div className="px-4 pb-4 pt-2 border-t border-slate-400/30">
          <p className="text-slate-200 text-sm">
            As energy code specialists, we provide technical support and applicant guidance—so you can focus on reviewing complete, code-aligned submissions.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}