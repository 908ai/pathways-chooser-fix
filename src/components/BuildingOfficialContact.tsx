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
      className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/50 shadow-sm rounded-lg overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h3 className="text-md font-semibold text-foreground">Need to Verify Something?</h3>
            <p className="text-sm text-muted-foreground">
              We welcome questions from plan reviewers or inspectors.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => window.location.href = 'mailto:info@sies.energy?subject=Building Official Inquiry'}
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact Our Team
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent">
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
        <div className="px-4 pb-4 pt-2 border-t border-blue-200 dark:border-blue-500/50">
          <p className="text-muted-foreground text-sm">
            As energy code specialists, we provide technical support and applicant guidance—so you can focus on reviewing complete, code-aligned submissions.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}