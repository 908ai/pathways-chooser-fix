import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function WarningButton({
  warningId,
  title,
  children,
  variant = "warning",
  defaultOpen = false,
}: {
  warningId: string;
  title: string;
  children: React.ReactNode;
  variant?: "warning" | "destructive";
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const baseClasses = "p-2 border rounded-lg";
  const variantClasses = {
    warning: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/30 dark:border-orange-500/50 dark:text-orange-300",
    destructive: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-300",
  };
  const iconColor = variant === "warning" ? "text-orange-700 dark:text-orange-400" : "text-red-700 dark:text-red-400";
  const contentColor = variant === "warning" ? "text-orange-700 dark:text-orange-300" : "text-red-700 dark:text-red-300";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn(baseClasses, variantClasses[variant])}>
      <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
        <span className="text-xs font-bold">{title}</span>
        <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", isOpen ? "rotate-180" : "", iconColor)} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
        <div className={cn("text-xs", contentColor)}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}