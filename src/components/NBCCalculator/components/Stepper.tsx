import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Building, Edit, Pencil } from "lucide-react";
import { PATHWAY_CONFIG } from "@/components/NBCCalculator/utils/pathwayConfig";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  isSticky?: boolean;

  projectName?: string;
  compliancePath?: string;
  isEditing?: boolean;

  buildingType?: string;
  climateZone?: string;
}

/* -----------------------------
 * Subcomponents (internal)
 * ----------------------------- */

const EditBadge = () => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600/40 text-yellow-800 dark:text-yellow-200 text-xs font-medium whitespace-nowrap">
    <Edit className="h-3.5 w-3.5" />
    You're Editing this Project
  </div>
);

const PathwayBadge = ({
  compliancePath,
  isSticky,
}: {
  compliancePath: string;
  isSticky?: boolean;
}) => {
  const config = PATHWAY_CONFIG[compliancePath];
  if (!config) return null;

  const { icon: Icon, label, colorClass } = config;

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <Icon className={cn("h-4 w-4", colorClass)} />
      <span className={isSticky ? "text-xs" : "text-sm"}>
        {label}
      </span>
    </div>
  );
};

const TechnicalContext = ({
  buildingType,
  climateZone,
  isSticky,
}: {
  buildingType?: string;
  climateZone?: string;
  isSticky?: boolean;
}) => {
  if (!buildingType && !climateZone) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 text-muted-foreground",
        isSticky ? "text-[11px]" : "text-xs"
      )}
    >
      {buildingType && <span>{buildingType}</span>}

      {buildingType && climateZone && <span className="opacity-60">·</span>}

      {climateZone && <span>Climate Zone {climateZone}</span>}
    </div>
  );
};

/* -----------------------------
 * Main Component
 * ----------------------------- */

const Stepper = ({
  steps,
  currentStep,
  onStepClick,
  isSticky = false,
  projectName,
  compliancePath,
  isEditing,
  buildingType,
  climateZone,
}: StepperProps) => {
  return (
    <div
      className={cn(
        "lg:sticky top-[100px] z-30 backdrop-blur-lg",
        "-mx-4 -mt-8 mb-8 px-4 pt-4 pb-0",
        "rounded-t-lg border-b border-border transition-all duration-300",
        isSticky ? "bg-background/90" : "bg-background/50"
      )}
    >
      {/* -----------------------------
       * Stepper (progress)
       * ----------------------------- */}
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
                  isClickable
                    ? "cursor-pointer hover:opacity-80"
                    : "cursor-default"
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
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>

                <p
                  className={cn(
                    "mt-2 font-medium transition-all duration-300 text-xs",
                    isActive || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
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

      {/* -----------------------------
       * Context Bar
       * ----------------------------- */}
      <div
        className={cn(
          "border-t border-border bg-muted/40 px-4 py-2 mt-2",
          "-mx-[15px]",
          "flex flex-col items-center gap-1"
        )}
      >
        {isEditing && <EditBadge />}

        {/* Project line */}
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-2 font-medium text-foreground",
            isSticky ? "text-xs" : "text-sm"
          )}
        >
          <Building
            className={cn(
              "shrink-0 text-blue-500",
              isSticky ? "h-3 w-3" : "h-4 w-4"
            )}
          />

          <span className="truncate max-w-[420px]">
            {projectName || "Draft Project"}
          </span>

          {/* Edit project → Step 1 */}
          {currentStep >= 2 && (
            <button
              type="button"
              onClick={() => onStepClick(1)}
              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Edit project information"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Pathway */}
          {compliancePath && (
            <>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <PathwayBadge
                compliancePath={compliancePath}
                isSticky={isSticky}
              />

              {/* Edit pathway → Step 2 */}
              {currentStep >= 3 && (
                <button
                  type="button"
                  onClick={() => onStepClick(2)}
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit compliance pathway"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Technical context */}
        <TechnicalContext
          buildingType={buildingType}
          climateZone={climateZone}
          isSticky={isSticky}
        />
      </div>
    </div>
  );
};

export default Stepper;
