import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoButtonProps {
    title: string;
    children: React.ReactNode;
    dialogClassName?: string;
    className?: string;
    iconClassName?: string;
    size?: 'default' | 'large';
}

const InfoButton: React.FC<InfoButtonProps> = ({ title, children, dialogClassName, className, iconClassName, size = 'default' }) => {
    const buttonSizes = {
        default: "h-6 w-6",
        large: "h-10 w-10"
    };
    const iconSizes = {
        default: "h-5 w-5",
        large: "h-8 w-8"
    };

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className={cn("hover:bg-blue-500/20", buttonSizes[size], className)}>
                            <Info className={cn("text-primary-foreground fill-primary", iconSizes[size], iconClassName)} />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>More Info</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent className={cn("max-w-4xl max-h-[80vh] overflow-y-auto", dialogClassName)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InfoButton;