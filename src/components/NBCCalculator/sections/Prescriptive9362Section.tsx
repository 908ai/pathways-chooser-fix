import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { validateRSI_9362 } from "../utils/validation";

export default function Prescriptive9362Section({
    selections,
    setSelections,
}: {
    selections: any;
    setSelections: any;
}) {
    const [expandedWarnings, setExpandedWarnings] = useState<{ [key: string]: boolean }>({});

    const toggleWarning = (warningId: string) => {
        setExpandedWarnings((prev) => ({
            ...prev,
            [warningId]: !prev[warningId],
        }));
    };

    const WarningButton = ({
        warningId,
        title,
        children,
        variant = "warning",
    }: {
        warningId: string;
        title: string;
        children: React.ReactNode;
        variant?: "warning" | "destructive";
    }) => {
        const isExpanded = expandedWarnings[warningId];
        const bgColor =
            variant === "warning"
                ? "bg-gradient-to-r from-slate-800/60 to-teal-800/60"
                : "bg-gradient-to-r from-slate-800/60 to-red-800/60";
        const borderColor =
            variant === "warning" ? "border-2 border-orange-400" : "border-2 border-red-400";

        return (
            <div className={`p-4 ${bgColor} ${borderColor} rounded-lg backdrop-blur-sm`}>
                <button
                    onClick={() => toggleWarning(warningId)}
                    className="flex items-center gap-3 w-full text-left"
                >
                    <span className="text-lg font-bold text-white">{title}</span>
                </button>
                {isExpanded && (
                    <div className="mt-4 animate-accordion-down">
                        <div className="text-white font-semibold">{children}</div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* HRV/ERV Section for 9362 */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Does this building include an HRV or ERV?</label>
                    <Dialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-100">
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>More Info</p>
                            </TooltipContent>
                        </Tooltip>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Should I include an HRV (Heat Recovery Ventilator)?</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Should I include an HRV (Heat Recovery Ventilator)?</h4>
                                    <p className="text-xs text-muted-foreground">
                                        An HRV is a system that brings in fresh outdoor air while recovering heat from the stale indoor air it exhausts. It improves indoor air quality and energy efficiency — especially in airtight homes.
                                    </p>
                                </div>

                                <div>
                                    <h5 className="font-medium text-sm mb-1">Why you should consider an HRV:</h5>
                                    <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                        <li><strong>Better indoor air quality:</strong> Removes stale air, moisture, odors, and pollutants while bringing in fresh air.</li>
                                        <li><strong>Energy savings:</strong> Recovery up to 80-90% of the heat from outgoing air, reducing heating costs.</li>
                                        <li><strong>Comfort:</strong> Maintains consistent temperatures and humidity levels throughout your home.</li>
                                        <li><strong>Code compliance:</strong> In many cases, an HRV can help you meet building envelope requirements with less insulation.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="font-medium text-sm mb-1">When is an HRV required?</h5>
                                    <p className="text-xs text-muted-foreground">
                                        While not always mandatory, HRVs are required or strongly recommended for homes with very low air leakage rates (typically below 2.5 ACH50) to ensure adequate ventilation. They're also required for certain energy efficiency programs.
                                    </p>
                                </div>

                                <div>
                                    <h5 className="font-medium text-sm mb-1">HRV vs. ERV:</h5>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p><strong>HRV (Heat Recovery Ventilator):</strong> Recovers heat only. Best for cold, dry climates like most of Canada.</p>
                                        <p><strong>ERV (Energy Recovery Ventilator):</strong> Recovers both heat and moisture. Better for humid climates or homes with high humidity issues.</p>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <Select value={selections.hasHrv} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasHrv: value
                }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="with_hrv">Yes - with HRV/ERV</SelectItem>
                        <SelectItem value="without_hrv">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.hasHrv === "with_hrv" && <div className="space-y-2">
                <label className="text-sm font-medium">HRV/ERV Efficiency</label>
                <Input type="text" placeholder="Input HRV/ERV efficiency (e.g. SRE 65%)" value={selections.hrvEfficiency || ""} onChange={e => setSelections(prev => ({
                    ...prev,
                    hrvEfficiency: e.target.value
                }))} />
            </div>}

            {/* Secondary Suite HRV - Show for buildings with multiple units */}
            {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                <h5 className="font-medium text-foreground">Secondary Suite HRV/ERV</h5>

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium">Will there be a second HRV/ERV for the secondary suite?</label>
                        <Dialog>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-100">
                                            <Info className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>More Info</p>
                                </TooltipContent>
                            </Tooltip>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Secondary Suite HRV/ERV Information</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Independent HRV/ERV for Secondary Suite</h4>
                                        <p className="text-xs text-muted-foreground">
                                            A secondary suite may require its own HRV/ERV system to ensure adequate ventilation and maintain indoor air quality independently from the main dwelling unit.
                                        </p>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-1">When a second HRV/ERV is needed:</h5>
                                        <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                            <li><strong>Separate ventilation zones:</strong> When the secondary suite requires independent air quality control.</li>
                                            <li><strong>Building code requirements:</strong> Some jurisdictions require separate ventilation systems for secondary suites.</li>
                                            <li><strong>Different occupancy patterns:</strong> When main and secondary units have different ventilation needs.</li>
                                            <li><strong>Privacy and control:</strong> Allowing tenants to control their own indoor air quality.</li>
                                        </ul>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasSecondaryHrv" value="yes" checked={selections.hasSecondaryHrv === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHrv: e.target.value,
                                secondaryHrvEfficiency: "" // Reset when changing
                            }))} className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasSecondaryHrv" value="no" checked={selections.hasSecondaryHrv === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHrv: e.target.value,
                                secondaryHrvEfficiency: ""
                            }))} className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasSecondaryHrv === "yes" && <div className="space-y-2">
                    <label className="text-sm font-medium">Secondary Suite HRV/ERV Efficiency</label>
                    <Input type="text" placeholder="Input HRV/ERV efficiency (e.g. SRE 65%)" value={selections.secondaryHrvEfficiency || ""} onChange={e => setSelections(prev => ({
                        ...prev,
                        secondaryHrvEfficiency: e.target.value
                    }))} />
                </div>}
            </div>}

            <div className="space-y-2">
                <label className="text-sm font-medium">Ceilings below Attics</label>
                <Input type="text" placeholder={selections.hasHrv === "with_hrv" ? "Min RSI 8.67 w/ HRV" : selections.hasHrv === "without_hrv" ? "Min RSI 10.43 w/o HRV" : "Min RSI 8.67 w/ HRV, 10.43 w/o HRV"} value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    ceilingsAtticRSI: e.target.value
                }))} />
                {selections.buildingType !== "single-detached-secondary" && (() => {
                    // For 9.36.2: 8.67 RSI with HRV, 10.43 RSI without HRV
                    const minRSI = selections.hasHrv === "with_hrv" ? 8.67 : selections.hasHrv === "without_hrv" ? 10.43 : 8.67;
                    const validation = validateRSI_9362(selections.ceilingsAtticRSI, minRSI, `ceilings below attics`);
                    if (!validation.isValid && validation.warning) {
                        return <WarningButton warningId="ceilingsAtticRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                            <p className="text-sm text-destructive/80">
                                {`The RSI value must be increased to at least ${selections.hasHrv === "with_hrv" ? "8.67 with HRV" : selections.hasHrv === "without_hrv" ? "10.43 without HRV" : "8.67 with HRV or 10.43 without HRV"} to meet NBC 9.36.2 requirements.`}
                            </p>
                        </WarningButton>;
                    }
                    return null;
                })()}
                {selections.buildingType !== "single-detached-secondary" && <WarningButton warningId="ceilingsAtticRSI-9362" title="Effective RSI/R-Value Required">
                    <p className="text-sm text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Is there any cathedral ceilings or flat roof?</label>
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
                <label className="text-sm font-medium">Cathedral / Flat Roofs - Min. 5.02 RSI</label>
                <Input type="text" placeholder="Enter RSI value (min. 5.02)" value={selections.cathedralFlatRSIValue || ""} onChange={e => setSelections(prev => ({
                    ...prev,
                    cathedralFlatRSIValue: e.target.value
                }))} />
                {(() => {
                    const minRSI = 5.02;
                    const validation = validateRSI_9362(selections.cathedralFlatRSIValue, minRSI, `cathedral/flat roofs`);
                    if (!validation.isValid && validation.warning) {
                        return <WarningButton warningId="cathedralFlatRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                            <p className="text-sm text-destructive/80">
                                {`The RSI value must be increased to at least 5.02 to meet NBC 9.36.2 requirements for cathedral/flat roofs.`}
                            </p>
                        </WarningButton>;
                    }
                    return null;
                })()}
                <WarningButton warningId="cathedralFlatRSI-9362" title="Effective RSI Value Required">
                    <p className="text-sm text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>
            </div>}

            <div className="space-y-2">
                <label className="text-sm font-medium">Above Grade Walls</label>
                <Input type="text" placeholder={selections.hasHrv === "with_hrv" ? 'Min RSI 2.97 w/ HRV (e.g., R20 Batt/2x6/16"OC)' : selections.hasHrv === "without_hrv" ? 'Min RSI 3.69 w/o HRV (e.g., R20 Batt/2x6/16"OC)' : 'Min RSI 2.97 w/ HRV, 3.69 w/o HRV (e.g., R20 Batt/2x6/16"OC)'} value={selections.wallRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    wallRSI: e.target.value
                }))} />
                {(() => {
                    const minRSI = selections.hasHrv === "with_hrv" ? 2.97 : 3.69;
                    const validation = validateRSI_9362(selections.wallRSI, minRSI, `above grade walls`);
                    if (!validation.isValid && validation.warning) {
                        return <WarningButton warningId="wallRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                            <p className="text-sm text-destructive/80">
                                {`The RSI value must be increased to at least ${selections.hasHrv === "with_hrv" ? "2.97 with HRV" : "3.69 without HRV"} to meet NBC 9.36.2 requirements for above grade walls.`}
                            </p>
                        </WarningButton>;
                    }
                    return null;
                })()}
                <WarningButton warningId="wallRSI-9362" title="Effective RSI/R-Value Required">
                    <p className="text-sm text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Below Grade Walls (Foundation Walls)</label>
                <Input type="text" placeholder={selections.hasHrv === "with_hrv" ? "Min RSI 2.98 (with HRV, e.g., R12 Batt/2x4/24\"OC)" : selections.hasHrv === "without_hrv" ? "Min RSI 3.46 (without HRV, e.g., R12 Batt/2x4/24\"OC)" : "Select HRV option first"} value={selections.belowGradeRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    belowGradeRSI: e.target.value
                }))} />
                {(() => {
                    const minRSI = selections.hasHrv === "with_hrv" ? 2.98 : 3.46;
                    const validation = validateRSI_9362(selections.belowGradeRSI, minRSI, `below grade walls`);
                    if (!validation.isValid && validation.warning) {
                        return <WarningButton warningId="belowGradeRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                            <p className="text-sm text-destructive/80">
                                {`The RSI value must be increased to at least ${selections.hasHrv === "with_hrv" ? "2.98 with HRV" : "3.46 without HRV"} to meet NBC 9.36.2 requirements for below grade walls.`}
                            </p>
                        </WarningButton>;
                    }
                    return null;
                })()}
                <WarningButton warningId="belowGradeRSI-9362" title="Effective RSI/R-Value Required">
                    <p className="text-sm text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium">Floors/Slabs (Select all that apply)</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedBelowFrost")} onChange={e => {
                            const value = "unheatedBelowFrost";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm">Unheated Floor Below Frostline</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedAboveFrost")} onChange={e => {
                            const value = "unheatedAboveFrost";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm">Unheated Floor Above Frost Line (or walk-out basement)</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("heatedFloors")} onChange={e => {
                            const value = "heatedFloors";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value),
                                hasInFloorHeat: e.target.checked ? "yes" : "no"
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm">Heated Floors</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")} onChange={e => {
                            const value = "slabOnGradeIntegralFooting";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm">Slab on grade with integral Footing</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsOverUnheatedSpaces")} onChange={e => {
                            const value = "floorsOverUnheatedSpaces";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</span>
                    </label>
                </div>
            </div>

            {selections.floorsSlabsSelected.includes("heatedFloors") && <div className="space-y-2">
                <label className="text-sm font-medium">Heated Floors</label>
                <Input type="text" placeholder={`Min RSI ${selections.province === "saskatchewan" ? "2.84 (R-16.1)" : "1.34 (R-7.6)"} for ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`} value={selections.inFloorHeatRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    inFloorHeatRSI: e.target.value
                }))} />
                {(() => {
                    const minRSI = selections.province === "saskatchewan" ? 2.84 : 1.34;
                    const validation = validateRSI_9362(selections.inFloorHeatRSI, minRSI, `heated floors`);
                    if (!validation.isValid && validation.warning) {
                        return <WarningButton warningId="inFloorHeatRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                            <p className="text-sm text-destructive/80">
                                The RSI value must be increased to at least {minRSI} to meet NBC 9.36.2 requirements for heated floors in {selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}.
                            </p>
                        </WarningButton>;
                    }
                    return null;
                })()}
                <WarningButton warningId="inFloorHeatRSI-9362" title="Effective RSI/R-Value Required">
                    <p className="text-sm text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>
            </div>}

            {selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting") && <div className="space-y-2">
                <label className="text-sm font-medium">Slab on grade with integral Footing</label>
                <Input type="text" placeholder="Min RSI 2.84 or N/A" value={selections.slabOnGradeIntegralFootingRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    slabOnGradeIntegralFootingRSI: e.target.value
                }))} />
                <WarningButton warningId="slabOnGradeIntegralFootingRSI-9362" title="Effective RSI/R-Value Required">
                    <p className="text-sm text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>

                {selections.slabOnGradeIntegralFootingRSI && !isNaN(parseFloat(selections.slabOnGradeIntegralFootingRSI)) && parseFloat(selections.slabOnGradeIntegralFootingRSI) < 2.84 && <WarningButton warningId="slabOnGradeIntegralFootingRSI-min" title="RSI Value Too Low" variant="destructive">
                    <p className="text-xs text-destructive/80">
                        The RSI value must be at least 2.84 to meet NBC 9.36.2 minimum requirements for slab on grade with integral footing.
                    </p>
                </WarningButton>}
            </div>}

            {selections.floorsSlabsSelected.includes("floorsOverUnheatedSpaces") && <div className="space-y-2">
                <label className="text-sm font-medium">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                <Input type="text" placeholder="Min RSI 5.02" value={selections.floorsOverUnheatedSpacesRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsOverUnheatedSpacesRSI: e.target.value
                }))} />
                <WarningButton warningId="floorsOverUnheatedSpacesRSI-9362" title="Effective RSI/R-Value Required">
                    <p className="text-sm text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>
            </div>}

            {selections.floorsSlabsSelected.includes("unheatedBelowFrost") && <div className="space-y-2">
                <label className="text-sm font-medium">Unheated Floor Below Frost Line</label>
                <Input type="text" placeholder="Enter RSI value or 'uninsulated'" value={selections.unheatedFloorBelowFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorBelowFrostRSI: e.target.value
                }))} />
                <div className="p-3 bg-muted border border-border rounded-md">
                    <p className="text-sm text-white font-medium">
                        ℹ️ Unheated Floor Below Frost Line
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        This assembly typically remains uninsulated as per NBC requirements but can be insulated to improve comfort in these areas. Enter 'uninsulated' or specify an RSI value if insulation is provided.
                    </p>
                </div>
            </div>}

            {selections.floorsSlabsSelected.includes("unheatedAboveFrost") && <div className="space-y-2">
                <label className="text-sm font-medium">Unheated Floor Above Frost Line</label>
                <Input type="number" step="0.01" min="0" placeholder="Minimum RSI 1.96" value={selections.unheatedFloorAboveFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorAboveFrostRSI: e.target.value
                }))} />
                {selections.unheatedFloorAboveFrostRSI && parseFloat(selections.unheatedFloorAboveFrostRSI) < 1.96 && <WarningButton warningId="unheatedFloorAboveFrostRSI-low" title="RSI Value Too Low" variant="destructive">
                    <p className="text-xs text-destructive/80">
                        The RSI value must be increased to at least 1.96 to meet NBC requirements for unheated floor above frost line.
                    </p>
                </WarningButton>}
                <WarningButton warningId="unheatedFloorAboveFrostRSI-9362" title="Effective RSI/R-Value Required">
                    <p className="text-sm text-white">
                        You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                    </p>
                </WarningButton>
            </div>}

            <div className="space-y-2">
                <label className="text-sm font-medium">Window & Door U-Value</label>
                <Input type="text" placeholder="Input Range of U-values - Max U-Value 1.61 W/(m²·K) or Min Energy Rating ≥ 25" value={selections.windowUValue} onChange={e => setSelections(prev => ({
                    ...prev,
                    windowUValue: e.target.value
                }))} />
                {(() => {
                    // Check if input is a U-value and if it's too high
                    const inputValue = selections.windowUValue;
                    if (inputValue) {
                        const numValue = parseFloat(inputValue);
                        if (!isNaN(numValue) && numValue > 1.61) {
                            return <WarningButton warningId="windowUValue-9362-high" title="U-Value Too High" variant="destructive">
                                <p className="text-sm text-destructive/80">
                                    The U-value must be 1.61 W/(m²·K) or lower to meet NBC 9.36.2 requirements for windows and doors.
                                </p>
                            </WarningButton>;
                        }
                    }
                    return null;
                })()}
                <WarningButton warningId="windowDoor-verification-9362" title="Window & Door Performance Verification">
                    <p className="text-sm text-white">
                        Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please record the range of lowest-highest performing window and door U-Value (ie, highest U-value W/(m²×K).
                    </p>
                </WarningButton>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Does the house have skylights?</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="hasSkylights-9362" value="yes" checked={selections.hasSkylights === "yes"} onChange={e => setSelections(prev => ({
                            ...prev,
                            hasSkylights: e.target.value
                        }))} className="w-4 h-4 text-primary" />
                        <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="hasSkylights-9362" value="no" checked={selections.hasSkylights === "no"} onChange={e => setSelections(prev => ({
                            ...prev,
                            hasSkylights: e.target.value
                        }))} className="w-4 h-4 text-primary" />
                        <span className="text-sm">No</span>
                    </label>
                </div>
            </div>

            <WarningButton warningId="skylight-shaft-insulation-9362" title="Important: Skylight Shaft Insulation">
                <p className="text-xs text-white">
                    Skylight shafts must be insulated. Be prepared to provide further details upon request.
                </p>
            </WarningButton>

            {selections.hasSkylights === "yes" && <div className="space-y-2">
                <label className="text-sm font-medium">Skylight U-Value</label>
                <Input type="number" step="0.01" min="0" placeholder={`Enter U-value (maximum ${selections.province === "alberta" && selections.climateZone === "7B" ? "2.41" : "2.75"} W/(m²·K))`} value={selections.skylightUValue} onChange={e => setSelections(prev => ({
                    ...prev,
                    skylightUValue: e.target.value
                }))} />
                {(() => {
                    const maxUValue = selections.province === "alberta" && selections.climateZone === "7B" ? 2.41 : 2.75;
                    return selections.skylightUValue && parseFloat(selections.skylightUValue) > maxUValue && <WarningButton warningId="skylightUValue-high-9362" title="U-Value Too High" variant="destructive">
                        <p className="text-sm text-destructive/80">
                            The U-value must be reduced to {maxUValue} or lower to meet NBC requirements for skylights in your climate zone.
                        </p>
                    </WarningButton>;
                })()}
            </div>}

            {selections.hasSkylights === "yes" && <WarningButton warningId="skylight-shaft-insulation-9362-2" title="Important: Skylight Shaft Insulation">
                <p className="text-xs text-white">
                    Skylight shafts must be insulated. Be prepared to provide further details upon request.
                </p>
            </WarningButton>}

            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Airtightness Level (Unguarded Testing)</label>
                    <Dialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-100">
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>More Info</p>
                            </TooltipContent>
                        </Tooltip>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>What's a Blower Door Test?</DialogTitle>
                            </DialogHeader>
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
                        </DialogContent>
                    </Dialog>
                </div>
                <Input type="text" placeholder={`Min ${selections.province === "saskatchewan" ? "3.2" : "3.0"} ACH50 for ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`} value={selections.airtightness} onChange={e => setSelections(prev => ({
                    ...prev,
                    airtightness: e.target.value
                }))} />

                <WarningButton warningId="airtightness-caution-9362" title="Caution: Air-Tightness Targets Without Testing History">
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
                            <strong>Good news:</strong> We track airtightness results across all projects so we can help you set realistic targets, reduce build costs, and optimize performance from day one.
                        </p>
                        <div className="flex items-center gap-1 text-sm mt-3">
                            <span>🔗</span>
                            <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">
                                More information
                            </a>
                        </div>
                    </div>
                </WarningButton>

                {(() => {
                    const airtightnessValue = parseFloat(selections.airtightness || "0");

                    // Determine minimum threshold based on province
                    let minimumThreshold = 3.0; // Default for Alberta
                    let thresholdText = "3.0";
                    if (selections.province === "saskatchewan") {
                        minimumThreshold = 3.2;
                        thresholdText = "3.2";
                    }
                    const showWarning = airtightnessValue > 0 && airtightnessValue < minimumThreshold;
                    return showWarning ? <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                        <div className="flex items-start gap-2">
                            <span className="text-destructive text-lg">⚠️</span>
                            <div className="space-y-2">
                                <h4 className="font-medium text-destructive">Airtightness Value Too Low</h4>
                                <p className="text-sm text-destructive/80">
                                    The airtightness value must be at least {thresholdText} ACH50 for prescriptive unguarded testing in {selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}. Please increase your target value.
                                </p>
                            </div>
                        </div>
                    </div> : null;
                })()}

                {/* Mid-Construction Blower Door Test Checkbox */}
                <div className="space-y-3 pt-4 border-t border-border/20">
                    <div className="flex items-start gap-3">
                        <input type="checkbox" id="midConstructionBlowerDoor-9362" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                            ...prev,
                            midConstructionBlowerDoorPlanned: e.target.checked
                        }))} className="w-4 h-4 text-primary mt-1" />
                        <div className="flex-1">
                            <label htmlFor="midConstructionBlowerDoor-9362" className="text-sm font-medium cursor-pointer">
                                Mid-Construction Blower Door Test Planned
                            </label>
                        </div>
                    </div>

                    <WarningButton warningId="mid-construction-blower-door-info-9362" title="Benefits of Mid-Construction Blower Door Testing">
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
                                <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">
                                    View the Blower Door Checklist
                                </a>
                            </div>
                        </div>
                    </WarningButton>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Heating Type</label>
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
                    </SelectContent>
                </Select>
            </div>

            <div className="p-4 bg-gradient-to-r from-slate-800/60 to-teal-800/60 border-2 border-orange-400 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-white font-medium">
                    ⚠️ Mechanical Equipment Documentation
                </p>
                <p className="text-sm text-white mt-1">
                    The Authority Having Jurisdiction (AHJ) may request specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations. More info at: <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">https://solinvictusenergyservices.com/cancsa-f28012</a>
                </p>
            </div>

            {selections.heatingType && <div className="space-y-2">
                <label className="text-sm font-medium">Heating Efficiency</label>
                <Input type="text" placeholder={selections.heatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.heatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingEfficiency: e.target.value
                }))} />
                {selections.heatingEfficiency && selections.heatingType !== 'heat-pump' && (() => {
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
                    if (!isNaN(inputValue) && inputValue < minValue) {
                        return <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-sm text-destructive font-medium">
                                ⚠️ Heating Efficiency Too Low
                            </p>
                            <p className="text-sm text-destructive/80 mt-1">
                                {systemType} - Your input of {inputValue} is below the minimum requirement.
                            </p>
                        </div>;
                    }
                    return null;
                })()}
            </div>}

            {selections.heatingType === 'boiler' && <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Are you installing an indirect tank?</label>
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
                    <label className="text-sm font-medium">Indirect tank size (gallons)</label>
                    <Input type="number" placeholder="Enter tank size in gallons" value={selections.indirectTankSize} onChange={e => setSelections(prev => ({
                        ...prev,
                        indirectTankSize: e.target.value
                    }))} />
                </div>}
            </div>}

            <div className="space-y-2">
                <label className="text-sm font-medium">Are you installing cooling/air conditioning?</label>
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

            {/* Secondary Suite Heating - Show for single-detached with secondary suite AND multi-unit buildings for performance path */}
            {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit" && ["9365", "9367"].includes(selections.compliancePath)) && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                <h5 className="font-medium text-white">Secondary Suite Heating System</h5>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Will there be a separate heating system for the secondary suite?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasSecondaryHeating" value="yes" checked={selections.hasSecondaryHeating === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHeating: e.target.value,
                                secondaryHeatingType: "",
                                // Reset when changing
                                secondaryHeatingEfficiency: "",
                                secondaryIndirectTank: "",
                                secondaryIndirectTankSize: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasSecondaryHeating" value="no" checked={selections.hasSecondaryHeating === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHeating: e.target.value,
                                secondaryHeatingType: "",
                                secondaryHeatingEfficiency: "",
                                secondaryIndirectTank: "",
                                secondaryIndirectTankSize: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasSecondaryHeating === "yes" && <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Secondary Suite Heating Type</label>
                        <Select value={selections.secondaryHeatingType} onValueChange={value => setSelections(prev => ({
                            ...prev,
                            secondaryHeatingType: value,
                            secondaryHeatingEfficiency: "",
                            // Reset efficiency when type changes
                            secondaryIndirectTank: "",
                            secondaryIndirectTankSize: ""
                        }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select heating type" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="furnace">Furnace</SelectItem>
                                <SelectItem value="boiler">Boiler</SelectItem>
                                <SelectItem value="heat-pump">Heat Pump</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selections.secondaryHeatingType && <div className="space-y-2">
                        <label className="text-sm font-medium">Secondary Suite Heating Efficiency</label>
                        <Input type="text" placeholder={selections.secondaryHeatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.secondaryHeatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.secondaryHeatingEfficiency} onChange={e => setSelections(prev => ({
                            ...prev,
                            secondaryHeatingEfficiency: e.target.value
                        }))} />
                        {selections.secondaryHeatingEfficiency && selections.secondaryHeatingType !== 'heat-pump' && (() => {
                            const inputValue = parseFloat(selections.secondaryHeatingEfficiency);
                            let minValue = 0;
                            let systemType = "";
                            if (selections.secondaryHeatingType === 'boiler') {
                                minValue = 90;
                                systemType = "Boiler (90 AFUE minimum)";
                            } else {
                                minValue = 95; // Furnace
                                systemType = "Furnace (95% AFUE minimum)";
                            }
                            if (!isNaN(inputValue) && inputValue < minValue) {
                                return <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <p className="text-sm text-destructive font-medium">
                                        ⚠️ Secondary Heating Efficiency Too Low
                                    </p>
                                    <p className="text-sm text-destructive/80 mt-1">
                                        {systemType} - Your input of {inputValue} is below the minimum requirement.
                                    </p>
                                </div>;
                            }
                            return null;
                        })()}
                    </div>}

                    {selections.secondaryHeatingType === 'boiler' && <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Are you installing an indirect tank for the secondary suite?</label>
                            <Select value={selections.secondaryIndirectTank} onValueChange={value => setSelections(prev => ({
                                ...prev,
                                secondaryIndirectTank: value
                            }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selections.secondaryIndirectTank === 'yes' && <div className="space-y-2">
                            <label className="text-sm font-medium">Secondary Suite Indirect Tank Size (Gallons)</label>
                            <Input type="text" placeholder="Enter tank size in gallons (e.g., 40, 50, 60, 80)" value={selections.secondaryIndirectTankSize} onChange={e => setSelections(prev => ({
                                ...prev,
                                secondaryIndirectTankSize: e.target.value
                            }))} />
                        </div>}
                    </div>}
                </>}
            </div>}

            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Service Water Heater Type</label>
                    <Select value={selections.waterHeaterType} onValueChange={value => {
                        setSelections(prev => ({
                            ...prev,
                            waterHeaterType: value,
                            waterHeater: "" // Reset efficiency when type changes
                        }));
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select water heater type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="gas-storage">Gas Storage Tank</SelectItem>
                            <SelectItem value="gas-tankless">Gas Tankless</SelectItem>
                            <SelectItem value="electric-storage">Electric Storage Tank</SelectItem>
                            <SelectItem value="electric-tankless">Electric Tankless</SelectItem>
                            <SelectItem value="electric-heat-pump">Electric Heat Pump</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selections.waterHeaterType === "other" && <div className="space-y-2">
                    <label className="text-sm font-medium">Specify Other Water Heater Type</label>
                    <Input type="text" placeholder="Please specify the water heater type" value={selections.otherWaterHeaterType || ""} onChange={e => setSelections(prev => ({
                        ...prev,
                        otherWaterHeaterType: e.target.value
                    }))} />
                </div>}

                {selections.waterHeaterType && <div className="space-y-2">
                    <label className="text-sm font-medium">Service Water Heater Efficiency</label>
                    <Input type="text" placeholder={(() => {
                        switch (selections.waterHeaterType) {
                            case "gas-storage":
                                return "Min UEF 0.60-0.81 for Gas Storage Tank";
                            case "gas-tankless":
                                return "Min UEF 0.86 for Gas Tankless";
                            case "electric-storage":
                                return "Min UEF 0.35-0.69 for Electric Storage Tank";
                            case "electric-tankless":
                                return "Min UEF 0.86 for Electric Tankless";
                            case "electric-heat-pump":
                                return "Min UEF 2.1 for Electric Heat Pump";
                            case "other":
                                return "Enter efficiency value";
                            default:
                                return "Enter water heater efficiency";
                        }
                    })()} value={selections.waterHeater} onChange={e => setSelections(prev => ({
                        ...prev,
                        waterHeater: e.target.value
                    }))} />
                </div>}
            </>}

            {/* Secondary Suite Water Heater - Show for single-detached with secondary suite AND multi-unit buildings for performance path */}
            {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit" && ["9365", "9367"].includes(selections.compliancePath)) && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                <h5 className="font-medium text-white">Secondary Suite Water Heating</h5>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Will there be a second hot water system for the secondary suite?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasSecondaryWaterHeater" value="yes" checked={selections.hasSecondaryWaterHeater === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryWaterHeater: e.target.value,
                                secondaryWaterHeaterSameAsMain: "",
                                // Reset when changing
                                secondaryWaterHeater: "",
                                secondaryWaterHeaterType: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasSecondaryWaterHeater" value="no" checked={selections.hasSecondaryWaterHeater === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryWaterHeater: e.target.value,
                                secondaryWaterHeaterSameAsMain: "",
                                secondaryWaterHeater: "",
                                secondaryWaterHeaterType: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasSecondaryWaterHeater === "yes" && <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Will it be the same as the main water heater system?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="secondaryWaterHeaterSameAsMain" value="yes" checked={selections.secondaryWaterHeaterSameAsMain === "yes"} onChange={e => setSelections(prev => ({
                                    ...prev,
                                    secondaryWaterHeaterSameAsMain: e.target.value,
                                    secondaryWaterHeater: "",
                                    secondaryWaterHeaterType: ""
                                }))} className="w-4 h-4 text-primary" />
                                <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="secondaryWaterHeaterSameAsMain" value="no" checked={selections.secondaryWaterHeaterSameAsMain === "no"} onChange={e => setSelections(prev => ({
                                    ...prev,
                                    secondaryWaterHeaterSameAsMain: e.target.value
                                }))} className="w-4 h-4 text-primary" />
                                <span className="text-sm">No</span>
                            </label>
                        </div>
                    </div>

                    {selections.secondaryWaterHeaterSameAsMain === "no" && <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Secondary Suite Water Heater Type</label>
                            <Select value={selections.secondaryWaterHeaterType} onValueChange={value => {
                                setSelections(prev => ({
                                    ...prev,
                                    secondaryWaterHeaterType: value,
                                    secondaryWaterHeater: "" // Reset efficiency when type changes
                                }));
                            }}>
                                <SelectTrigger>
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

                        {selections.secondaryWaterHeaterType && <div className="space-y-2">
                            <label className="text-sm font-medium">Secondary Suite Water Heater Efficiency</label>
                            <Input type="text" placeholder={(() => {
                                switch (selections.secondaryWaterHeaterType) {
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
                            })()} value={selections.secondaryWaterHeater} onChange={e => setSelections(prev => ({
                                ...prev,
                                secondaryWaterHeater: e.target.value
                            }))} />
                        </div>}
                    </>}
                </>}
            </div>}

            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Is a drain water heat recovery system being installed?</label>
                    <Dialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-100">
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>More Info</p>
                            </TooltipContent>
                        </Tooltip>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Drain Water Heat Recovery System Information</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="border-b pb-2">
                                    <h4 className="font-medium text-sm">ℹ️ Drain Water Heat Recovery (DWHR)</h4>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        DWHR systems capture heat from shower drain water and use it to preheat incoming cold water, reducing hot water energy use by 20–40%.
                                    </p>

                                    <div className="space-y-2">
                                        <h5 className="font-medium text-sm">How it works:</h5>
                                        <p className="text-sm text-muted-foreground">When hot water goes down the drain (like from a shower), the DWHR unit uses a heat exchanger to transfer that thermal energy to the incoming cold water supply before it reaches your water heater.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="font-medium text-sm">Benefits:</h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>• Reduces water heating energy consumption</p>
                                            <p>• Lowers utility bills</p>
                                            <p>• Contributes to overall building energy efficiency</p>
                                            <p>• Works continuously with no maintenance required</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
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