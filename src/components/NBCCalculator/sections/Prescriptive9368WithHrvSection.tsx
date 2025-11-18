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
    validationErrors: Record<string, boolean>;
}

export const Prescriptive9368WithHrvSection: React.FC<Props> = ({ selections, setSelections, WarningButton, validationErrors }) => {

    const heatPumpOptions = [
        { value: "Air-Source Heat Pump – Split (SEER 14.5, EER 11.5, HSPF 7.1)", label: "Air-Source Heat Pump – Split (SEER 14.5, EER 11.5, HSPF 7.1)" },
        { value: "Air-Source Heat Pump – Single Package (SEER 14.0, EER 11.0, HSPF 7.0)", label: "Air-Source Heat Pump – Single Package (SEER 14.0, EER 11.0, HSPF 7.0)" },
        { value: "Ground-Source Heat Pump – Closed Loop (COPc ≥ 3.6, COPh ≥ 3.1)", label: "Ground-Source Heat Pump – Closed Loop (COPc ≥ 3.6, COPh ≥ 3.1)" },
        { value: "Ground-Source Heat Pump – Open Loop (COPc ≥ 4.75, COPh ≥ 3.6)", label: "Ground-Source Heat Pump – Open Loop (COPc ≥ 4.75, COPh ≥ 3.6)" },
        { value: "Other", label: "Other (Manual Entry Required)" }
    ];

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

    return (
        <>
            {<>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-100">Have you completed the required CSA-F280 Calculation for heating and cooling loads?</label>
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
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                            <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>



                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Is there any cathedral ceilings or flat roof?</label>
                    <Select value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        hasCathedralOrFlatRoof: value,
                        cathedralFlatRSI: ""
                    }))}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selections.hasCathedralOrFlatRoof === "yes" && <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Cathedral / Flat Roofs</label>
                    <Input type="number" step="0.01" min="0" placeholder="Min RSI 5.02 or N/A" value={selections.cathedralFlatRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        cathedralFlatRSI: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
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
                    <label className="text-sm font-medium text-slate-100">Above Grade Walls</label>
                    <Select value={selections.wallRSI} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        wallRSI: value
                    }))}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
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
                    <label className="text-sm font-medium text-slate-100">Below Grade Walls (Foundation Walls)</label>
                    <Select value={selections.belowGradeRSI} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        belowGradeRSI: value
                    }))}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
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
                    <label className="text-sm font-medium text-slate-100">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                    <Input type="number" step="0.01" min="0" placeholder="Min. RSI 5.02 or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        floorsUnheatedRSI: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                    {selections.floorsUnheatedRSI && parseFloat(selections.floorsUnheatedRSI) < 5.02 && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md" style={{ backgroundColor: 'beige' }}>
                        <p className="text-sm text-destructive font-medium">
                            ⚠️ Effective RSI/R-Value Required
                        </p>
                        <p className="text-sm text-destructive/100 mt-1">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the 🔗<a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-900">NRCan RSI tables</a> or the 🔗<a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-900">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </div>}
                    <EffectiveRSIWarning />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Floors over Garage (Bonus Floor)</label>
                    <Input type="number" step="0.01" min="0" placeholder="Min RSI 4.86 or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        floorsGarageRSI: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                    {selections.floorsGarageRSI && parseFloat(selections.floorsGarageRSI) < 4.86 && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md" style={{ backgroundColor: 'beige' }}>
                        <p className="text-sm text-destructive font-medium">
                            ⚠️ Effective RSI/R-Value Required
                        </p>
                        <p className="text-sm text-destructive/100 mt-1">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the 🔗<a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-900">NRCan RSI tables</a> or the 🔗<a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-900">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </div>}
                    <EffectiveRSIWarning />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Does the house have a slab on grade with Integral Footing?</label>
                    <Select value={selections.hasSlabOnGrade} onValueChange={value => {
                        setSelections(prev => ({
                            ...prev,
                            hasSlabOnGrade: value,
                            slabOnGradeRSI: ""
                        }));
                    }}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
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
                            <label className="text-sm font-medium text-slate-100">
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
                                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400"
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
                    <label className="text-sm font-medium text-slate-100">Is the house installing or roughing in in-floor heat?</label>
                    <Select value={selections.hasInFloorHeat} onValueChange={value => {
                        setSelections(prev => ({
                            ...prev,
                            hasInFloorHeat: value,
                            unheatedFloorBelowFrostRSI: "",
                            unheatedFloorAboveFrostRSI: "",
                            heatedFloorsRSI: ""
                        }));
                    }}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
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
                                <p className="text-xs text-white">
                                    Since the house has in-floor heating, all floors must be insulated to
                                    meet NBC requirements.
                                </p>
                            </InfoCollapsible>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-100">
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
                                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400"
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
                    <label className="text-sm font-medium text-slate-100">
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
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400"
                    />

                    <InfoCollapsible title="ℹ️ Unheated Floor Below Frost Line" defaultOpen={false}>
                        <p className="text-xs text-white">
                        This assembly typically remains uninsulated as per NBC requirements
                        but can be insulated to improve comfort in these areas. Enter
                        <code className="px-1">uninsulated</code> or specify an RSI value if
                        insulation is provided.
                        </p>
                    </InfoCollapsible>
                    </div>

                    <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">
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
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400"
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
                    <label className="text-sm font-medium text-slate-100">Window & Door U-Value (W/(m²·K))</label>
                    <Select value={selections.windowUValue} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        windowUValue: value
                    }))}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
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
                            <p className="text-xs text-white">
                                Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please only record the lowest performing window and door (U-Value (ie, highest U-value W/(m²×K)).
                            </p>
                        </InfoCollapsible>

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
                    <label className="text-sm font-medium text-slate-100">Does the house have skylights?</label>
                    <Select value={selections.hasSkylights} onValueChange={value => {
                        setSelections(prev => ({
                            ...prev,
                            hasSkylights: value,
                            skylightUValue: ""
                        }));
                    }}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                            <SelectValue placeholder="Select if house has skylights" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selections.hasSkylights === "yes" && <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Skylight U-Value</label>
                    <Input type="text" placeholder={`Enter U-value (maximum ${selections.province === "alberta" && selections.climateZone === "7B" ? "2.41" : "2.75"} W/(m²·K))`} value={selections.skylightUValue} onChange={e => setSelections(prev => ({
                        ...prev,
                        skylightUValue: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
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
                    <p className="text-xs white">
                        Skylight shafts must be insulated. Be prepared to provide further details upon request.
                    </p>
                </InfoCollapsible>}

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
                        heatingType: value,
                        heatingEfficiency: "",
                        otherHeatingEfficiency: "",
                        indirectTank: value !== 'boiler' ? '' : prev.indirectTank,
                        indirectTankSize: value !== 'boiler' ? '' : prev.indirectTankSize,
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

                <div className="p-4 bg-muted border border-border rounded-md">
                    <p className="text-sm font-medium text-slate-950">
                        ⚠️ Mechanical Equipment Documentation
                    </p>
                    <p className="text-xs mt-1 text-slate-950">
                        The Authority Having Jurisdiction (AHJ) may verify specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations. More info at: 🔗 <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">https://solinvictusenergyservices.com/cancsa-f28012</a>
                    </p>
                </div>

                {selections.heatingType && (
                <div id="heatingEfficiency" className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-100">
                            {selections.heatingType === 'heat-pump' ? 'Heat Pump Type and Efficiency' : 'Heating Efficiency'} <span className="text-red-400">*</span>
                        </label>
                        {selections.heatingType === 'heat-pump' && (
                            <InfoButton title="Heat Pump Efficiency">
                                Select the applicable heat pump type to automatically apply the minimum efficiency requirement based on NBC Table 9.36.3.10. If your system type or performance rating is not listed, choose Other and enter specifications manually.
                            </InfoButton>
                        )}
                    </div>
                    {selections.heatingType === 'heat-pump' ? (
                        <>
                            <Select required value={selections.heatingEfficiency} onValueChange={value => setSelections(prev => ({ ...prev, heatingEfficiency: value, otherHeatingEfficiency: "" }))}>
                                <SelectTrigger className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.heatingEfficiency && "border-red-500 ring-2 ring-red-500")}>
                                    <SelectValue placeholder="Select heat pump type and efficiency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {heatPumpOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selections.heatingEfficiency === 'Other' && (
                                <div className="mt-2 space-y-2">
                                    <Input
                                        required
                                        type="text"
                                        placeholder="Enter specifications manually"
                                        value={selections.otherHeatingEfficiency || ''}
                                        onChange={e => setSelections(prev => ({ ...prev, otherHeatingEfficiency: e.target.value }))}
                                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400"
                                    />
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" className="h-6 px-2 text-xs">
                                                View HVAC Equipment Performance Requirements
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            <DialogHeader>
                                                <DialogTitle>Table 9.36.3.10 - HVAC Equipment Performance Requirements</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                                                <img src="/assets/img/table-9.36.3.10-a.png" alt="HVAC Performance Requirements Table Part 1" />
                                                <img src="/assets/img/table-9.36.3.10-b.png" alt="HVAC Performance Requirements Table Part 2" />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                        </>
                    ) : (
                        <Input required type="text" placeholder={selections.heatingType === 'boiler' ? "Enter heating efficiency (e.g. 90% AFUE)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                            ...prev,
                            heatingEfficiency: e.target.value
                        }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.heatingEfficiency && "border-red-500 ring-2 ring-red-500")} />
                    )}
                    {selections.heatingEfficiency && selections.heatingType !== 'heat-pump' && (() => {
                        const inputValue = parseFloat(selections.heatingEfficiency);
                        let minValue = 0;
                        let systemType = "";
                        if (selections.heatingType === 'boiler') {
                            minValue = 90;
                            systemType = "Boiler (90% AFUE minimum)";
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
                </div>
            )}

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
            </>}
        </>
    );
}