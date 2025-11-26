import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mail, ChevronDown, HelpCircle } from "lucide-react";

export default function BuildingOfficialContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-gradient-to-r from-slate-800 to-blue-900 border border-slate-700 shadow-lg rounded-lg overflow-hidden text-white"
    >
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
          <div>
            <h3 className="text-md font-semibold">Need to Verify Something?</h3>
            <p className="text-sm text-slate-300">
              We welcome questions from plan reviewers or inspectors.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
            onClick={() => window.location.href = 'mailto:info@sies.energy?subject=Building Official Inquiry'}
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact Our Team
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
        <div className="px-4 pb-4 pt-2 border-t border-slate-700">
          <p className="text-slate-300 text-sm">
            As energy code specialists, we provide technical support and applicant guidance—so you can focus on reviewing complete, code-aligned submissions.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}