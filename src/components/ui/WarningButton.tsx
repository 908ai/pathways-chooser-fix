import React, { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarningButtonProps {
    title: React.ReactNode;
    children: React.ReactNode;
    variant?: "warning" | "destructive";
    defaultOpen?: boolean;
}

const WarningButton: React.FC<WarningButtonProps> = ({
    title,
    children,
    variant = "warning",
    defaultOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const bgColor = variant === "warning" ? "bg-orange-50" : "bg-red-50";
    const borderColor = variant === "warning" ? "border-orange-200" : "border-red-200";
    const titleColor = variant === "warning" ? "text-orange-800" : "text-red-800";
    const iconColor = variant === "warning" ? "text-orange-700" : "text-red-700";
    const contentColor = variant === "warning" ? "text-orange-700" : "text-red-700";

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("p-4 rounded-lg border", bgColor, borderColor)}>
            <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
                <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("h-4 w-4", iconColor)} />
                    <span className={cn("font-semibold", titleColor)}>{title}</span>
                </div>
                <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", iconColor, isOpen ? "rotate-180" : "")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                <div className={cn("text-sm space-y-2", contentColor)}>
                    {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

export { WarningButton };