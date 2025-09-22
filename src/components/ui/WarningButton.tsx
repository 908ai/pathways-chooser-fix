"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export const WarningButton = ({
  title,
  children,
  variant = "warning",
  defaultOpen = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  variant?: "warning" | "destructive";
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const bgColor =
    variant === "warning"
      ? "bg-gradient-to-r from-slate-800/60 to-teal-800/60"
      : "bg-gradient-to-r from-slate-800/60 to-red-800/60";

  const borderColor =
    variant === "warning"
      ? "border border-orange-400"
      : "border-2 border-red-400";

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`p-2 ${bgColor} ${borderColor} rounded-lg backdrop-blur-sm`}
    >
      <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
        <span className="text-xs font-bold text-white">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
        <div className="text-white text-xs">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
