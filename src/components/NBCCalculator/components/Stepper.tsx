import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  isSticky?: boolean;
}

const Stepper = ({ steps, currentStep, onStepClick, isSticky = false }: StepperProps) => {
  return (
    <div className={cn(
      "lg:sticky top-[100px] z-30 backdrop-blur-lg -mx-4 -mt-8 mb-8 px-4 py-4 rounded-t-lg border-b border-border transition-all duration-300",
      isSticky ? "bg-background/90" : "bg-background/50"
    )}>
      <div className="flex items-start justify-center w-full max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isClickable = stepNumber < currentStep;

          return (
            <React.Fragment key={step}>
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable && !isActive}
                className={cn(
                  "flex flex-col items-center text-center w-36 transition-opacity",
                  isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "bg-primary border-primary/50 text-primary-foreground"
                      : "bg-muted border-border text-muted-foreground",
                    isSticky ? "w-6 h-6" : "w-10 h-10"
                  )}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                </div>
                <p
                  className={cn(
                    "mt-2 font-medium transition-all duration-300",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground",
                    isSticky ? "text-xs" : "text-xs"
                  )}
                >
                  {step}
                </p>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 transition-all duration-500",
                    isCompleted ? "bg-green-500" : "bg-border",
                    isSticky ? "mt-3" : "mt-5"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;