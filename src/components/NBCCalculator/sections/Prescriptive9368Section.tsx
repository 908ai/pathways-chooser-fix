import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, ChevronDown, Search } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { validateRSI, validateRSI_9362 } from "../utils/validation";
import { EffectiveRSIWarning } from "@/components/NBCCalculator/components/EffectiveRSIWarning";

import {
    wallRSIOptions,
    windowUValueOptions,
    belowGradeRSIOptions,
    airtightnessOptions,
    hrvOptions,
    waterHeaterOptions,
    airtightnessOptions_7B
} from "../../NBCCalculator/constants/options";

interface Props {
    selections: any;
    setSelections: React.Dispatch<React.SetStateAction<any>>;
    validationErrors: Record<string, boolean>;
    handleFileUploadRequest: (file: File) => Promise<void>;
    uploadedFiles: File[];
    removeFile: (file: File) => void;
}

const heatPumpOptions = [
    { value: "Air-Source Heat Pump – Split (SEER 14.5, EER 11.5, HSPF 7.1)", label: "Air-Source Heat Pump – Split (SEER 14.5, EER 11.5, HSPF 7.1)" },
    { value: "Air-Source Heat Pump – Single Package (SEER 14.0, EER 11.0, HSPF 7.0)", label: "Air-Source Heat Pump – Single Package (SEER 14.0, EER 11.0, HSPF 7.0)" },
    { value: "Ground-Source Heat Pump – Closed Loop (COPc ≥ 3.6, COPh ≥ 3.1)", label: "Ground-Source Heat Pump – Closed Loop (COPc ≥ 3.6, COPh ≥ 3.1)" },
    { value: "Ground-Source Heat Pump – Open Loop (COPc ≥ 4.75, COPh ≥ 3.6)", label: "Ground-Source Heat Pump – Open Loop (COPc ≥ 4.75, COPh ≥ 3.6)" },
    { value: "Other", label: "Other (Manual Entry Required)" }
];

export default function Prescriptive9368Section({
    selections,
    setSelections,
    validationErrors,
    handleFileUploadRequest,
    uploadedFiles,
    removeFile,
}: Props) {
    const InfoCollapsible = ({
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
        
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn(
                "p-2 border rounded-lg",
                variant === "warning" 
                    ? "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-500/50" 
                    : "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-500/50"
            )}>
                <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
                    <span className={cn(
                        "text-xs font-bold",
                        variant === "warning" ? "text-orange-800 dark:text-orange-300" : "text-red-800 dark:text-red-300"
                    )}>{title}</span>
                    <ChevronDown className={cn(
                        "h-5 w-5 transition-transform duration-300",
                        isOpen ? "rotate-180" : "",
                        variant === "warning" ? "text-orange-700 dark:text-orange-400" : "text-red-700 dark:text-red-400"
                    )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                    <div className={cn(
                        "text-xs",
                        variant === "warning" ? "text-orange-700 dark:text-orange-300" : "text-red-700 dark:text-red-300"
                    )}>{children}</div>
                </CollapsibleContent>
            </Collapsible>
        );
    };

    // --------------------------------------------------
    // 9368 requires HRV/ERV (force state to avoid invalid drafts)
    // --------------------------------------------------
    useEffect(() => {
        if (selections.compliancePath === "9368" && selections.hasHrv !== "with_hrv") {
            setSelections((prev: any) => ({
                ...prev,
                hasHrv: "with_hrv"
            }));
        }
    }, [selections.compliancePath]);

    // Get filtered airtightness options based on building type and climate zone
    const getFilteredAirtightnessOptions = () => {
        const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
        const isSingleDetachedBuildingType = selections.buildingType === "single-detached" || selections.buildingType === "single-detached-secondary";
        const baseOptions = isZone7B ? airtightnessOptions_7B : airtightnessOptions;

        // For single-detached homes, only show AL-1B through AL-6B (unguarded testing)
        // For multi-unit/townhouse, show both AL-1A through AL-5A and AL-1B through AL-6B
        if (isSingleDetachedBuildingType) {
            return baseOptions.filter(option => option.value.includes('B'));
        }
        return baseOptions;
    };

    const WarningButton = ({
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
    }) => {
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
    };    

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Ceiling/Attic Insulation */}
                <div id="ceilingsAtticRSI" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Effective RSI - Ceilings below Attics <span className="text-red-400">*</span></label>
                    <Input type="text" placeholder={selections.compliancePath === "9368" ? "Min RSI 8.67 (R-49.2) with HRV" : selections.hasHrv === "with_hrv" ? "Min RSI 8.67 (R-49.2) with HRV" : selections.hasHrv === "without_hrv" ? "Min RSI 10.43 (R-59.2) without HRV" : "Min RSI 8.67 (R-49.2) with HRV, 10.43 (R-59.2) without HRV"} value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        ceilingsAtticRSI: e.target.value
                    }))} className={cn(validationErrors.ceilingsAtticRSI && "border-red-500 ring-2 ring-red-500")} />
                    {(() => {
                        if (selections.compliancePath === "9368") {
                            const minRSI = 8.67; // For 9368, HRV is mandatory
                            const validation = validateRSI_9362(selections.ceilingsAtticRSI, minRSI, `ceilings below attics`);
                            if (!validation.isValid && validation.warning) {
                                return <InfoCollapsible title="🛑 RSI Value Too Low" variant="destructive" defaultOpen={true}>
                                    <p className="text-xs">
                                        {`The RSI value must be increased to at least ${minRSI} to meet NBC 9.36.8 requirements.`}
                                    </p>
                                </InfoCollapsible>;
                            }
                            return null;
                        }

                        // Existing validation for other paths
                        console.log("Ceilings validation debug:", {
                            ceilingsAtticRSI: selections.ceilingsAtticRSI,
                            hasHrv: selections.hasHrv,
                            parsedValue: parseFloat(selections.ceilingsAtticRSI || "0"),
                            minRSI: selections.hasHrv === "with_hrv" ? 8.67 : 10.43
                        });
                        const minRSI = selections.hasHrv === "with_hrv" ? 8.67 : selections.hasHrv === "without_hrv" ? 10.43 : 8.67;
                        const validation = validateRSI(selections.ceilingsAtticRSI, minRSI, `ceilings below attics ${selections.hasHrv === "with_hrv" ? "with HRV" : "without HRV"}`);
                        if (!validation.isValid && validation.warning) {
                            return <InfoCollapsible title={validation.warning.type === "rvalue-suspected" ? "R-Value Detected" : "RSI Value Too Low"} variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}>
                                <p className="text-sm">
                                    {validation.warning.message}
                                </p>
                            </InfoCollapsible>;
                        }
                        return null;
                    })()}
                    <EffectiveRSIWarning />
                </div>

                {/* Wall Insulation */}
                <div id="wallRSI" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Above Grade Walls - RSI Value <span className="text-red-400">*</span></label>
                    <Select value={selections.wallRSI} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        wallRSI: value
                    }))}>
                        <SelectTrigger className={cn(validationErrors.wallRSI && "border-red-500 ring-2 ring-red-500")}>
                            <SelectValue placeholder="Select wall insulation level" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                            {wallRSIOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label} ({option.points} points)
                            </SelectItem>)}
                        </SelectContent>
                    </Select>
                    <EffectiveRSIWarning />
                </div>

                {/* Below Grade Walls */}
                <div id="belowGradeRSI" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Below Grade Walls - RSI Value <span className="text-red-400">*</span></label>
                    <Select value={selections.belowGradeRSI} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        belowGradeRSI: value
                    }))}>
                        <SelectTrigger className={cn(validationErrors.belowGradeRSI && "border-red-500 ring-2 ring-red-500")}>
                            <SelectValue placeholder="Select below grade insulation" />
                        </SelectTrigger>
                        <SelectContent>
                            {belowGradeRSIOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label} ({option.points} points)
                            </SelectItem>)}
                        </SelectContent>
                    </Select>
                    <EffectiveRSIWarning />
                </div>

                {/* Windows */}
                <div id="windowUValue" className="space-y-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Windows - U-Value <span className="text-red-400">*</span></label>
                        <InfoButton title="Energy Efficiency Points for Windows & Doors">
                            <div className="space-y-4">
                                <p className="text-sm">
                                    You can get extra energy efficiency points in the code if your windows and doors perform better than the minimum required by the building code (NBC 9.36). This means they either keep heat in better (low U-value) or let in helpful sunlight to reduce heating needs (high Energy Rating or ER).
                                </p>

                                <p className="text-sm">
                                    But to use the Energy Rating (ER) method for windows or doors, the total glass/opening area on that wall must be less than 17% of the wall's area. The example in the image shows how to calculate that percentage:
                                </p>

                                <ul className="list-disc ml-5 space-y-1 text-sm">
                                    <li>The wall is 48 m²</li>
                                    <li>The total area of the windows and doors is 7.75 m²</li>
                                    <li>7.75 ÷ 48 × 100 = 16%, so this wall qualifies for ER-based compliance.</li>
                                </ul>

                                <p className="text-sm">
                                    If the openings are over 17%, you usually have to use U-values instead and follow a trade-off approach.
                                </p>

                                <div className="border-t pt-4">
                                    <h5 className="font-medium mb-2">Why this matters:</h5>
                                    <ul className="list-disc ml-5 space-y-1 text-sm">
                                        <li>ER is good for cold climates – it considers how much sun a window lets in to help heat the home, along with how well it insulates and how airtight it is.</li>
                                        <li>U-value only looks at insulation, not sun or air leaks.</li>
                                        <li>Using ER lets you use things like patio doors or south-facing windows that bring in sun, even if their U-value isn't great—as long as they don't make up too much of the wall.</li>
                                    </ul>
                                </div>

                                <div className="border-t pt-4">
                                    <img src="/lovable-uploads/7665f3ac-355b-4715-9121-ae5d822bc1f0.png" alt="Figure 9.36-20: Example of how to calculate the percent fenestration area" className="w-full h-auto border rounded" />
                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                        Source: Housing and Small Buildings Illustrated User's Guide National Building Code of Canada 2020
                                    </p>
                                </div>
                            </div>
                        </InfoButton>
                    </div>
                    <Select value={selections.windowUValue} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        windowUValue: value
                    }))}>
                        <SelectTrigger className={cn(validationErrors.windowUValue && "border-red-500 ring-2 ring-red-500")}>
                            <SelectValue placeholder="Select window performance" />
                        </SelectTrigger>
                        <SelectContent>
                            {windowUValueOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label} ({option.points} points)
                            </SelectItem>)}
                        </SelectContent>
                    </Select>

                    <InfoCollapsible title="ℹ️ Window & Door Performance Verification">
                        <p className="text-muted-foreground">
                            Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please record the range of lowest-highest performing window and door U-Value’s (ie, U-value W/(m²×).
                        </p>
                        <p className="text-muted-foreground mt-2">
                            See below an illustrative example of a window unit showing the performance values that must be recorded in the Window & Door Schedule.
                        </p>
                        <img src="/assets/img/window-door-uvalue-example.png" alt="Window & Door Performance Example" className="mt-4 rounded-md border mx-auto block" />
                    </InfoCollapsible>
                    {selections.windowUValue && <>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-foreground">Energy Efficiency Points for Windows & Doors</label>
                            <InfoButton title="Energy Efficiency Points for Windows & Doors">
                                <div className="space-y-4">
                                    <p className="text-sm text-foreground/80">
                                        You can get extra energy efficiency points in the code if your windows and doors perform better than the minimum required by the building code (NBC 9.36). This means they either keep heat in better (low U-value) or let in helpful sunlight to reduce heating needs (high Energy Rating or ER).
                                    </p>

                                    <p className="text-sm text-foreground/80">
                                        But to use the Energy Rating (ER) method for windows or doors, the total glass/opening area on that wall must be less than 17% of the wall's area. The example in the image shows how to calculate that percentage:
                                    </p>

                                    <ul className="list-disc ml-5 space-y-1 text-sm text-foreground/80">
                                        <li>The wall is 48 m²</li>
                                        <li>The total area of the windows and doors is 7.75 m²</li>
                                        <li>7.75 ÷ 48 × 100 = 16%, so this wall qualifies for ER-based compliance.</li>
                                    </ul>

                                    <p className="text-sm text-foreground/80">
                                        If the openings are over 17%, you usually have to use U-values instead and follow a trade-off approach.
                                    </p>

                                    <div className="border-t pt-4">
                                        <h5 className="font-medium mb-2">Why this matters:</h5>
                                        <ul className="list-disc ml-5 space-y-1 text-sm text-foreground/80">
                                            <li>ER is good for cold climates – it considers how much sun a window lets in to help heat the home, along with how well it insulates and how airtight it is.</li>
                                            <li>U-value only looks at insulation, not sun or air leaks.</li>
                                            <li>Using ER lets you use things like patio doors or south-facing windows that bring in sun, even if their U-value isn't great—as long as they don't make up too much of the wall.</li>
                                        </ul>
                                    </div>

                                    <div className="border-t pt-4">
                                        <img src="/lovable-uploads/7665f3ac-355b-4715-9121-ae5d822bc1f0.png" alt="Figure 9.36-20: Example of how to calculate the percent fenestration area" className="w-full h-auto border rounded" />
                                        <p className="text-xs text-muted-foreground mt-2 italic">
                                            Source: Housing and Small Buildings Illustrated User's Guide National Building Code of Canada 2020
                                        </p>
                                    </div>
                                </div>
                            </InfoButton>
                        </div>
                    </>}
                </div>

                {/* Airtightness */}
                <div id="airtightness" className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground">Airtightness Level <span className="text-red-400">*</span></label>
                        <InfoButton title="What's a Blower Door Test?">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                                </div>

                                <div className="w-full h-px bg-muted"></div>

                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-medium text-sm mb-2">What Do the Numbers Mean?</h5>
                                        <div className="space-y-3 text-sm text-muted-foreground">
                                            <div>
                                                <p className="font-medium">• ACH₅₀ (Air Changes per Hour @ 50 Pa):</p>
                                                <p className="ml-4">How many times the air inside the home is replaced in one hour.</p>
                                                <p className="ml-4">Lower is better — ≤1.0 is common for Net Zero Ready homes.</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">• NLA₁₀ (Normalized Leakage Area):</p>
                                                <p className="ml-4">Total leak area per square metre of envelope.</p>
                                                <p className="ml-4">Think: "This building leaks like it has a 10 cm² hole per m² of wall."</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">• NLR₅₀ (Normalized Leakage Rate):</p>
                                                <p className="ml-4">Volume of air leaking per second per m² of surface at 50 Pa.</p>
                                                <p className="ml-4">Useful for comparing attached units or small zones.</p>
                                            </div>
                                            <p className="font-medium text-primary">Lower values = tighter home = better performance</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">What's a Zone?</h5>
                                        <p className="text-sm text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                        <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                            <p>• A full detached house</p>
                                            <p>• A single unit in a row house or duplex</p>
                                            <p>• A section of a large home or multi-unit building</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">What's an Attached Zone?</h5>
                                        <p className="text-sm text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">Why Small Units Often Show Higher Leakage</h5>
                                        <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                            <p>• Small homes have more corners and connections relative to their size.</p>
                                            <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                            <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">Guarded vs. Unguarded Testing</h5>
                                        <div className="space-y-3 text-sm text-muted-foreground">
                                            <div>
                                                <p className="font-medium">Unguarded Test</p>
                                                <div className="ml-4 space-y-1">
                                                    <p>• Tests one unit at a time, while neighbours are at normal pressure.</p>
                                                    <p>• Includes leakage between units.</p>
                                                    <p>• Easier to do (especially as units are completed and occupied), but can overestimate leakage.</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium">Guarded Test</p>
                                                <div className="ml-4 space-y-1">
                                                    <p>• All adjacent units are depressurized (or pressurized) at the same time.</p>
                                                    <p>• Blocks airflow between units, giving a more accurate picture of leakage to the outside.</p>
                                                    <p>• Ideal for multi-unit buildings, but more complex.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">How Do You Pass?</h5>
                                        <p className="text-sm text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                        <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                            <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                            <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">Other Key Points</h5>
                                        <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                            <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                            <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                            <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different. Reference the Illustrated Guide for the image above.</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">Potential Air Leakage Locations</h5>
                                        <p className="text-sm text-muted-foreground mb-3">Common areas where air leakage occurs in buildings:</p>
                                        <div className="mb-3">
                                            <img src="/lovable-uploads/9d231144-3c4e-430b-9f8c-914698eae23e.png" alt="Figure 9.25-9 Potential air leakage locations in a house showing various points where air can escape including joints at attic hatches, ceiling light fixtures, windows, electrical outlets, around posts and columns, chimney leaks, plumbing stack penetrations, and more" className="w-full h-auto border border-border rounded" onLoad={() => console.log('Air leakage diagram loaded successfully')} onError={e => console.log('Failed to load air leakage diagram:', e)} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Figure 9.25-9 from Housing and Small Buildings - Illustrated User's Guide, National Building Code of Canada 2020, Part 9 of Division B
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2 dark:bg-blue-900/30 dark:border-blue-500/50">
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">📋 Helpful Resources:</p>
                                        <div className="space-y-1">
                                            <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 dark:text-blue-400 hover:text-red-800 dark:hover:text-red-400 block">
                                                🔗 View the Blower Door Checklist
                                            </a>
                                            <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 dark:text-blue-400 hover:text-red-800 dark:hover:text-red-400 block">
                                                🔗 More airtightness information
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InfoButton>
                    </div>
                    <Select value={selections.airtightness} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        airtightness: value
                    }))}>
                        <SelectTrigger className={cn(validationErrors.airtightness && "border-red-500 ring-2 ring-red-500")}>
                            <SelectValue placeholder="Select air-tightness level" />
                        </SelectTrigger>
                        <SelectContent>
                            {getFilteredAirtightnessOptions().map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label} ({option.points} points)
                            </SelectItem>)}
                        </SelectContent>
                    </Select>

                    <InfoCollapsible title="⚠️ Caution: Air-Tightness Targets Without Testing History">
                        <div className="text-xs text-muted-foreground space-y-2">
                            <p>
                                Choosing an air-tightness target lower than prescribed by NBC2020 without prior test results is risky.
                            </p>
                            <p>
                                We strongly recommend having at least 4–5 blower door tests from similar builds to know what levels you can reliably achieve.
                            </p>
                            <p>
                                If your final blower door test doesn't meet the target you've claimed, you could:
                            </p>
                            <ul className="list-disc ml-4 space-y-1">
                                <li>Miss required performance metrics</li>
                                <li>Be denied a permit or occupancy</li>
                                <li>Face expensive late-stage upgrades or rework</li>
                            </ul>
                            <p>
                                <strong>Tip:</strong> Track airtightness results across all projects to set realistic targets, reduce build costs & optimize performance from day one.
                            </p>
                            <div className="flex items-center gap-1 text-sm mt-3">
                                <span>🔗</span>
                                <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                    More information
                                </a>
                            </div>
                        </div>
                    </InfoCollapsible>

                    {/* Multi-Unit Exercise */}
                    <div className="space-y-3 pt-4 border-t border-border/20">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-emerald-50/80 border-emerald-300/50 hover:bg-emerald-100/80 hover:border-emerald-400/60 backdrop-blur-sm dark:bg-emerald-900/30 dark:border-emerald-500/50 dark:hover:bg-emerald-900/50">
                                    Learn more about points allocation for air-townhouse for MURB/Row/Town-homes
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[700px] max-h-[80vh] overflow-y-auto p-4" >
                                <DialogHeader>
                                    <DialogTitle>Understanding Airtightness Levels & Points: 4-Unit Row House Scenario</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">We're showing how a builder can earn energy efficiency points by improving airtightness—that is, how well a building keeps outside air from leaking in (or inside air from leaking out).</p>
                                        <p className="text-sm text-muted-foreground mt-2">Even though we're mainly focusing on single detached homes today, we're using a 4-unit row house in this example to show how things can get a bit more complex in real-world multi-unit builds.</p>
                                    </div>

                                    {/* Diagram */}
                                    <div className="bg-muted/30 p-3 rounded-md">
                                        <img src="/lovable-uploads/9fef7011-6de1-412c-9331-2c6f86f64d18.png" alt="Figure 9.36.-18: Example of attached zones" className="w-full max-w-md mx-auto" />
                                        <p className="text-xs text-muted-foreground text-center mt-2">Figure 9.36.-18: Example of attached zones</p>
                                        <p className="text-xs text-muted-foreground text-center mt-1 italic">Source: Housing and Small Buildings Illustrated User's Guide - National Building Code of Canada 2020 Part 9 of Division B</p>
                                    </div>


                                    {/* Test Results Table */}
                                    <div>
                                        <h5 className="font-medium text-sm mb-3">Test Results for an Example 4 Unit Row House in Climate Zone 7A (Unguarded)</h5>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-border text-sm">
                                                <thead>
                                                    <tr className="bg-muted/50">
                                                        <th className="border border-border p-2 text-left font-medium">Metric</th>
                                                        <th className="border border-border p-2 text-center font-medium">Left End House</th>
                                                        <th className="border border-border p-2 text-center font-medium">Left Middle House</th>
                                                        <th className="border border-border p-2 text-center font-medium">Right Middle House</th>
                                                        <th className="border border-border p-2 text-center font-medium">Right End House</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border border-border p-2 font-medium bg-muted/30">ACH</td>
                                                        <td className="border border-border p-2 text-center">1.49</td>
                                                        <td className="border border-border p-2 text-center">2.01</td>
                                                        <td className="border border-border p-2 text-center">1.95</td>
                                                        <td className="border border-border p-2 text-center">1.51</td>
                                                    </tr>
                                                    <tr className="bg-muted/20">
                                                        <td className="border border-border p-2 font-medium bg-muted/30">NLA</td>
                                                        <td className="border border-border p-2 text-center">0.97</td>
                                                        <td className="border border-border p-2 text-center">1.29</td>
                                                        <td className="border border-border p-2 text-center">1.24</td>
                                                        <td className="border border-border p-2 text-center">0.95</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-border p-2 font-medium bg-muted/30">NRL</td>
                                                        <td className="border border-border p-2 text-center">0.57</td>
                                                        <td className="border border-border p-2 text-center">0.75</td>
                                                        <td className="border border-border p-2 text-center">0.79</td>
                                                        <td className="border border-border p-2 text-center">0.6</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">Key Rules to Know:</h5>
                                        <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                            <p>• Builders can skip the prescriptive air barrier checklist (NBC 9.36.2.10) if they do a blower door test and meet certain airtightness levels.</p>
                                            <p>• In multi-unit buildings, each unit is tested individually, but the worst score of all the units is what counts for code and points.</p>
                                            <p>• To earn points, the results must at least meet AL-1B (if unguarded testing is used).</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">This Example:</h5>
                                        <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                            <p>• <strong>Project:</strong> 4-unit row house in Prince Albert (Zone 7A)</p>
                                            <p>• <strong>Goal:</strong> Reach Tier 2 compliance, which needs 10 total points</p>
                                            <p>• <strong>Already earned:</strong> 6.7 points from well-insulated above-grade walls</p>
                                            <p>• <strong>Need:</strong> 3.3 more points — aiming to get them from airtightness</p>
                                            <p>• <strong>Test type used:</strong> Unguarded, because units will be occupied at different times</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">Test Results (Worst Values):</h5>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs border-collapse border border-border">
                                                <thead>
                                                    <tr className="bg-muted/50">
                                                        <th className="border border-border p-2 text-left font-medium">Metric</th>
                                                        <th className="border border-border p-2 text-left font-medium">Worst Unit Result</th>
                                                        <th className="border border-border p-2 text-left font-medium">AL- Target (From NBC Table 9.36.-B)</th>
                                                        <th className="border border-border p-2 text-left font-medium">Airtightness Level Met</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border border-border p-2 font-medium">ACH</td>
                                                        <td className="border border-border p-2">2.01 (Left Middle)</td>
                                                        <td className="border border-border p-2">AL-3B = 2.0 max</td>
                                                        <td className="border border-border p-2 text-destructive font-medium">Fails AL-3B → drops to AL-2B</td>
                                                    </tr>
                                                    <tr className="bg-muted/20">
                                                        <td className="border border-border p-2 font-medium">NLA</td>
                                                        <td className="border border-border p-2">1.29 (Left Middle)</td>
                                                        <td className="border border-border p-2">AL-3B = 1.28 max</td>
                                                        <td className="border border-border p-2 text-destructive font-medium">Fails AL-3B → drops to AL-2B</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-border p-2 font-medium">NRL</td>
                                                        <td className="border border-border p-2">0.79 (Right Middle)</td>
                                                        <td className="border border-border p-2">AL-3B = 0.78 max</td>
                                                        <td className="border border-border p-2 text-destructive font-medium">Fails AL-3B → drops to AL-2B</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2 italic">Even though the differences are tiny, the worst score in each category is just above the AL-3B thresholds, so the builder can only claim AL-2B.</p>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-2">Outcome:</h5>
                                        <div className="text-sm text-muted-foreground ml-4 space-y-2">
                                            <p>• Builder cannot claim points for AL-3B or higher.</p>
                                            <p>• Based on AL-2B, they'd earn fewer points (you'd refer to your compliance table for exact value, but likely not enough to hit 10 points total).</p>
                                            <p>• So if the builder wants to stay on track for Tier 2, they need to:</p>
                                            <div className="ml-4 space-y-1">
                                                <p>• Tighten up the leakiest unit(s) (especially Left Middle and Right Middle)</p>
                                                <p>• To stay on track for Tier 2, they could invest in Aerobarrier (air-sealing system) as well</p>
                                                <p>• Or look for other upgrades (e.g. better windows, mechanical systems) to make up the missing points</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/30 dark:border-blue-500/50">
                                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300">💡 Key Takeaways:</p>
                                        <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                                            <p>• In multi-unit buildings, one poorly-performing unit can impact the entire project's compliance. This is why consistent construction quality and testing across all units is critical for achieving energy efficiency targets.</p>
                                            <p>• Having some air-tightness results from previous projects to apply and guide decision-making for this particular project would reduce risk and ensure that costly changes don't have to happen if the air-leakage targets aren't met.</p>
                                            <p>• Alternatively, performance energy modelling would have likely also met the performance requirements with a lower overall build cost and less risk if they had started down that path to begin with.</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Mid-Construction Blower Door Test Checkbox */}
                    <div className="space-y-3 pt-4 border-t border-border/20">
                        <div className="flex items-start gap-3">
                            <input type="checkbox" id="midConstructionBlowerDoor-9368" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                                ...prev,
                                midConstructionBlowerDoorPlanned: e.target.checked
                            }))} className="w-4 h-4 text-primary mt-1" />
                            <div className="flex-1">
                                <label htmlFor="midConstructionBlowerDoor-9368" className="text-sm font-medium cursor-pointer text-foreground">
                                    Mid-Construction Blower Door Test Planned (Optional)
                                </label>
                            </div>
                            <Button asChild variant="secondary" className="h-6 px-2 text-xs">
                                <a href="/find-a-provider" target="_blank" rel="noopener noreferrer">
                                    <Search className="h-4 w-4" />
                                    Find a service provider
                                </a>
                            </Button>
                        </div>

                        <InfoCollapsible title="ℹ️ Benefits of Mid-Construction Blower Door Testing">
                            <div className="text-xs text-muted-foreground space-y-2">
                                <p className="font-medium">Benefits of a mid-construction (misconstruction) blower door test:</p>
                                <ul className="list-disc ml-4 space-y-1">
                                    <li>Identifies air leaks early so they can be sealed before drywall.</li>
                                    <li>Reduces costly rework later in the build.</li>
                                    <li>Improves energy performance, helping meet code or rebate targets.</li>
                                    <li>Enhances durability by minimizing moisture movement through assemblies.</li>
                                    <li>Ensures proper placement of air barrier details.</li>
                                    <li>Supports better HVAC sizing with more accurate airtightness data.</li>
                                </ul>
                                <div className="flex items-center gap-1 text-sm mt-3">
                                    <span>📄</span>
                                    <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                        View the Blower Door Checklist
                                    </a>
                                </div>
                                <div className="flex items-center gap-1 text-sm mt-3">
                                    <span>▶️</span>
                                    <a href="https://www.youtube.com/watch?v=4KtCansnpLE" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                        BILD Alberta - Building Airtightness Testing
                                    </a>
                                </div>
                            </div>
                        </InfoCollapsible>
                    </div>
                </div>
            </div>

            {/* HRV/ERV Section for 9368 - Mandatory */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">HRV/ERV System (Required for 9.36.8)</label>
                    <InfoButton title="HRV/ERV Required for 9.36.8 Path">
                        <div className="space-y-4">
                            <p className="text-sm">
                                Under Path 9.36.8, a heat recovery ventilator (HRV) or energy recovery ventilator (ERV) is required.
                            </p>
                            <p className="text-sm">
                                Selecting an HRV/ERV option will automatically set HRV as required.
                            </p>
                        </div>
                    </InfoButton>
                </div>

                <Select
                    value={selections.hrvEfficiency}
                    onValueChange={(value) =>
                        setSelections((prev: any) => ({
                            ...prev,
                            hrvEfficiency: value,
                            hasHrv: "with_hrv", // mandatory for 9368
                        }))
                    }
                >
                    <SelectTrigger className={cn(validationErrors.hrvEfficiency && "border-red-500 ring-2 ring-red-500")}>
                        <SelectValue placeholder="Select HRV/ERV option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        {hrvOptions.slice(1).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label} ({option.points} points)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Auto-set HRV to required for 9368 and show notification */}
            {selections.compliancePath === "9368" && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-950/20 dark:border-green-500/30">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        <p className="text-sm text-green-800 dark:text-green-300">
                            HRV/ERV is mandatory for Path 9.36.8. Your selection is locked to “With HRV”.
                        </p>
                    </div>
                </div>
            )}

            {/* Secondary Suite HRV - Show for buildings with multiple units */}
            {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && selections.hasHrv === "with_hrv" && <div className="space-y-4 p-4 bg-muted/50 border rounded-md">
                <h5 className="font-medium text-foreground">Secondary Suite HRV/ERV</h5>

                <div id="hasSecondaryHrv" className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground">Will there be a second HRV/ERV for the secondary suite?</label>
                        <InfoButton title="Secondary Suite HRV/ERV Information">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-base mb-2">Secondary Suite HRV/ERV Options</h4>
                                    <p className="text-base text-muted-foreground">
                                        For buildings with secondary suites, you have options for ventilation systems.
                                    </p>
                                </div>

                                <div>
                                    <h5 className="font-medium text-base mb-1">Option 1: Shared System</h5>
                                    <p className="text-base text-muted-foreground">
                                        Use one larger HRV/ERV system to serve both the main dwelling and secondary suite, with proper ducting and controls.
                                    </p>
                                </div>

                                <div>
                                    <h5 className="font-medium text-base mb-1">Option 2: Separate Systems</h5>
                                    <p className="text-base text-muted-foreground">
                                        Install separate HRV/ERV systems for each unit to provide independent control and operation.
                                    </p>
                                </div>
                            </div>
                        </InfoButton>
                    </div>
                    <Select value={selections.hasSecondaryHrv} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        hasSecondaryHrv: value,
                        secondaryHrvEfficiency: value !== 'separate' ? '' : prev.secondaryHrvEfficiency,
                    }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="shared">Shared system (one HRV/ERV for both units)</SelectItem>
                            <SelectItem value="separate">Separate HRV/ERV for secondary suite</SelectItem>
                            <SelectItem value="none">No secondary HRV/ERV</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selections.hasSecondaryHrv === "separate" && <div id="secondaryHrvEfficiency" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Secondary Suite HRV/ERV Make/Model</label>
                    <Input type="text" placeholder="Input secondary HRV/ERV make/model" value={selections.secondaryHrvEfficiency || ""} onChange={e => setSelections(prev => ({
                        ...prev,
                        secondaryHrvEfficiency: e.target.value
                    }))} />
                </div>}
            </div>}

            {/* Service Water Heater */}
            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <div id="waterHeater" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Service Water Heater <span className="text-red-400">*</span></label>
                <Select value={selections.waterHeater} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    waterHeater: value
                }))}>
                    <SelectTrigger className={cn(validationErrors.waterHeater && "border-red-500 ring-2 ring-red-500")}>
                        <SelectValue placeholder="Select water heater type" />
                    </SelectTrigger>
                    <SelectContent>
                        {waterHeaterOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label} ({option.points} points)
                        </SelectItem>)}
                    </SelectContent>
                </Select>
            </div>}

            {/* --------------------------------------------------
             * Additional Envelope Inputs (from Prescriptive9368WithHrvSection)
             * -------------------------------------------------- */}

            {/* F280 Calculation */}
            <div id="hasF280Calculation" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Have you completed the required CSA-F280 Calculation for heating and cooling loads?</label>
                <InfoButton title="What is an F280 Calculation?">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <p className="text-sm text-foreground">
                                An F280 calculation is a heating and cooling load calculation based on CSA Standard F280-12 (or updated versions), which is the Canadian standard for determining how much heating or cooling a home needs. It accounts for factors like insulation levels, windows, air leakage, and local climate.
                            </p>

                            <div>
                                <p className="text-sm font-medium mb-2">Why it's beneficial:</p>
                                <div className="space-y-1">
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 text-sm">•</span>
                                        <span className="text-sm">Ensures HVAC systems are properly sized — not too big or too small.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 text-sm">•</span>
                                        <span className="text-sm">Improves comfort, efficiency, and equipment lifespan.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 text-sm">•</span>
                                        <span className="text-sm">Reduces energy costs and avoids overspending on unnecessary system capacity.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 text-sm">•</span>
                                        <span className="text-sm">Often required for building permits or energy code compliance in many jurisdictions.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-100 rounded-md">
                                <p className="text-sm font-medium mb-1">💡 Pro Tip:</p>
                                <p className="text-sm text-foreground">
                                    F280 calcs are especially valuable in energy-efficient homes where heating loads can be dramatically lower than traditional assumptions.
                                </p>
                            </div>
                        </div>
                    </div>
                </InfoButton>
                <Select value={selections.hasF280Calculation} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasF280Calculation: value
                }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                        <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Cathedral / Flat Roof */}
            <div id="hasCathedralOrFlatRoof" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Is there any cathedral ceilings or flat roof?</label>
                <Select value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasCathedralOrFlatRoof: value,
                    cathedralFlatRSI: "",
                    cathedralFlatRSIValue: ""
                }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.hasCathedralOrFlatRoof === "yes" && (
                <div id="cathedralFlatRSI" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Cathedral / Flat Roofs (RSI)
                    </label>
                    <Input
                        type="text"
                        placeholder="Min RSI 5.02"
                        value={selections.cathedralFlatRSI}
                        onChange={(e) =>
                            setSelections((prev) => ({
                                ...prev,
                                cathedralFlatRSI: e.target.value,
                            }))
                        }
                        className={cn(
                            validationErrors.cathedralFlatRSI &&
                            "border-red-500 ring-2 ring-red-500"
                        )}
                    />
                    {(() => {
                        const minRSI = 5.02;
                        const validation = validateRSI(
                            selections.cathedralFlatRSI,
                            minRSI,
                            "cathedral/flat roofs"
                        );
                        const showWarning = !validation.isValid && validation.warning;
                        return showWarning ? (
                            <InfoCollapsible
                                title="🛑 RSI Value Too Low"
                                variant="destructive"
                                defaultOpen={true}
                            >
                                <p className="text-xs">
                                    {`The RSI value must be increased to at least ${minRSI} for cathedral/flat roofs.`}
                                </p>
                            </InfoCollapsible>
                        ) : null;
                    })()}
                    <EffectiveRSIWarning />
                </div>
            )}

            {/* Floors over Unheated Spaces */}
            <div id="floorsUnheatedRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                <Input type="text" placeholder="Min. RSI 5.02 or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsUnheatedRSI: e.target.value
                }))} className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-primary" />
                {selections.floorsUnheatedRSI && parseFloat(selections.floorsUnheatedRSI) < 5.02 && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md" style={{ backgroundColor: 'beige' }}>
                </div>}
                <EffectiveRSIWarning />
            </div>

            {/* Floors over Garages */}
            <div id="floorsGarageRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Floors over Garage (Bonus Floor)</label>
                <Input type="text" placeholder="Min RSI 4.86 or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsGarageRSI: e.target.value
                }))} className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-primary" />
                {selections.floorsGarageRSI && parseFloat(selections.floorsGarageRSI) < 4.86 && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md" style={{ backgroundColor: 'beige' }}>
                </div>}
                <EffectiveRSIWarning />
            </div>

            {/* Slab-on-Grade */}
            <div id="hasSlabOnGrade" className="space-y-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Does the house have a slab on grade with Integral Footing?</label>
                    <Select value={selections.hasSlabOnGrade} onValueChange={value => {
                        setSelections(prev => ({
                            ...prev,
                            hasSlabOnGrade: value,
                            slabOnGradeRSI: ""
                        }));
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select yes or no" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selections.hasSlabOnGrade === "yes" && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Slab on Grade with Integral Footing
                            </label>

                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Min RSI 2.84 or N/A"
                                value={selections.slabOnGradeRSI}
                                onChange={(e) =>
                                    setSelections((prev) => ({
                                        ...prev,
                                        slabOnGradeRSI: e.target.value,
                                    }))
                                }
                                className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-primary"
                            />

                            {selections.slabOnGradeRSI &&
                                parseFloat(selections.slabOnGradeRSI) < 2.84 && (
                                    <InfoCollapsible
                                        title={<span className="text-sm">🛑 RSI Value Too Low</span>}
                                        variant="destructive"
                                        defaultOpen={true}
                                    >
                                        <p className="text-xs">
                                            The RSI value must be increased to at least 2.84 to meet NBC
                                            requirements for slab on grade with integral footing.
                                        </p>
                                    </InfoCollapsible>
                                )}
                        </div>
                    </div>
                )}
            </div>

            {/* Heated Floors (Province dependent minimums) */}
            <div id="heatedFloorsRSI" className="space-y-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Is the house installing or roughing in in-floor heat?</label>
                    <Select value={selections.hasInFloorHeat} onValueChange={value => {
                        setSelections(prev => ({
                            ...prev,
                            hasInFloorHeat: value,
                            unheatedFloorBelowFrostRSI: "",
                            unheatedFloorAboveFrostRSI: "",
                            heatedFloorsRSI: ""
                        }));
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select yes or no" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {(selections.hasInFloorHeat === "yes" ||
                    selections.floorsSlabsSelected.includes("heatedFloors")) && (
                        <>
                            <InfoCollapsible title="ℹ️ In-Floor Heating Requirements" defaultOpen={false}>
                                <p className="text-xs text-foreground">
                                    Since the house has in-floor heating, all floors must be insulated to
                                    meet NBC requirements.
                                </p>
                            </InfoCollapsible>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Heated Floors
                                </label>

                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder={`Enter RSI value (minimum ${selections.province === "saskatchewan" ? "2.84" : "1.34"
                                        })`}
                                    value={selections.heatedFloorsRSI}
                                    onChange={(e) =>
                                        setSelections((prev) => ({
                                            ...prev,
                                            heatedFloorsRSI: e.target.value,
                                        }))
                                    }
                                    className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-primary"
                                />

                                {(() => {
                                    const minRSI =
                                        selections.province === "saskatchewan" ? 2.84 : 1.34;
                                    const validation = validateRSI(
                                        selections.heatedFloorsRSI,
                                        minRSI,
                                        `heated floors in ${selections.province === "saskatchewan"
                                            ? "Saskatchewan"
                                            : "Alberta"
                                        }`
                                    );

                                    const showWarning = !validation.isValid && validation.warning;

                                    return showWarning ? (
                                        <InfoCollapsible
                                            title={
                                                <span className="text-sm">
                                                    {validation.warning.type === "rvalue-suspected"
                                                        ? "R-Value Detected"
                                                        : "🛑 RSI Value Too Low"}
                                                </span>
                                            }
                                            variant={
                                                validation.warning.type === "rvalue-suspected"
                                                    ? "warning"
                                                    : "destructive"
                                            }
                                            defaultOpen={true}
                                        >
                                            <p className="text-xs">{validation.warning.message}</p>
                                        </InfoCollapsible>
                                    ) : null;
                                })()}
                            </div>
                        </>
                    )}

                {selections.hasInFloorHeat === "no" && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Unheated Floor Below Frost Line
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter RSI value or 'uninsulated'"
                                value={selections.unheatedFloorBelowFrostRSI}
                                onChange={(e) =>
                                    setSelections((prev) => ({
                                        ...prev,
                                        unheatedFloorBelowFrostRSI: e.target.value,
                                    }))
                                }
                                className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-primary"
                            />

                            <InfoCollapsible title="ℹ️ Unheated Floor Below Frost Line" defaultOpen={false}>
                                <p className="text-xs text-foreground">
                                    This assembly typically remains uninsulated as per NBC requirements
                                    but can be insulated to improve comfort in these areas. Enter
                                    <code className="px-1">uninsulated</code> or specify an RSI value if
                                    insulation is provided.
                                </p>
                            </InfoCollapsible>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Unheated Floor Above Frost Line
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Min RSI 1.96 (R-11.1)"
                                value={selections.unheatedFloorAboveFrostRSI}
                                onChange={(e) =>
                                    setSelections((prev) => ({
                                        ...prev,
                                        unheatedFloorAboveFrostRSI: e.target.value,
                                    }))
                                }
                                className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-primary"
                            />

                            {selections.unheatedFloorAboveFrostRSI &&
                                parseFloat(selections.unheatedFloorAboveFrostRSI) < 1.96 && (
                                    <InfoCollapsible
                                        title={<span className="text-sm">🛑 RSI Value Too Low</span>}
                                        variant="destructive"
                                        defaultOpen={true}
                                    >
                                        <p className="text-xs">
                                            The RSI value must be increased to at least 1.96 to meet NBC
                                            requirements for unheated floor above frost line.
                                        </p>
                                    </InfoCollapsible>
                                )}
                        </div>
                    </>
                )}

                <EffectiveRSIWarning />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Window & Door U-Value (W/(m²·K))</label>
                <Select value={selections.windowUValue} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    windowUValue: value
                }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select window U-value" />
                    </SelectTrigger>
                    <SelectContent>
                        {windowUValueOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            <div className="flex justify-between items-center w-full">
                                <span>{option.label}</span>
                                <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                    {option.points} pts
                                </Badge>
                            </div>
                        </SelectItem>)}
                    </SelectContent>
                </Select>
                {selections.windowUValue && <>
                    <InfoCollapsible title="ℹ️ ">
                        <p className="text-xs text-foreground">
                            Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please only record the lowest performing window and door (U-Value (ie, highest U-value W/(m²×K)).
                        </p>
                    </InfoCollapsible>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Energy Efficiency Points for Windows & Doors</label>
                        <InfoButton title="Energy Efficiency Points for Windows & Doors">
                            <div className="space-y-4">
                                <p className="text-sm text-foreground/80">
                                    You can get extra energy efficiency points in the code if your windows and doors perform better than the minimum required by the building code (NBC 9.36). This means they either keep heat in better (low U-value) or let in helpful sunlight to reduce heating needs (high Energy Rating or ER).
                                </p>

                                <p className="text-sm text-foreground/80">
                                    But to use the Energy Rating (ER) method for windows or doors, the total glass/opening area on that wall must be less than 17% of the wall's area. The example in the image shows how to calculate that percentage:
                                </p>

                                <ul className="list-disc ml-5 space-y-1 text-sm text-foreground/80">
                                    <li>The wall is 48 m²</li>
                                    <li>The total area of the windows and doors is 7.75 m²</li>
                                    <li>7.75 ÷ 48 × 100 = 16%, so this wall qualifies for ER-based compliance.</li>
                                </ul>

                                <p className="text-sm text-foreground/80">
                                    If the openings are over 17%, you usually have to use U-values instead and follow a trade-off approach.
                                </p>

                                <div className="border-t pt-4">
                                    <h5 className="font-medium mb-2">Why this matters:</h5>
                                    <ul className="list-disc ml-5 space-y-1 text-sm text-foreground/80">
                                        <li>ER is good for cold climates – it considers how much sun a window lets in to help heat the home, along with how well it insulates and how airtight it is.</li>
                                        <li>U-value only looks at insulation, not sun or air leaks.</li>
                                        <li>Using ER lets you use things like patio doors or south-facing windows that bring in sun, even if their U-value isn't great—as long as they don't make up too much of the wall.</li>
                                    </ul>
                                </div>

                                <div className="border-t pt-4">
                                    <img src="/lovable-uploads/7665f3ac-355b-4715-9121-ae5d822bc1f0.png" alt="Figure 9.36-20: Example of how to calculate the percent fenestration area" className="w-full h-auto border rounded" />
                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                        Source: Housing and Small Buildings Illustrated User's Guide National Building Code of Canada 2020
                                    </p>
                                </div>
                            </div>
                        </InfoButton>
                    </div>
                </>}

                <div className="p-3 bg-muted border border-border rounded-md">
                    <p className="text-sm text-foreground font-medium">
                        ℹ️ One Door Exception
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Note: There is a "One door exception" that may apply to your project. Please consult the NBC requirements for specific details on this exception.
                    </p>
                </div>
            </div>

            {selections.hasInFloorHeat === "yes" && (
                <div id="floorsSlabsSelected" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Heated Slabs / Floors (Select which applies)
                    </label>
                    <Select
                        value={selections.floorsSlabsSelected}
                        onValueChange={(value) =>
                            setSelections((prev) => ({
                                ...prev,
                                floorsSlabsSelected: value,
                                unheatedFloorAboveFrostRSI: "",
                                unheatedFloorBelowFrostRSI: "",
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="above-frost">Above Frost Line</SelectItem>
                            <SelectItem value="below-frost">Below Frost Line</SelectItem>
                        </SelectContent>
                    </Select>

                    {selections.floorsSlabsSelected === "above-frost" && (
                        <div id="unheatedFloorAboveFrostRSI" className="space-y-2 mt-3">
                            <label className="text-sm font-medium text-foreground">
                                Unheated Floor / Slab Above Frost (RSI)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Enter RSI value"
                                value={selections.unheatedFloorAboveFrostRSI}
                                onChange={(e) =>
                                    setSelections((prev) => ({
                                        ...prev,
                                        unheatedFloorAboveFrostRSI: e.target.value,
                                    }))
                                }
                                className={cn(
                                    validationErrors.unheatedFloorAboveFrostRSI &&
                                    "border-red-500 ring-2 ring-red-500"
                                )}
                            />
                        </div>
                    )}

                    {selections.floorsSlabsSelected === "below-frost" && (
                        <div id="unheatedFloorBelowFrostRSI" className="space-y-2 mt-3">
                            <label className="text-sm font-medium text-foreground">
                                Unheated Floor / Slab Below Frost (RSI)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Enter RSI value"
                                value={selections.unheatedFloorBelowFrostRSI}
                                onChange={(e) =>
                                    setSelections((prev) => ({
                                        ...prev,
                                        unheatedFloorBelowFrostRSI: e.target.value,
                                    }))
                                }
                                className={cn(
                                    validationErrors.unheatedFloorBelowFrostRSI &&
                                    "border-red-500 ring-2 ring-red-500"
                                )}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Skylights */}
            <div id="hasSkylights" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Does the house have skylights?</label>
                <Select value={selections.hasSkylights} onValueChange={value => {
                    setSelections(prev => ({
                        ...prev,
                        hasSkylights: value,
                        skylightUValue: ""
                    }));
                }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select if house has skylights" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.hasSkylights === "yes" && <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Skylight U-Value</label>
                <Input type="text" placeholder={`Enter U-value (maximum ${selections.province === "alberta" && selections.climateZone === "7B" ? "2.41" : "2.75"} W/(m²·K))`} value={selections.skylightUValue} onChange={e => setSelections(prev => ({
                    ...prev,
                    skylightUValue: e.target.value
                }))} className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-primary" />
                {(() => {
                    const maxUValue = selections.province === "alberta" && selections.climateZone === "7B" ? 2.41 : 2.75;
                    return selections.skylightUValue && parseFloat(selections.skylightUValue) > maxUValue && <WarningButton warningId="skylightUValue-high" title="U-Value Too High" variant="destructive">
                        <p className="text-xs text-destructive/80">
                            The U-value must be reduced to {maxUValue} or lower to meet NBC requirements for skylights in your climate zone.
                        </p>
                    </WarningButton>;
                })()}
            </div>}

            {selections.hasSkylights === "yes" && <InfoCollapsible title="ℹ️ Important: Skylight Shaft Insulation">
                <p className="text-xs text-foreground">
                    Skylight shafts must be insulated. Be prepared to provide further details upon request.
                </p>
            </InfoCollapsible>}

            {/* Service Water Heater */}
            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <div id="waterHeater" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Service Water Heater <span className="text-red-400">*</span></label>
                <Select value={selections.waterHeater} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    waterHeater: value
                }))}>
                    <SelectTrigger className={cn(validationErrors.waterHeater && "border-red-500 ring-2 ring-red-500")}>
                        <SelectValue placeholder="Select water heater type" />
                    </SelectTrigger>
                    <SelectContent>
                        {waterHeaterOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label} ({option.points} points)
                        </SelectItem>)}
                    </SelectContent>
                </Select>
            </div>}

            {/* MURB Multiple Heating Systems - Only show for Multi-Unit buildings */}
            {selections.buildingType === "multi-unit" && <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/30 dark:border-green-500/50">
                <h5 className="font-medium text-green-800 dark:text-green-300">Multi-Unit Building Heating Systems</h5>

                <div id="hasMurbMultipleHeating" className={cn("space-y-2", validationErrors.hasMurbMultipleHeating && "p-2 border-2 border-red-500 rounded-md")}>
                    <label className="text-sm font-medium text-green-800 dark:text-green-300">Will there be multiple heating systems in this building? <span className="text-red-400">*</span></label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasMurbMultipleHeating" value="yes" checked={selections.hasMurbMultipleHeating === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasMurbMultipleHeating: e.target.value,
                                murbSecondHeatingType: "",
                                // Reset when changing
                                murbSecondHeatingEfficiency: "",
                                murbSecondIndirectTank: "",
                                murbSecondIndirectTankSize: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-green-800 dark:text-green-300">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasMurbMultipleHeating" value="no" checked={selections.hasMurbMultipleHeating === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasMurbMultipleHeating: e.target.value,
                                murbSecondHeatingType: "",
                                murbSecondHeatingEfficiency: "",
                                murbSecondIndirectTank: "",
                                murbSecondIndirectTankSize: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-green-800 dark:text-green-300">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasMurbMultipleHeating === "yes" && <div className="space-y-4">
                    <div id="murbSecondHeatingType" className="space-y-2">
                        <label className="text-sm font-medium text-green-800 dark:text-green-300">Second Heating System Type <span className="text-red-400">*</span></label>
                        <Select value={selections.murbSecondHeatingType} onValueChange={value => setSelections(prev => ({
                            ...prev,
                            murbSecondHeatingType: value,
                            murbSecondHeatingEfficiency: "",
                            // Reset efficiency when type changes
                            murbSecondIndirectTank: "",
                            murbSecondIndirectTankSize: ""
                        }))}>
                            <SelectTrigger className={cn(validationErrors.murbSecondHeatingType && "border-red-500 ring-2 ring-red-500")}>
                                <SelectValue placeholder="Select heating type" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="furnace">Furnace</SelectItem>
                                <SelectItem value="boiler">Boiler</SelectItem>
                                <SelectItem value="heat-pump">Heat Pump</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selections.murbSecondHeatingType && <div id="murbSecondHeatingEfficiency" className="space-y-2">
                        <label className="text-sm font-medium text-green-800 dark:text-green-300">Second Heating System Efficiency <span className="text-red-400">*</span></label>
                        <Input type="text" placeholder={selections.murbSecondHeatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.murbSecondHeatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.murbSecondHeatingEfficiency} onChange={e => setSelections(prev => ({
                            ...prev,
                            murbSecondHeatingEfficiency: e.target.value
                        }))} className={cn(validationErrors.murbSecondHeatingEfficiency && "border-red-500 ring-2 ring-red-500")} />
                        {selections.murbSecondHeatingEfficiency && selections.murbSecondHeatingType !== 'heat-pump' && (() => {
                            const inputValue = parseFloat(selections.murbSecondHeatingEfficiency);
                            let minValue = 0;
                            let systemType = "";
                            if (selections.murbSecondHeatingType === 'boiler') {
                                minValue = 90;
                                systemType = "Boiler (90 AFUE minimum)";
                            } else {
                                minValue = 95; // Furnace
                                systemType = "Furnace (95% AFUE minimum)";
                            }
                            if (!isNaN(inputValue) && inputValue < minValue) {
                                return <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <p className="text-sm text-destructive font-medium">
                                        ⚠️ Second Heating System Efficiency Too Low
                                    </p>
                                    <p className="text-sm text-destructive/80 mt-1">
                                        {systemType} - Your input of {inputValue} is below the minimum requirement.
                                    </p>
                                </div>;
                            }
                            return null;
                        })()}
                    </div>}

                    {selections.murbSecondHeatingType === 'boiler' && <div className="space-y-4">
                        <div id="murbSecondIndirectTank" className="space-y-2">
                            <label className="text-sm font-medium text-green-800 dark:text-green-300">Are you installing an indirect tank for the second heating system? <span className="text-red-400">*</span></label>
                            <Select value={selections.murbSecondIndirectTank} onValueChange={value => setSelections(prev => ({
                                ...prev,
                                murbSecondIndirectTank: value
                            }))}>
                                <SelectTrigger className={cn(validationErrors.murbSecondIndirectTank && "border-red-500 ring-2 ring-red-500")}>
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selections.murbSecondIndirectTank === 'yes' && <div id="murbSecondIndirectTankSize" className="space-y-2">
                            <label className="text-sm font-medium text-green-800 dark:text-green-300">Second System Indirect Tank Size <span className="text-red-400">*</span></label>
                            <Select value={selections.murbSecondIndirectTankSize} onValueChange={value => setSelections(prev => ({
                                ...prev,
                                murbSecondIndirectTankSize: value
                            }))}>
                                <SelectTrigger className={cn(validationErrors.murbSecondIndirectTankSize && "border-red-500 ring-2 ring-red-500")}>
                                    <SelectValue placeholder="Select tank size" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="40-gal">40 Gallon</SelectItem>
                                    <SelectItem value="50-gal">50 Gallon</SelectItem>
                                    <SelectItem value="60-gal">60 Gallon</SelectItem>
                                    <SelectItem value="80-gal">80 Gallon</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>}
                    </div>}
                </div>}
            </div>}

            {/* MURB Multiple Water Heaters - Only show for Multi-Unit buildings */}
            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && selections.buildingType === "multi-unit" && <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-md dark:bg-orange-900/30 dark:border-orange-500/50">
                <h5 className="font-medium text-orange-800 dark:text-orange-300">Multi-Unit Building Water Heating</h5>

                <div id="hasMurbMultipleWaterHeaters" className={cn("space-y-2", validationErrors.hasMurbMultipleWaterHeaters && "p-2 border-2 border-red-500 rounded-md")}>
                    <label className="text-sm font-medium text-orange-800 dark:text-orange-300">Will there be multiple hot water system types in this building? <span className="text-red-400">*</span></label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasMurbMultipleWaterHeaters" value="yes" checked={selections.hasMurbMultipleWaterHeaters === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasMurbMultipleWaterHeaters: e.target.value,
                                murbSecondWaterHeater: "",
                                // Reset when changing
                                murbSecondWaterHeaterType: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-orange-800 dark:text-orange-300">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasMurbMultipleWaterHeaters" value="no" checked={selections.hasMurbMultipleWaterHeaters === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasMurbMultipleWaterHeaters: e.target.value,
                                murbSecondWaterHeater: "",
                                murbSecondWaterHeaterType: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-orange-800 dark:text-orange-300">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasMurbMultipleWaterHeaters === "yes" && <div className="space-y-4">
                    <div id="murbSecondWaterHeaterType" className="space-y-2">
                        <label className="text-sm font-medium text-orange-800 dark:text-orange-300">Second Water Heater Type <span className="text-red-400">*</span></label>
                        <Select value={selections.murbSecondWaterHeaterType} onValueChange={value => {
                            setSelections(prev => ({
                                ...prev,
                                murbSecondWaterHeaterType: value,
                                murbSecondWaterHeater: "" // Reset efficiency when type changes
                            }));
                        }}>
                            <SelectTrigger className={cn(validationErrors.murbSecondWaterHeaterType && "border-red-500 ring-2 ring-red-500")}>
                                <SelectValue placeholder="Select water heater type" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="gas-storage">Gas Storage Tank</SelectItem>
                                <SelectItem value="gas-tankless">Gas Tankless</SelectItem>
                                <SelectItem value="electric-storage">Electric Storage Tank</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selections.murbSecondWaterHeaterType && <div id="murbSecondWaterHeater" className="space-y-2">
                        <label className="text-sm font-medium text-orange-800 dark:text-orange-300">Second Water Heater Efficiency <span className="text-red-400">*</span></label>
                        <Input type="text" placeholder={(() => {
                            switch (selections.murbSecondWaterHeaterType) {
                                case "gas-storage":
                                    return "Enter efficiency for Gas Storage Tank (UEF ≥0.60-0.81)";
                                case "gas-tankless":
                                    return "Enter efficiency for Gas Tankless (UEF ≥0.86)";
                                case "electric-storage":
                                    return "Enter efficiency for Electric Storage Tank (UEF ≥0.35-0.69)";
                                case "heat-pump":
                                    return "Enter efficiency for Heat Pump Water Heater (EF ≥2.1)";
                                case "other":
                                    return "Enter efficiency for water heater";
                                default:
                                    return "Enter water heater efficiency";
                            }
                        })()} value={selections.murbSecondWaterHeater} onChange={e => setSelections(prev => ({
                            ...prev,
                            murbSecondWaterHeater: e.target.value
                        }))} className={cn(validationErrors.murbSecondWaterHeater && "border-red-500 ring-2 ring-red-500")} />
                    </div>}
                </div>}
            </div>}
        </div>
    );
}