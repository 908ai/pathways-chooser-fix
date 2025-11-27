import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, ChevronDown, AlertTriangle, Search } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { wallRSIOptions, belowGradeRSIOptions, windowUValueOptions, waterHeaterOptions, airtightnessOptions } from "../constants/options";
import { validateRSI } from "../utils/validation";
import { EffectiveRSIWarning } from "@/components/NBCCalculator/components/EffectiveRSIWarning";

interface Props {
    selections: any;
    setSelections: React.Dispatch<React.SetStateAction<any>>;
    WarningButton: React.FC<any>;
}

const heatPumpOptions = [
    { value: "Air-Source Heat Pump – Split (SEER 14.5, EER 11.5, HSPF 7.1)", label: "Air-Source Heat Pump – Split (SEER 14.5, EER 11.5, HSPF 7.1)" },
    { value: "Air-Source Heat Pump – Single Package (SEER 14.0, EER 11.0, HSPF 7.0)", label: "Air-Source Heat Pump – Single Package (SEER 14.0, EER 11.0, HSPF 7.0)" },
    { value: "Ground-Source Heat Pump – Closed Loop (COPc ≥ 3.6, COPh ≥ 3.1)", label: "Ground-Source Heat Pump – Closed Loop (COPc ≥ 3.6, COPh ≥ 3.1)" },
    { value: "Ground-Source Heat Pump – Open Loop (COPc ≥ 4.75, COPh ≥ 3.6)", label: "Ground-Source Heat Pump – Open Loop (COPc ≥ 4.75, COPh ≥ 3.6)" },
    { value: "Other", label: "Other (Manual Entry Required)" }
];

export const Prescriptive9368WithHrvSection: React.FC<Props> = ({ selections, setSelections, WarningButton }) => {

    // Collapsible component for warnings/info
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
        <>
            {<>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground">Have you completed the required CSA-F280 Calculation for heating and cooling loads?</label>
                        <InfoButton title="What is an F280 Calculation?">
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
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

                                    <div className="p-3 bg-muted rounded-md">
                                        <p className="text-sm font-medium mb-1">💡 Pro Tip:</p>
                                        <p className="text-sm text-muted-foreground">
                                            F280 calcs are especially valuable in energy-efficient homes where heating loads can be dramatically lower than traditional assumptions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </InfoButton>
                    </div>
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



                <div className="space-y-2">
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

                {selections.hasCathedralOrFlatRoof === "yes" && <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Cathedral / Flat Roofs</label>
                    <Input type="number" step="0.01" min="0" placeholder="Min RSI 5.02 or N/A" value={selections.cathedralFlatRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        cathedralFlatRSI: e.target.value
                    }))} />
                    {(() => {
                        const minRSI = 5.02;
                        const validation = validateRSI(selections.cathedralFlatRSI, minRSI, "cathedral/flat roofs");

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
                                variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}
                                defaultOpen={true}
                            >
                                <p className="text-xs">
                                    {validation.warning.message}
                                </p>
                            </InfoCollapsible>
                        ) : null;
                    })()}
                    <EffectiveRSIWarning />
                </div>}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Above Grade Walls</label>
                    <Select value={selections.wallRSI} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        wallRSI: value
                    }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select wall RSI value" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                            {wallRSIOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                <div className="flex justify-between items-center w-full">
                                    <span>{option.label}</span>
                                    <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                        {option.points} pts
                                    </Badge>
                                </div>
                            </SelectItem>)}
                        </SelectContent>
                    </Select>
                    {selections.wallRSI && <EffectiveRSIWarning />}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Below Grade Walls (Foundation Walls)</label>
                    <Select value={selections.belowGradeRSI} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        belowGradeRSI: value
                    }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select below grade RSI value" />
                        </SelectTrigger>
                        <SelectContent>
                            {belowGradeRSIOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                <div className="flex justify-between items-center w-full">
                                    <span>{option.label}</span>
                                    <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                        {option.points} pts
                                    </Badge>
                                </div>
                            </SelectItem>)}
                        </SelectContent>
                    </Select>
                    {selections.belowGradeRSI && <EffectiveRSIWarning />}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                    <Input type="number" step="0.01" min="0" placeholder="Min. RSI 5.02 or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        floorsUnheatedRSI: e.target.value
                    }))} />
                    {selections.floorsUnheatedRSI && parseFloat(selections.floorsUnheatedRSI) < 5.02 && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>RSI Value Too Low</AlertTitle>
                            <AlertDescription>
                                The RSI value must be at least 5.02 to meet NBC requirements for floors over unheated spaces.
                            </AlertDescription>
                        </Alert>
                    )}
                    <EffectiveRSIWarning />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Floors over Garage (Bonus Floor)</label>
                    <Input type="number" step="0.01" min="0" placeholder="Min RSI 4.86 or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        floorsGarageRSI: e.target.value
                    }))} />
                    {selections.floorsGarageRSI && parseFloat(selections.floorsGarageRSI) < 4.86 && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>RSI Value Too Low</AlertTitle>
                            <AlertDescription>
                                The RSI value must be at least 4.86 to meet NBC requirements for floors over garages.
                            </AlertDescription>
                        </Alert>
                    )}
                    <EffectiveRSIWarning />
                </div>

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

                <div className="space-y-2">
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
                    }))} />
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

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground">Airtightness Level (Unguarded Testing)</label>
                        <InfoButton title="What's a Blower Door Test?">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-base text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                                </div>

                                <div className="w-full h-px bg-muted"></div>

                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-medium text-base mb-2">What Do the Numbers Mean?</h5>
                                        <div className="space-y-3 text-base text-muted-foreground">
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
                                        <h5 className="font-medium text-base mb-2">What's a Zone?</h5>
                                        <p className="text-base text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                        <div className="text-base text-muted-foreground ml-4 space-y-1">
                                            <p>• A full detached house</p>
                                            <p>• A single unit in a row house or duplex</p>
                                            <p>• A section of a large home or multi-unit building</p>
                                        </div>
                                        <p className="text-base text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-base mb-2">What's an Attached Zone?</h5>
                                        <p className="text-base text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-base mb-2">Why Small Units Often Show Higher Leakage</h5>
                                        <div className="text-base text-muted-foreground ml-4 space-y-1">
                                            <p>• Small homes have more corners and connections relative to their size.</p>
                                            <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                            <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-base mb-2">Guarded vs. Unguarded Testing</h5>
                                        <div className="space-y-3 text-base text-muted-foreground">
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
                                        <h5 className="font-medium text-base mb-2">How Do You Pass?</h5>
                                        <p className="text-base text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                        <div className="text-base text-muted-foreground ml-4 space-y-1">
                                            <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                            <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                        </div>
                                        <p className="text-base text-muted-foreground mt-2">The design air leakage rate, established by the builder and energy modeller, is incorporated into the energy model and later verified through testing at either the mid-construction or final stage. If the measured air changes per hour (ACH, if chosen) exceed the code-specified airtightness level, the building fails; if the measured ACH is lower, it passes.</p>                                            
                                        <p className="text-base text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-base mb-2">Other Key Points</h5>
                                        <div className="text-base text-muted-foreground ml-4 space-y-1">
                                            <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                            <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                            <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different. Reference the Illustrated Guide for the image above.</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div>
                                        <h5 className="font-medium text-base mb-2">Potential Air Leakage Locations</h5>
                                        <p className="text-base text-muted-foreground mb-3">Common areas where air leakage occurs in buildings:</p>
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
                                        <p className="text-base font-medium text-blue-800 dark:text-blue-300">📋 Helpful Resources:</p>
                                        <div className="space-y-1">
                                            <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-base text-blue-700 dark:text-blue-400 hover:text-red-800 dark:hover:text-red-400 block">
                                                🔗 View the Blower Door Checklist
                                            </a>
                                            <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-base text-blue-700 dark:text-blue-400 hover:text-red-800 dark:hover:text-red-400 block">
                                                🔗 More airtightness information
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InfoButton>
                    </div>
                </div>
            </>
            }
        </>
    );
}