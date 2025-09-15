import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="flex items-center justify-center mb-8 w-full max-w-3xl mx-auto">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center w-36">
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
            </div>
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
  );
};

export default Stepper;