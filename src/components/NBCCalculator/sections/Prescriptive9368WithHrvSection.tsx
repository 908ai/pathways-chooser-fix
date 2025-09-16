import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import InfoButton from "@/components/InfoButton";

import { wallRSIOptions, belowGradeRSIOptions, windowUValueOptions, waterHeaterOptions, airtightnessOptions } from "../constants/options";
import { validateRSI } from "../utils/validation";

interface Props {
    selections: any;
    setSelections: React.Dispatch<React.SetStateAction<any>>;
    WarningButton: React.FC<any>;
}

export const Prescriptive9368WithHrvSection: React.FC<Props> = ({ selections, setSelections, WarningButton }) => {
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
                                <p className="text-sm text-foreground/80">
                                    {validation.warning.message}
                                </p>
                            </WarningButton>;
                        }
                        return null;
                    })()}
                    <WarningButton warningId="cathedralFlatRSI-general" title="Effective RSI/R-Value Required">
                        <p className="text-xs text-foreground/80">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </WarningButton>
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
                    {selections.wallRSI && <WarningButton warningId="wallRSI-info" title="Effective RSI/R-Value Required">
                        <p className="text-sm text-foreground/80">
                            To claim points under the NBC prescriptive path, you must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </WarningButton>}
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
                    {selections.belowGradeRSI && <WarningButton warningId="belowGradeRSI-info" title="Effective RSI/R-Value Required">
                        <p className="text-xs text-foreground/80">
                            To claim points under the NBC prescriptive path, you must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </WarningButton>}
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
                    <WarningButton warningId="cathedralFlatRSI-info" title="Effective RSI/R-Value Required">
                        <p className="text-xs text-foreground/80">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </WarningButton>
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
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </div>}
                    <WarningButton warningId="cathedralFlatRSI-general" title="Effective RSI/R-Value Required">
                        <p className="text-xs text-foreground/80">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                    </WarningButton>
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
                            <p className="text-xs text-destructive/80">
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
                    <WarningButton warningId="inFloorHeating-info" title="In-Floor Heating Requirements">
                        <p className="text-xs text-foreground/80">
                            Since the house has in-floor heating, all floors must be insulated to meet NBC requirements.
                        </p>
                    </WarningButton>

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
                                    <p className="text-xs text-foreground/80">
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
                            <p className="text-xs text-destructive/80">
                                The RSI value must be increased to at least 1.96 to meet NBC requirements for unheated floor above frost line.
                            </p>
                        </WarningButton>}
                    </div>
                </>}

                <WarningButton warningId="wallRSI-info" title="Effective RSI/R-Value Required">
                    <p className="text-xs text-foreground/80">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>

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
                        <WarningButton warningId="windowDoor-verification" title="Window & Door Performance Verification">
                            <p className="text-xs text-foreground/80">
                                Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please only record the lowest performing window and door (U-Value (ie, highest U-value W/(m²×K)).
                            </p>
                        </WarningButton>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-100">Energy Efficiency Points for Windows & Doors</label>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                        <Info className="h-3 w-3 mr-1" />
                                        More Info
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Energy Efficiency Points for Windows & Doors</DialogTitle>
                                    </DialogHeader>
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
                                </DialogContent>
                            </Dialog>
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

                {selections.hasSkylights === "yes" && <WarningButton warningId="skylight-shaft-insulation-9367" title="Important: Skylight Shaft Insulation">
                    <p className="text-xs text-foreground/80">
                        Skylight shafts must be insulated. Be prepared to provide further details upon request.
                    </p>
                </WarningButton>}
            </>}
        </>
    );
};