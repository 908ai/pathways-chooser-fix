import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function WarningButton({
  title,
  children,
  variant = "warning",
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  variant?: "warning" | "destructive";
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "p-2 border rounded-lg",
        variant === "warning"
          ? "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-500/50"
          : "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-500/50"
      )}
    >
      <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
        <span
          className={cn(
            "text-xs font-bold",
            variant === "warning" ? "text-orange-800 dark:text-orange-300" : "text-red-800 dark:text-red-300"
          )}
        >
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-300",
            isOpen ? "rotate-180" : "",
            variant === "warning" ? "text-orange-700 dark:text-orange-400" : "text-red-700 dark:text-red-400"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
        <div
          className={cn(
            "text-xs",
            variant === "warning" ? "text-orange-700 dark:text-orange-300" : "text-red-700 dark:text-red-300"
          )}
        >
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}