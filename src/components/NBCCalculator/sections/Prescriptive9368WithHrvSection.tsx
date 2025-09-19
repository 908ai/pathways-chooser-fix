import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, ChevronDown, AlertTriangle } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { wallRSIOptions, belowGradeRSIOptions, windowUValueOptions, waterHeaterOptions, airtightnessOptions } from "../constants/options";
import { validateRSI } from "../utils/validation";

interface Props {
    selections: any;
    setSelections: React.Dispatch<React.SetStateAction<any>>;
    WarningButton: React.FC<any>;
}

export const Prescriptive9368WithHrvSection: React.FC<Props> = ({ selections, setSelections, WarningButton }) => {

        // Collapsible component for warnings/info
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
                        if (!validation.isValid && validation.warning) {
                            return <WarningButton warningId={`cathedralFlatRSI-${validation.warning.type}`} title={validation.warning.type === "rvalue-suspected" ? "R-Value Detected" : "RSI Value Too Low"} variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}>
                                <p className="text-sm text-white">
                                    {validation.warning.message}
                                </p>
                            </WarningButton>;
                        }
                        return null;
                    })()}
                    <InfoCollapsible title="ℹ️ Effective RSI/R-Value Required">
                        <p className="text-xs text-white">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </InfoCollapsible>
                </div>}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Above Grade Walls</label>
                    <Select value={selections.wallRSI} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        wallRSI: value
                    }))}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                            <SelectValue placeholder="Select wall RSI value (e.g., R20 Batt/2x6/16&quot;OC)" />
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
                    {selections.wallRSI && <InfoCollapsible title="ℹ️ Effective RSI/R-Value Required">
                        <p className="text-xs text-white">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </InfoCollapsible>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Below Grade Walls (Foundation Walls)</label>
                    <Select value={selections.belowGradeRSI} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        belowGradeRSI: value
                    }))}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                            <SelectValue placeholder="Select below grade RSI value (e.g., R12 Batt/2x4/24&quot;OC)" />
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
                    {selections.belowGradeRSI && <InfoCollapsible title="ℹ️ Effective RSI/R-Value Required">
                        <p className="text-xs text-white">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </InfoCollapsible>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                    <Input type="number" step="0.01" min="0" placeholder="Min. RSI 5.02 or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        floorsUnheatedRSI: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                    {selections.floorsUnheatedRSI && parseFloat(selections.floorsUnheatedRSI) < 5.02 && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-sm text-destructive font-medium">
                            ⚠️ Effective RSI/R-Value Required
                        </p>
                        <p className="text-sm text-destructive/80 mt-1">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </div>}
                    <InfoCollapsible title="ℹ️ Effective RSI/R-Value Required">
                        <p className="text-xs text-foreground/80">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </InfoCollapsible>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Floors over Garage (Bonus Floor)</label>
                    <Input type="number" step="0.01" min="0" placeholder="Min RSI 4.86 or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                        ...prev,
                        floorsGarageRSI: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                    {selections.floorsGarageRSI && parseFloat(selections.floorsGarageRSI) < 4.86 && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-sm text-destructive font-medium">
                            ⚠️ Effective RSI/R-Value Required
                        </p>
                        <p className="text-sm text-destructive/80 mt-1">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </div>}
                    <InfoCollapsible title="ℹ️ Effective RSI/R-Value Required">
                        <p className="text-xs text-white">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </InfoCollapsible>
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

                {selections.hasSlabOnGrade === "yes" && <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-100">Slab on Grade with Integral Footing</label>
                        <Input type="number" step="0.01" min="0" placeholder="Min RSI 2.84 or N/A" value={selections.slabOnGradeRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            slabOnGradeRSI: e.target.value
                        }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                        {selections.slabOnGradeRSI && parseFloat(selections.slabOnGradeRSI) < 2.84 && <WarningButton warningId="slabOnGradeRSI-low" title="RSI Value Too Low" variant="destructive">
                            <p className="text-xs text-white">
                                The RSI value must be increased to at least 2.84 to meet NBC requirements for slab on grade with integral footing.
                            </p>
                        </WarningButton>}
                    </div>
                </div>}

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

                {(selections.hasInFloorHeat === "yes" || selections.floorsSlabsSelected.includes('heatedFloors')) && <>
                    <InfoCollapsible title="ℹ️ In-Floor Heating Requirements">
                        <p className="text-xs text-white">
                            Since the house has in-floor heating, all floors must be insulated to meet NBC requirements.
                        </p>
                    </InfoCollapsible>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-100">Heated Floors</label>
                        <Input type="number" step="0.01" min="0" placeholder={`Enter RSI value (minimum ${selections.province === "saskatchewan" ? "2.84" : "1.34"})`} value={selections.heatedFloorsRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            heatedFloorsRSI: e.target.value
                        }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                        {(() => {
                            const minRSI = selections.province === "saskatchewan" ? 2.84 : 1.34;
                            const validation = validateRSI(selections.heatedFloorsRSI, minRSI, `heated floors in ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`);
                            if (!validation.isValid && validation.warning) {
                                return <WarningButton warningId={`heatedFloorsRSI-${validation.warning.type}`} title={validation.warning.type === "rvalue-suspected" ? "R-Value Detected" : "RSI Value Too Low"} variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}>
                                    <p className="text-xs text-white">
                                        {validation.warning.message}
                                    </p>
                                </WarningButton>;
                            }
                            return null;
                        })()}
                    </div>
                </>}

                {selections.hasInFloorHeat === "no" && <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-100">Unheated Floor Below Frost Line</label>
                        <Input type="text" placeholder="Enter RSI value or 'uninsulated'" value={selections.unheatedFloorBelowFrostRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            unheatedFloorBelowFrostRSI: e.target.value
                        }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                        <div className="p-3 bg-muted border border-border rounded-md">
                            <p className="text-sm text-foreground font-medium">
                                ℹ️ Unheated Floor Below Frost Line
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                This assembly typically remains uninsulated as per NBC requirements but can be insulated to improve comfort in these areas. Enter 'uninsulated' or specify an RSI value if insulation is provided.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-100">Unheated Floor Above Frost Line</label>
                        <Input type="number" step="0.01" min="0" placeholder="Min RSI 1.96 (R-11.1)" value={selections.unheatedFloorAboveFrostRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            unheatedFloorAboveFrostRSI: e.target.value
                        }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                        {selections.unheatedFloorAboveFrostRSI && parseFloat(selections.unheatedFloorAboveFrostRSI) < 1.96 && <WarningButton warningId="unheatedFloorAboveFrostRSI-low" title="RSI Value Too Low" variant="destructive">
                            <p className="text-xs text-white">
                                The RSI value must be increased to at least 1.96 to meet NBC requirements for unheated floor above frost line.
                            </p>
                        </WarningButton>}
                    </div>
                </>}

                <InfoCollapsible title="ℹ️ Effective RSI/R-Value Required">
                    <p className="text-xs text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </InfoCollapsible>

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
                        <InfoCollapsible title="ℹ️ Window & Door Performance Verification">
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
                    <Input type="number" step="0.01" min="0" placeholder={`Enter U-value (maximum ${selections.province === "alberta" && selections.climateZone === "7B" ? "2.41" : "2.75"} W/(m²·K))`} value={selections.skylightUValue} onChange={e => setSelections(prev => ({
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
                        <label className="text-sm font-medium text-slate-100">Airtightness Level (Unguarded Testing)</label>
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
                                </div>

                                <div className="space-y-2">
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                        <p className="text-xs font-medium text-blue-800">📋 Helpful Resources:</p>
                                        <div className="space-y-1">
                                            <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                                View the Blower Door Checklist
                                            </a>
                                            <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                                More airtightness information
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
                                    Mid-Construction Blower Door Test Planned
                                </label>
                            </div>
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
                                    <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300">
                                        View the Blower Door Checklist
                                    </a>
                                </div>
                            </div>
                        </InfoCollapsible>
                    </div>
                </div>


                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Heating Type</label>
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

                <div className="p-4 bg-muted border border-border rounded-md">
                    <p className="text-sm font-medium text-slate-950">
                        ⚠️ Mechanical Equipment Documentation
                    </p>
                    <p className="text-xs mt-1 text-slate-950">
                        The Authority Having Jurisdiction (AHJ) may request specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations. More info at: 🔗 <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">https://solinvictusenergyservices.com/cancsa-f28012</a>
                    </p>
                </div>

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
            </>}
        </>
    );
};