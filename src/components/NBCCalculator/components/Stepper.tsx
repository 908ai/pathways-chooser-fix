import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const Stepper = ({ steps, currentStep, onStepClick }: StepperProps) => {
  return (
    <div className="lg:sticky top-0 z-30 bg-slate-800/50 backdrop-blur-lg -mx-5 -mt-5 mb-8 px-5 py-4 rounded-t-lg border-b border-slate-400/50">
      <div className="flex items-center justify-center w-full max-w-3xl mx-auto">
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
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-slate-700 border-slate-600 text-slate-300"
                  )}
                >
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : stepNumber}
                </div>
                <p
                  className={cn(
                    "mt-2 text-sm font-medium transition-colors duration-300",
                    isActive || isCompleted ? "text-white" : "text-slate-400"
                  )}
                >
                  {step}
                </p>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 transition-colors duration-500",
                    isCompleted ? "bg-green-500" : "bg-slate-600"
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