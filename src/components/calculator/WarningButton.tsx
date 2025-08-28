import React from 'react';

interface WarningButtonProps {
    warningId: string;
    title: string;
    children: React.ReactNode;
    variant?: "warning" | "destructive";
    expandedWarnings: { [key: string]: boolean };
    toggleWarning: (warningId: string) => void;
}

const WarningButton: React.FC<WarningButtonProps> = ({
    warningId,
    title,
    children,
    variant = "warning",
    expandedWarnings,
    toggleWarning
}) => {
    const isExpanded = expandedWarnings[warningId];
    const bgColor = variant === "warning" ? "bg-gradient-to-r from-slate-800/60 to-teal-800/60" : "bg-gradient-to-r from-slate-800/60 to-red-800/60";
    const borderColor = variant === "warning" ? "border-2 border-orange-400" : "border-2 border-red-400";
    
    return (
        <div className={`p-4 ${bgColor} ${borderColor} rounded-lg backdrop-blur-sm`}>
            <button onClick={() => toggleWarning(warningId)} className="flex items-center gap-3 w-full text-left">
                <span className="text-lg font-bold text-white">
                    {title}
                </span>
            </button>
            {isExpanded && (
                <div className="mt-4 animate-accordion-down">
                    <div className="text-white font-semibold">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarningButton;