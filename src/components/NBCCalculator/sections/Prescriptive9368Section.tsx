import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, ChevronDown, Search, AlertTriangle } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
    showMissingFields?: boolean;
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
    showMissingFields = false,
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
        warningId?: string;
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

    const [openSections, setOpenSections] = useState<string[]>([]);

    const isSet = (value: any) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "string") return value.trim() !== "";
        if (typeof value === "boolean") return true; 
        return value !== null && value !== undefined;
    };

    const isMissing = (key: string) => {
        return showMissingFields && !isSet(selections[key]);
    };

    const missingFieldClass = "border-red-400 bg-red-50 focus-visible:ring-red-500";

    const isComplete = (key: string) => {
        const val = selections[key];
        return isSet(val) && !validationErrors[key];
    };

    const getEnvelopeKeys = () => {
        const keys: string[] = [
            "ceilingsAtticRSI",
            "wallRSI",
            "belowGradeRSI",
            "windowUValue",
            "airtightness",
            "hasCathedralOrFlatRoof",
            "floorsUnheatedRSI",
            "floorsGarageRSI",
            "hasSlabOnGrade",
            "hasInFloorHeat",
            "hasSkylights",
        ];

        if (selections.hasCathedralOrFlatRoof === "yes") keys.push("cathedralFlatRSI");
        if (selections.hasSlabOnGrade === "yes") keys.push("slabOnGradeRSI");
        if (selections.hasInFloorHeat === "yes") {
            keys.push("heatedFloorsRSI");
            keys.push("floorsSlabsSelected");
            if (selections.floorsSlabsSelected?.includes("above-frost")) keys.push("unheatedFloorAboveFrostRSI");
            if (selections.floorsSlabsSelected?.includes("below-frost")) keys.push("unheatedFloorBelowFrostRSI");
        } else {
             keys.push("unheatedFloorAboveFrostRSI");
        }
        if (selections.hasSkylights === "yes") keys.push("skylightUValue");
        
        return keys;
    };

    const getMechanicalKeys = () => {
        const keys: string[] = [
            "hrvEfficiency", // hasHrv is forced
            "waterHeater",
            "hasF280Calculation"
        ];
        
        if (selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") {
             keys.push("hasSecondaryHrv");
             if (selections.hasSecondaryHrv === "separate") keys.push("secondaryHrvEfficiency");
        }
        
        if (selections.buildingType === "multi-unit") {
            keys.push("hasMurbMultipleHeating");
            if (selections.hasMurbMultipleHeating === "yes") {
                keys.push("murbSecondHeatingType");
                keys.push("murbSecondHeatingEfficiency");
                if (selections.murbSecondHeatingType === 'boiler') {
                    keys.push("murbSecondIndirectTank");
                    if (selections.murbSecondIndirectTank === 'yes') keys.push("murbSecondIndirectTankSize");
                }
            }
            
            keys.push("hasMurbMultipleWaterHeaters");
            if (selections.hasMurbMultipleWaterHeaters === "yes") {
                 keys.push("murbSecondWaterHeaterType");
                 keys.push("murbSecondWaterHeater");
            }
        }

        return keys;
    };

    const envelopeKeys = getEnvelopeKeys();
    const mechanicalKeys = getMechanicalKeys();
    const envelopeCompleted = envelopeKeys.filter(isComplete).length;
    const mechanicalCompleted = mechanicalKeys.filter(isComplete).length;

    const hasMissingEnvelope = envelopeKeys.some(key => !isComplete(key));
    const hasMissingMechanical = mechanicalKeys.some(key => !isComplete(key));

    useEffect(() => {
        if (showMissingFields) {
            const newOpenSections = [];
            if (hasMissingEnvelope) newOpenSections.push("envelope");
            if (hasMissingMechanical) newOpenSections.push("mechanical");
            
            if (newOpenSections.length > 0) {
                 setOpenSections(prev => {
                    const unique = Array.from(new Set([...prev, ...newOpenSections]));
                    return unique.length !== prev.length ? unique : prev;
                 });
            }
        }
    }, [showMissingFields, hasMissingEnvelope, hasMissingMechanical]);

    return (
        <div className="space-y-3">
            <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" className="text-sm px-2" onClick={() => setOpenSections(["envelope", "mechanical"])}>
                    Expand All
                </Button>
                <Button variant="outline" size="sm" className="text-sm px-2" onClick={() => setOpenSections([])}>
                    Collapse All
                </Button>
            </div>

            <Accordion type="multiple" value={openSections} onValueChange={(val: string[] | string) => setOpenSections(Array.isArray(val) ? val : [])} className="border rounded-md">
                <AccordionItem value="envelope">
                    <AccordionTrigger className={cn("px-4", showMissingFields && hasMissingEnvelope ? "bg-red-50 text-red-900" : "")}>
                        <div className="flex w-full items-center justify-between">
                            <span className="text-base flex items-center gap-2">
                                Building Envelope
                                {showMissingFields && hasMissingEnvelope && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            </span>
                            <Badge variant={showMissingFields && hasMissingEnvelope ? "destructive" : "secondary"}>{envelopeCompleted} / {envelopeKeys.length} completed</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4">
                        <div className="space-y-6">
                            {/* Ceiling/Attic Insulation */}
                            <div id="ceilingsAtticRSI" className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Effective RSI - Ceilings below Attics <span className="text-red-400">*</span></label>
                                <Input type="text" placeholder={selections.compliancePath === "9368" ? "Min RSI 8.67 (R-49.2) with HRV" : selections.hasHrv === "with_hrv" ? "Min RSI 8.67 (R-49.2) with HRV" : selections.hasHrv === "without_hrv" ? "Min RSI 10.43 (R-59.2) without HRV" : "Min RSI 8.67 (R-49.2) with HRV, 10.43 (R-59.2) without HRV"} value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                                    ...prev,
                                    ceilingsAtticRSI: e.target.value
                                }))} 
                                className={cn(
                                    (validationErrors.ceilingsAtticRSI || isMissing("ceilingsAtticRSI")) && missingFieldClass,
                                    validationErrors.ceilingsAtticRSI && "border-red-500 ring-2 ring-red-500"
                                )} 
                                />
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
                                    <SelectTrigger className={cn(
                                        (validationErrors.wallRSI || isMissing("wallRSI")) && missingFieldClass,
                                        validationErrors.wallRSI && "border-red-500 ring-2 ring-red-500"
                                    )}>
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
                                    <SelectTrigger className={cn(
                                        (validationErrors.belowGradeRSI || isMissing("belowGradeRSI")) && missingFieldClass,
                                        validationErrors.belowGradeRSI && "border-red-500 ring-2 ring-red-500"
                                    )}>
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
                                    <SelectTrigger className={cn(
                                        (validationErrors.windowUValue || isMissing("windowUValue")) && missingFieldClass,
                                        validationErrors.windowUValue && "border-red-500 ring-2 ring-red-500"
                                    )}>
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
                                        <SelectTrigger className={cn(
                                            (isMissing("floorsSlabsSelected")) && missingFieldClass
                                        )}>
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
                                                    (validationErrors.unheatedFloorAboveFrostRSI || isMissing("unheatedFloorAboveFrostRSI")) && missingFieldClass,
                                                    validationErrors.unheatedFloorAboveFrostRSI && "border-red-500 ring-2 ring-red-500"
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
                                                    (validationErrors.unheatedFloorBelowFrostRSI || isMissing("unheatedFloorBelowFrostRSI")) && missingFieldClass,
                                                    validationErrors.unheatedFloorBelowFrostRSI && "border-red-500 ring-2 ring-red-500"
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
                                    <SelectTrigger className={cn(
                                        (isMissing("hasSkylights")) && missingFieldClass
                                    )}>
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
                                }))} 
                                className={cn(
                                    (isMissing("skylightUValue")) && missingFieldClass,
                                    "flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-primary"
                                )}
                                />
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
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mechanical">
                    <AccordionTrigger className={cn("px-4", showMissingFields && hasMissingMechanical ? "bg-red-50 text-red-900" : "")}>
                        <div className="flex w-full items-center justify-between">
                            <span className="text-base flex items-center gap-2">
                                Mechanical Systems
                                {showMissingFields && hasMissingMechanical && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            </span>
                            <Badge variant={showMissingFields && hasMissingMechanical ? "destructive" : "secondary"}>{mechanicalCompleted} / {mechanicalKeys.length} completed</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4">
                        <div className="space-y-6">
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
                                    <SelectTrigger className={cn(
                                        (validationErrors.hrvEfficiency || isMissing("hrvEfficiency")) && missingFieldClass,
                                        validationErrors.hrvEfficiency && "border-red-500 ring-2 ring-red-500"
                                    )}>
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
                                        <SelectTrigger className={cn(
                                            (isMissing("hasSecondaryHrv")) && missingFieldClass
                                        )}>
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
                                    }))} 
                                    className={cn(
                                        (isMissing("secondaryHrvEfficiency")) && missingFieldClass
                                    )}
                                    />
                                </div>}
                            </div>}

                            {/* Service Water Heater */}
                            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <div id="waterHeater" className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Service Water Heater <span className="text-red-400">*</span></label>
                                <Select value={selections.waterHeater} onValueChange={value => setSelections(prev => ({
                                    ...prev,
                                    waterHeater: value
                                }))}>
                                    <SelectTrigger className={cn(
                                        (validationErrors.waterHeater || isMissing("waterHeater")) && missingFieldClass,
                                        validationErrors.waterHeater && "border-red-500 ring-2 ring-red-500"
                                    )}>
                                        <SelectValue placeholder="Select water heater type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {waterHeaterOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                            {option.label} ({option.points} points)
                                        </SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>}

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
                                    <SelectTrigger className={cn(
                                        (isMissing("hasF280Calculation")) && missingFieldClass
                                    )}>
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border shadow-lg z-50">
                                        <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                                        <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Service Water Heater - Second Occurrence */}
                            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <div id="waterHeater" className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Service Water Heater <span className="text-red-400">*</span></label>
                                <Select value={selections.waterHeater} onValueChange={value => setSelections(prev => ({
                                    ...prev,
                                    waterHeater: value
                                }))}>
                                    <SelectTrigger className={cn(
                                        (validationErrors.waterHeater || isMissing("waterHeater")) && missingFieldClass,
                                        validationErrors.waterHeater && "border-red-500 ring-2 ring-red-500"
                                    )}>
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

                                <div id="hasMurbMultipleHeating" className={cn(
                                    "space-y-2", 
                                    (validationErrors.hasMurbMultipleHeating || isMissing("hasMurbMultipleHeating")) && "p-2 border-2 border-red-500 rounded-md"
                                )}>
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
                                            <SelectTrigger className={cn(
                                                (validationErrors.murbSecondHeatingType || isMissing("murbSecondHeatingType")) && missingFieldClass,
                                                validationErrors.murbSecondHeatingType && "border-red-500 ring-2 ring-red-500"
                                            )}>
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
                                        }))} 
                                        className={cn(
                                            (validationErrors.murbSecondHeatingEfficiency || isMissing("murbSecondHeatingEfficiency")) && missingFieldClass,
                                            validationErrors.murbSecondHeatingEfficiency && "border-red-500 ring-2 ring-red-500"
                                        )} 
                                        />
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
                                                <SelectTrigger className={cn(
                                                    (validationErrors.murbSecondIndirectTank || isMissing("murbSecondIndirectTank")) && missingFieldClass,
                                                    validationErrors.murbSecondIndirectTank && "border-red-500 ring-2 ring-red-500"
                                                )}>
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
                                                <SelectTrigger className={cn(
                                                    (validationErrors.murbSecondIndirectTankSize || isMissing("murbSecondIndirectTankSize")) && missingFieldClass,
                                                    validationErrors.murbSecondIndirectTankSize && "border-red-500 ring-2 ring-red-500"
                                                )}>
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

                                <div id="hasMurbMultipleWaterHeaters" className={cn(
                                    "space-y-2", 
                                    (validationErrors.hasMurbMultipleWaterHeaters || isMissing("hasMurbMultipleWaterHeaters")) && "p-2 border-2 border-red-500 rounded-md"
                                )}>
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
                                            <SelectTrigger className={cn(
                                                (validationErrors.murbSecondWaterHeaterType || isMissing("murbSecondWaterHeaterType")) && missingFieldClass,
                                                validationErrors.murbSecondWaterHeaterType && "border-red-500 ring-2 ring-red-500"
                                            )}>
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
                                        }))} 
                                        className={cn(
                                            (validationErrors.murbSecondWaterHeater || isMissing("murbSecondWaterHeater")) && missingFieldClass,
                                            validationErrors.murbSecondWaterHeater && "border-red-500 ring-2 ring-red-500"
                                        )} 
                                        />
                                    </div>}
                                </div>}
                            </div>}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}