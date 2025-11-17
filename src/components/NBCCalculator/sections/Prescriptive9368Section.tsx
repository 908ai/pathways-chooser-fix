import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import InfoButton from "@/components/InfoButton";
import { Info, ChevronDown, Search, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { validateRSI } from "../utils/validation";
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
}: {
    selections: any;
    setSelections: any;
    validationErrors: Record<string, boolean>;
}) {
    const InfoCollapsible = ({
        title,
        children,
        variant = "warning",
    }: {
        title: string;
        children: React.ReactNode;
        variant?: "warning" | "destructive";
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        const bgColor =
            variant === "warning"
                ? "bg-gradient-to-r from-slate-800/60 to-teal-800/60"
                : "bg-gradient-to-r from-slate-800/60 to-red-800/60";
        const borderColor =
            variant === "warning"
                ? "border border-orange-400"
                : "border-2 border-red-400";

        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className={`p-2 ${bgColor} ${borderColor} rounded-lg backdrop-blur-sm`}>
                <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
                    <span className="text-xs font-bold text-white">{title}</span>
                    <ChevronDown className={`h-5 w-5 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                    <div className="text-white text-xs">{children}</div>
                </CollapsibleContent>
            </Collapsible>
        );
    };

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

    const isWaterHeaterBoiler = selections.heatingType === 'boiler' && selections.indirectTank === 'yes';
    const isSecondaryWaterHeaterBoiler = selections.secondaryHeatingType === 'boiler' && selections.secondaryIndirectTank === 'yes';

    return (
        <div className="space-y-6">
            {/* Ceiling/Attic Insulation */}
            <div id="ceilingsAtticRSI" className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Effective RSI - Ceilings below Attics <span className="text-red-400">*</span></label>
                <Input type="number" step="0.01" min="0" placeholder={selections.compliancePath === "9368" ? "Min RSI 8.67 (R-49.2) with HRV" : selections.hasHrv === "with_hrv" ? "Min RSI 8.67 (R-49.2) with HRV" : selections.hasHrv === "without_hrv" ? "Min RSI 10.43 (R-59.2) without HRV" : "Min RSI 8.67 (R-49.2) with HRV, 10.43 (R-59.2) without HRV"} value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    ceilingsAtticRSI: e.target.value
                }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.ceilingsAtticRSI && "border-red-500 ring-2 ring-red-500")} />
                {(() => {
                    // Skip R-value validation for 9368 path - allow any input
                    if (selections.compliancePath === "9368") {
                        return null;
                    }
                    console.log("Ceilings validation debug:", {
                        ceilingsAtticRSI: selections.ceilingsAtticRSI,
                        hasHrv: selections.hasHrv,
                        parsedValue: parseFloat(selections.ceilingsAtticRSI || "0"),
                        minRSI: selections.hasHrv === "with_hrv" ? 8.67 : 10.43
                    });
                    const minRSI = selections.hasHrv === "with_hrv" ? 8.67 : 10.43;
                    const validation = validateRSI(selections.ceilingsAtticRSI, minRSI, `ceilings below attics ${selections.hasHrv === "with_hrv" ? "with HRV" : "without HRV"}`);
                    if (!validation.isValid && validation.warning) {
                        return <InfoCollapsible title={validation.warning.type === "rvalue-suspected" ? "R-Value Detected" : "RSI Value Too Low"} variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}>
                            <p className="text-sm text-white">
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
                <label className="text-sm font-medium text-slate-100">Above Grade Walls - RSI Value <span className="text-red-400">*</span></label>
                <Select value={selections.wallRSI} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    wallRSI: value
                }))}>
                    <SelectTrigger className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.wallRSI && "border-red-500 ring-2 ring-red-500")}>
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
                <label className="text-sm font-medium text-slate-100">Below Grade Walls - RSI Value <span className="text-red-400">*</span></label>
                <Select value={selections.belowGradeRSI} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    belowGradeRSI: value
                }))}>
                    <SelectTrigger className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.belowGradeRSI && "border-red-500 ring-2 ring-red-500")}>
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
                    <label className="text-sm font-medium text-slate-100">Windows - U-Value <span className="text-red-400">*</span></label>
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
                    <SelectTrigger className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.windowUValue && "border-red-500 ring-2 ring-red-500")}>
                        <SelectValue placeholder="Select window performance" />
                    </SelectTrigger>
                    <SelectContent>
                        {windowUValueOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label} ({option.points} points)
                        </SelectItem>)}
                    </SelectContent>
                </Select>

                <InfoCollapsible title="ℹ️ Window & Door Performance Verification">
                    <p className="text-white">
                        Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please record the range of lowest-highest performing window and door U-Value’s (ie, U-value W/(m²×).
                    </p>
                    <p className="text-white mt-2">
                        See below an illustrative example of a window unit showing the performance values that must be recorded in the Window & Door Schedule.                        
                    </p>
                    <img src="/assets/img/window-door-uvalue-example.png" alt="Window & Door Performance Example" className="mt-4 rounded-md border mx-auto block" />
                </InfoCollapsible>
                {selections.windowUValue && <>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-100">Energy Efficiency Points for Windows & Doors</label>
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
                    <label className="text-sm font-medium text-slate-100">Airtightness Level <span className="text-red-400">*</span></label>
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
                                                <p>• All adjacent units are depressurized at the same time.</p>
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
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                    <p className="text-sm font-medium text-blue-800">📋 Helpful Resources:</p>
                                    <div className="space-y-1">
                                        <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:text-red-800 block">
                                            🔗 View the Blower Door Checklist
                                        </a>
                                        <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:text-red-800 block">
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
                    <SelectTrigger>
                        <SelectValue placeholder="Select air-tightness level" />
                    </SelectTrigger>
                    <SelectContent>
                        {airtightnessOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            <div className="flex justify-between items-center w-full">
                                <span>
                                    {option.label.includes('ACH₅₀:') ? <>
                                        {option.label.split('ACH₅₀:')[0]}
                                        <strong>ACH₅₀: </strong>
                                        <strong className="text-primary">
                                            {option.label.split('ACH₅₀:')[1].split(',')[0]}
                                        </strong>
                                        {option.label.split('ACH₅₀:')[1].substring(option.label.split('ACH₅₀:')[1].split(',')[0].length)}
                                    </> : option.label}
                                </span>
                                <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                    {option.points} pts
                                </Badge>
                            </div>
                        </SelectItem>)}
                    </SelectContent>
                </Select>

                <InfoCollapsible title="⚠️ Caution: Choosing Airtightness Points Without Experience">
                    <div className="text-xs text-white space-y-2">
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
                            If you're unsure of your airtightness performance, consider using performance modelling instead — it offers more flexibility and reduces the risk of non-compliance.
                        </p>
                        <div className="flex items-center gap-1 text-sm mt-3">
                            <span>🔗</span>
                            <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">
                                More information
                            </a>
                        </div>
                    </div>
                </InfoCollapsible>

                {/* Mid-Construction Blower Door Test Checkbox */}
                <div className="space-y-3 pt-4 border-t border-border/20">
                    <div className="flex items-start gap-3">
                        <input type="checkbox" id="midConstructionBlowerDoor-9367" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                            ...prev,
                            midConstructionBlowerDoorPlanned: e.target.checked
                        }))} className="w-4 h-4 text-primary mt-1" />
                        <div className="flex-1">
                            <label htmlFor="midConstructionBlowerDoor-9367" className="text-sm font-medium cursor-pointer text-slate-100">
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
                        <div className="text-xs text-white space-y-2">
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
                                <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-yellow-300/80">
                                    View the Blower Door Checklist
                                </a>  
                            </div>
                            <div className="flex items-center gap-1 text-sm mt-3">
                                <span>▶️</span>
                                <a href="https://www.youtube.com/watch?v=4KtCansnpLE" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-yellow-300/80">
                                    BILD Alberta - Building Airtightness Testing
                                </a>  
                            </div>   
                        </div>
                    </InfoCollapsible>
                </div>
            </div>


            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-100">Heating Type <span className="text-red-400">*</span></label>
                    <InfoButton title="CAN/CSA F280-12 - Room by Room Heat Loss/Gain Calculation">
                        <div className="space-y-4">
                            <div>
                                <h5 className="font-medium text-base mb-2">What’s the Benefit of an F280 Calculation?</h5>
                                <p className="text-base text-muted-foreground">
                                    An F280 is a room-by-room heat loss and gain calculation that ensures your heating and cooling
                                    system is sized exactly right for your home — not based on guesses or whole-house averages.
                                    It’s especially useful for energy-efficient homes, where oversized systems waste energy, cost more,
                                    and perform poorly.
                                </p>
                            </div>
                            <div>
                                <h5 className="font-medium text-base mb-2">Key Benefits</h5>
                                <ul className="text-base text-muted-foreground ml-4 space-y-1 list-disc">
                                    <li>Ensures every room stays comfortable</li>
                                    <li>Allows for smaller, cheaper mechanical systems</li>
                                    <li>Enables smaller ductwork and easier design</li>
                                    <li>Boosts efficiency and reduces energy bills</li>
                                    <li>Prevents issues from oversizing (like poor humidity control)</li>
                                    <li>Improves system lifespan and indoor air quality</li>
                                    <li>Reduces need for backup heat in cold weather</li>
                                </ul>
                            </div>
                        </div>
                    </InfoButton>
                </div>  
                <Select value={selections.heatingType} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    heatingType: value
                }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select heating type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="furnace">Furnace</SelectItem>
                        <SelectItem value="boiler">Boiler</SelectItem>
                        <SelectItem value="heat-pump">Heat Pump</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <InfoCollapsible title="⚠️ Mechanical Equipment Documentation">
                <div className="text-xs text-white space-y-2">
                    <p>
                        The Authority Having Jurisdiction (AHJ) may verify specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations.
                    </p>
                    <p>
                        <strong>F280 calculations:</strong> A heating and cooling load calculation based on CSA Standard F280-12 (or updated versions), which is the Canadian standard for determining how much heating or cooling a home needs. It accounts for factors like insulation levels, windows, air leakage, and local climate.
                    </p>
                    <p>
                        <strong>Benefits:</strong> Ensures HVAC systems are properly sized, improves comfort and efficiency, reduces energy costs, and is often required for building permits.
                    </p>
                    <div className="flex items-center gap-1 text-sm mt-3">
                        <span>🔗</span>
                        <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300/80">
                            More information
                        </a>
                    </div>
                </div>
            </InfoCollapsible>

            {selections.heatingType && selections.compliancePath as string === '9367' && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Heating System Make/Model</label>
                <Input type="text" placeholder="Input heating system make/model (e.g. Carrier 59TP6)" value={selections.heatingMakeModel || ""} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingMakeModel: e.target.value
                }))} />
            </div>}

            {selections.heatingType && selections.compliancePath as string !== '9367' && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Heating Efficiency</label>
                <Input type="text" placeholder={selections.heatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.heatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingEfficiency: e.target.value
                }))} />
                {selections.heatingEfficiency && selections.heatingType !== 'heat-pump' && (() => {
                    console.log('Heating efficiency validation - type:', selections.heatingType, 'efficiency:', selections.heatingEfficiency);
                    const inputValue = parseFloat(selections.heatingEfficiency);
                    let minValue = 0;
                    let systemType = "";
                    if (selections.heatingType === 'boiler') {
                        minValue = 90;
                        systemType = "Boiler (90 AFUE minimum)";
                    } else {
                        minValue = 95; // Furnace
                        systemType = "Furnace (95% AFUE minimum)";
                    }
                    const showWarning = !isNaN(inputValue) && inputValue < minValue;

                    return showWarning ? (
                        <Alert variant="destructive" style={{ backgroundColor: 'beige' }}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Heating Efficiency Too Low</AlertTitle>
                            <AlertDescription>
                                {systemType} – Your input of {inputValue} is below the minimum requirement.
                            </AlertDescription>
                        </Alert>
                    ) : null;
                })()}
            </div>}

            {selections.heatingType === 'boiler' && <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Are you installing an indirect tank?</label>
                    <Select value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        indirectTank: value
                    }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select if installing indirect tank" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selections.indirectTank === 'yes' && <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Indirect tank size (gallons)</label>
                    <Input type="number" placeholder="Enter tank size in gallons" value={selections.indirectTankSize} onChange={e => setSelections(prev => ({
                        ...prev,
                        indirectTankSize: e.target.value
                    }))} />
                </div>}
            </div>}

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Are you installing cooling/air conditioning?</label>
                <Select value={selections.coolingApplicable} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    coolingApplicable: value
                }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select if cooling is applicable" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>


            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Service Water Heater Type</label>
                    <Select value={selections.waterHeater} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        waterHeater: value
                    }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select service water heater type" />
                        </SelectTrigger>
                        <SelectContent>
                            {waterHeaterOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                <div className="flex justify-between items-center w-full">
                                    <span>{option.label}</span>
                                    <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                        {option.points} pts
                                    </Badge>
                                </div>
                            </SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {selections.waterHeater && selections.compliancePath as string === '9367' && <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Water Heating Make/Model</label>
                    <Input type="text" placeholder="Input water heating make/model (e.g. Rheem Pro Prestige)" value={selections.waterHeaterMakeModel || ""} onChange={e => setSelections(prev => ({
                        ...prev,
                        waterHeaterMakeModel: e.target.value
                    }))} />
                </div>}

                {selections.waterHeater && selections.compliancePath as string !== '9367' && <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Service Water Heater</label>
                    <Input type="text" placeholder="Enter water heater efficiency, (e.g. .69 UEF)" value={selections.waterHeaterType} onChange={e => {
                        console.log('Water heater efficiency updated:', e.target.value);
                        setSelections(prev => ({
                            ...prev,
                            waterHeaterType: e.target.value
                        }));
                    }} />
                </div>}
            </>}

            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-100">Is a drain water heat recovery system being installed?</label>
                    <InfoButton title="Drain Water Heat Recovery System Information">
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h4 className="font-medium text-sm">ℹ️ Drain Water Heat Recovery (DWHR)</h4>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground">
                                    DWHR systems capture heat from shower drain water and use it to preheat incoming cold water, reducing hot water energy use by 20–40%.
                                </p>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 text-xs">✅</span>
                                        <span className="text-xs">Improves energy efficiency</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 text-xs">✅</span>
                                        <span className="text-xs">Helps earn NBC tiered compliance points</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 text-xs">✅</span>
                                        <span className="text-xs">Great for homes with frequent showers</span>
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p><strong>Estimated cost:</strong> $800–$1,200 installed</p>
                                    <p><strong>Best fit:</strong> Homes with vertical drain stacks and electric or heat pump water heaters.</p>
                                </div>
                            </div>
                        </div>
                    </InfoButton>
                </div>
                <Select value={selections.hasDWHR} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasDWHR: value
                }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select yes or no" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}