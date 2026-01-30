import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import InfoButton from "@/components/InfoButton";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateRSI_9362 } from "../../../utils/validation";
import { EffectiveRSIWarning } from "@/components/NBCCalculator/components/EffectiveRSIWarning";
import { WarningButton } from "./WarningButton";

export function EnvelopeSection({
    selections,
    setSelections,
    validationErrors,
    showMissingFields,
    isMissing,
    missingFieldClass,
    maxUValue,
}: {
    selections: any;
    setSelections: any;
    validationErrors: Record<string, boolean>;
    showMissingFields: boolean;
    isMissing: (key: string) => boolean;
    missingFieldClass: string;
    maxUValue: number;
}) {
    const isHeatedFloorsChecked = selections.floorsSlabsSelected.includes("heatedFloors");
    const isUnheatedFloorChecked =
        selections.floorsSlabsSelected.includes("unheatedBelowFrost") ||
        selections.floorsSlabsSelected.includes("unheatedAboveFrost");
    const isSlabOnGradeChecked = selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting");

    return (
        <div className="space-y-4">
            {/* HRV/ERV Section for 9362 */}
            <div id="hasHrv" className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Does this building include an HRV or ERV? <span className="text-red-500">*</span></label>
                    <InfoButton title="Should I include an HRV (Heat Recovery Ventilator)?">
                        <div className="space-y-4">
                            <div>
                                <p className="text-base text-muted-foreground">
                                    An HRV is a system that brings in fresh outdoor air while recovering heat from the stale indoor air it exhausts. It improves indoor air quality and energy efficiency — especially in airtight homes.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-medium text-base mb-1">Why you should consider an HRV:</h5>
                                <ul className="text-base text-muted-foreground space-y-1 ml-4 list-disc">
                                    <li><strong>Better indoor air quality:</strong> Removes stale air, moisture, odors, and pollutants while bringing in fresh air.</li>
                                    <li><strong>Energy savings:</strong> Recovery up to 80-90% of the heat from outgoing air, reducing heating costs.</li>
                                    <li><strong>Comfort:</strong> Maintains consistent temperatures and humidity levels throughout your home.</li>
                                    <li><strong>Code compliance:</strong> In many cases, an HRV can help you meet building envelope requirements with less insulation.</li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-medium text-base mb-1">When is an HRV required?</h5>
                                <p className="text-base text-muted-foreground">
                                    While not always mandatory, HRVs are required or strongly recommended for homes with very low air leakage rates (typically below 2.5 ACH50) to ensure adequate ventilation. They're also required for certain energy efficiency programs.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-medium text-base mb-1">HRV vs. ERV:</h5>
                                <div className="text-base text-muted-foreground space-y-1">
                                    <p><strong>HRV (Heat Recovery Ventilator):</strong> Recovers heat only. Best for cold, dry climates like most of Canada.</p>
                                    <p><strong>ERV (Energy Recovery Ventilator):</strong> Recovers both heat and moisture. Better for humid climates or homes with high humidity issues.</p>
                                </div>
                            </div>
                        </div>
                    </InfoButton>
                </div>
                <Select required value={selections.hasHrv} onValueChange={value => {
                    setSelections((prev: any) => {
                        const newSelections = { ...prev, hasHrv: value };
                        if (value === 'without_hrv') {
                            newSelections.hrvEfficiency = "";
                            newSelections.hasSecondaryHrv = "";
                            newSelections.secondaryHrvEfficiency = "";
                        }
                        return newSelections;
                    });
                }}>
                    <SelectTrigger className={cn(
                        (validationErrors.hasHrv || isMissing("hasHrv")) && missingFieldClass,
                        validationErrors.hasHrv && "border-red-500 ring-2 ring-red-500"
                    )}>
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="with_hrv">Yes - with HRV/ERV</SelectItem>
                        <SelectItem value="without_hrv">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.hasHrv === "with_hrv" && <div id="hrvEfficiency" className="space-y-2">
                <label className="text-sm font-medium text-foreground">HRV/ERV Efficiency <span className="text-red-500">*</span></label>
                <Input required type="text"
                    placeholder="Input HRV/ERV efficiency (e.g. SRE 65%)"
                    value={selections.hrvEfficiency || ""}
                    onChange={e => setSelections(prev => ({
                        ...prev,
                        hrvEfficiency: e.target.value
                    }))}
                    className={cn(
                        (validationErrors.hrvEfficiency || isMissing("hrvEfficiency")) && missingFieldClass,
                        validationErrors.hrvEfficiency && "border-red-500 ring-2 ring-red-500"
                    )}
                />
            </div>}

            {/* Secondary Suite HRV - Show for buildings with multiple units */}
            {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && selections.hasHrv === "with_hrv" && <div className="space-y-4 p-4 bg-muted/50 border rounded-md">
                <h5 className="font-medium text-foreground">Secondary Suite HRV/ERV</h5>

                <div id="hasSecondaryHrv" className={cn("space-y-2", (validationErrors.hasSecondaryHrv || isMissing("hasSecondaryHrv")) && "p-2 border-2 border-red-500 rounded-md bg-red-50")}>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground">Will there be a second HRV/ERV for the secondary suite? <span className="text-red-500">*</span></label>
                        <InfoButton title="Secondary Suite HRV/ERV Information">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-base mb-2">Independent HRV/ERV for Secondary Suite</h4>
                                    <p className="text-base text-muted-foreground">
                                        A secondary suite may require its own HRV/ERV system to ensure adequate ventilation and maintain indoor air quality independently from the main dwelling unit.
                                    </p>
                                </div>

                                <div>
                                    <h5 className="font-medium text-base mb-1">When a second HRV/ERV is needed:</h5>
                                    <ul className="text-base text-muted-foreground space-y-1 ml-4 list-disc">
                                        <li><strong>Separate ventilation zones:</strong> When the secondary suite requires independent air quality control.</li>
                                        <li><strong>Building code requirements:</strong> Some jurisdictions require separate ventilation systems for secondary suites.</li>
                                        <li><strong>Different occupancy patterns:</strong> When main and secondary units have different ventilation needs.</li>
                                        <li><strong>Privacy and control:</strong> Allowing tenants to control their own indoor air quality.</li>
                                    </ul>
                                </div>
                            </div>
                        </InfoButton>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input required type="radio" name="hasSecondaryHrv" value="yes" checked={selections.hasSecondaryHrv === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHrv: e.target.value,
                                secondaryHrvEfficiency: "" // Reset when changing
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input required type="radio" name="hasSecondaryHrv" value="no" checked={selections.hasSecondaryHrv === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHrv: e.target.value,
                                secondaryHrvEfficiency: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasSecondaryHrv === "yes" && <div id="secondaryHrvEfficiency" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Secondary Suite HRV/ERV Efficiency <span className="text-red-500">*</span></label>
                    <Input required type="text"
                        placeholder="Input secondary HRV/ERV efficiency (e.g. SRE 65%)"
                        value={selections.secondaryHrvEfficiency || ""}
                        onChange={e => setSelections(prev => ({
                            ...prev,
                            secondaryHrvEfficiency: e.target.value
                        }))}
                        className={cn(
                            (validationErrors.secondaryHrvEfficiency || isMissing("secondaryHrvEfficiency")) && missingFieldClass,
                            validationErrors.secondaryHrvEfficiency && "border-red-500 ring-2 ring-red-500"
                        )}
                    />
                </div>}
            </div>}

            <div id="ceilingsAtticRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ceilings below Attics <span className="text-red-500">*</span></label>
                <Input
                    required
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder={
                        selections.hasHrv === "with_hrv"
                            ? "Min RSI 8.67 w/ HRV"
                            : selections.hasHrv === "without_hrv"
                                ? "Min RSI 10.43 w/o HRV"
                                : "Min RSI 8.67 w/ HRV, 10.43 w/o HRV"
                    }
                    value={selections.ceilingsAtticRSI}
                    onKeyDown={(e) => {
                        // Prevent letters/symbols some browsers allow in number inputs
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => {
                        // Keep ONLY digits + a single dot
                        let v = e.target.value;

                        // Remove anything that's not digit or dot
                        v = v.replace(/[^\d.]/g, "");

                        // Allow only one dot
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setSelections((prev) => ({
                            ...prev,
                            ceilingsAtticRSI: v,
                        }));
                    }}
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
                            return <WarningButton title="🛑 RSI Value Too Low" variant="destructive" defaultOpen={true}>
                                <p className="text-xs">
                                    {`The RSI value must be increased to at least ${minRSI} to meet NBC 9.36.8 requirements.`}
                                </p>
                            </WarningButton>;
                        }
                        return null;
                    }
                    const minRSI = selections.hasHrv === "with_hrv" ? 8.67 : selections.hasHrv === "without_hrv" ? 10.43 : 8.67;
                    const validation = validateRSI_9362(selections.ceilingsAtticRSI, minRSI, `ceilings below attics ${selections.hasHrv === "with_hrv" ? "with HRV" : "without HRV"}`);
                    if (!validation.isValid && validation.warning) {
                        return <WarningButton title={validation.warning.type === "rvalue-suspected" ? "R-Value Detected" : "RSI Value Too Low"} variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}>
                            <p className="text-sm">
                                {validation.warning.message}
                            </p>
                        </WarningButton>;
                    }
                    return null;
                })()}
                <EffectiveRSIWarning />
            </div>

            <div id="hasCathedralOrFlatRoof" className="space-y-2">
                <label className={cn("text-sm font-medium text-foreground", (validationErrors.hasCathedralOrFlatRoof || isMissing("hasCathedralOrFlatRoof")) && "text-red-500")}>Are there any cathedral ceilings or flat roof? <span className="text-red-500">*</span></label>
                <Select required value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasCathedralOrFlatRoof: value,
                    cathedralFlatRSIValue: ""
                }))}>
                    <SelectTrigger className={cn(
                        (validationErrors.hasCathedralOrFlatRoof || isMissing("hasCathedralOrFlatRoof")) && missingFieldClass,
                        validationErrors.hasCathedralOrFlatRoof && "border-red-500 ring-2 ring-red-500"
                    )}>
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.hasCathedralOrFlatRoof === "yes" && <div id="cathedralFlatRSIValue" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cathedral / Flat Roofs - Min. 5.02 RSI <span className="text-red-500">*</span></label>
                <Input
                    required
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter RSI value (min. 5.02)"
                    value={selections.cathedralFlatRSIValue || ""}
                    onKeyDown={(e) => {
                        // allow navigation/edit keys
                        const allowedKeys = [
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                            "Home",
                            "End",
                        ];
                        if (allowedKeys.includes(e.key)) return;

                        // allow digits + dot
                        if (/[0-9.]/.test(e.key)) return;

                        // block everything else
                        e.preventDefault();
                    }}
                    onChange={(e) => {
                        const raw = e.target.value; // no trim here (prevents cursor lag)

                        // numeric-only decimal
                        let v = raw.replace(/[^\d.]/g, "");
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setSelections((prev) => ({
                            ...prev,
                            cathedralFlatRSIValue: v,
                        }));
                    }}
                    onBlur={() => {
                        const v = (selections.cathedralFlatRSIValue || "").trim();

                        // clean trailing dot (e.g. "5.")
                        if (/^\d+\.$/.test(v)) {
                            setSelections((prev) => ({
                                ...prev,
                                cathedralFlatRSIValue: v.slice(0, -1),
                            }));
                        }
                    }}
                    className={cn(
                        (validationErrors.cathedralFlatRSIValue ||
                            isMissing("cathedralFlatRSIValue")) &&
                        missingFieldClass,
                        validationErrors.cathedralFlatRSIValue && "border-red-500 ring-2 ring-red-500"
                    )}
                />

                {(() => {
                    const minRSI = 5.02;
                    const validation = validateRSI_9362(
                        selections.cathedralFlatRSIValue,
                        minRSI,
                        `cathedral/flat roofs`
                    );

                    const showWarning = !validation.isValid && !!validation.warning;

                    return showWarning ? (
                        <WarningButton
                            title="🛑 RSI Value Too Low"
                            variant="destructive"
                            defaultOpen={true}
                        >
                            <p className="text-xs">
                                The RSI value must be increased to at least 5.02 to meet NBC 9.36.2
                                requirements for cathedral/flat roofs.
                            </p>
                        </WarningButton>
                    ) : null;
                })()}
                <EffectiveRSIWarning />
            </div>}

            <div id="wallRSI" className="space-y-2">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">Above Grade Walls - RSI Value <span className="text-red-400">*</span></label>
                    <InfoButton title="Above Grade Walls - RSI Value">
                        <div className="space-y-4">
                            <p className="text-sm">
                                Enter the RSI value for your lowest-performing wall assembly, including tall walls.
                            </p>
                        </div>
                    </InfoButton>
                </div>
                <Input
                    required
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder={
                        selections.hasHrv === "with_hrv"
                            ? "Min RSI 2.97 w/ HRV"
                            : selections.hasHrv === "without_hrv"
                                ? "Min RSI 3.69 w/o HRV"
                                : "Min RSI 2.97 w/ HRV, 3.69 w/o HRV"
                    }
                    value={selections.wallRSI}
                    onKeyDown={(e) => {
                        // Prevent letters/symbols some browsers allow in number inputs
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => {
                        let v = e.target.value;

                        // Remove anything that's not digit or dot
                        v = v.replace(/[^\d.]/g, "");

                        // Allow only one dot
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setSelections((prev) => ({
                            ...prev,
                            wallRSI: v,
                        }));
                    }}
                    className={cn(
                        (validationErrors.wallRSI || isMissing("wallRSI")) && missingFieldClass,
                        validationErrors.wallRSI && "border-red-500 ring-2 ring-red-500"
                    )}
                />

                {(() => {
                    const minRSI = selections.hasHrv === "with_hrv" ? 2.97 : 3.69;
                    const validation = validateRSI_9362(selections.wallRSI, minRSI, `above grade walls`);

                    const showWarning = !validation.isValid && !!validation.warning;

                    return showWarning ? (
                        <WarningButton
                            title="🛑 RSI Value Too Low"
                            variant="destructive"
                            defaultOpen={true}
                        >
                            <p className="text-xs">
                                {`The RSI value must be increased to at least ${selections.hasHrv === "with_hrv" ? "2.97 with HRV" : "3.69 without HRV"
                                    } to meet NBC 9.36.2 requirements for above grade walls.`}
                            </p>
                        </WarningButton>
                    ) : null;
                })()}

                <EffectiveRSIWarning />
            </div>

            <div id="belowGradeRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Below Grade Walls (Foundation Walls) <span className="text-red-500">*</span></label>
                <Input
                    required
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder={
                        selections.hasHrv === "with_hrv"
                            ? "Min RSI 2.98 (with HRV)"
                            : selections.hasHrv === "without_hrv"
                                ? "Min RSI 3.46 (without HRV)"
                                : "Select HRV option first"
                    }
                    value={selections.belowGradeRSI}
                    onKeyDown={(e) => {
                        // Prevent letters/symbols some browsers allow in number inputs
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => {
                        let v = e.target.value;

                        // Remove anything that's not digit or dot
                        v = v.replace(/[^\d.]/g, "");

                        // Allow only one dot
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setSelections((prev) => ({
                            ...prev,
                            belowGradeRSI: v,
                        }));
                    }}
                    className={cn(
                        (validationErrors.belowGradeRSI || isMissing("belowGradeRSI")) && missingFieldClass,
                        validationErrors.belowGradeRSI && "border-red-500 ring-2 ring-red-500"
                    )}
                />

                {(() => {
                    const minRSI = selections.hasHrv === "with_hrv" ? 2.98 : 3.46;
                    const validation = validateRSI_9362(selections.belowGradeRSI, minRSI, `below grade walls`);

                    const showWarning = !validation.isValid && !!validation.warning;

                    return showWarning ? (
                        <WarningButton
                            title="🛑 RSI Value Too Low"
                            variant="destructive"
                            defaultOpen={true}
                        >
                            <p className="text-xs">
                                {`The RSI value must be increased to at least ${selections.hasHrv === "with_hrv" ? "2.98 with HRV" : "3.46 without HRV"
                                    } to meet NBC 9.36.2 requirements for below grade walls.`}
                            </p>
                        </WarningButton>
                    ) : null;
                })()}

                <EffectiveRSIWarning />
            </div>

            <div id="floorsSlabsSelected" className={cn(
                "space-y-4",
                (validationErrors.floorsSlabsSelected || isMissing("floorsSlabsSelected")) && "p-2 border-2 border-red-500 rounded-md bg-red-50"
            )}>
                <label className="text-sm font-medium text-foreground">Floors/Slabs (Select all that apply) <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                    <label className={cn("flex items-center gap-2", isHeatedFloorsChecked && "opacity-50 cursor-not-allowed")}>
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedBelowFrost")} disabled={isHeatedFloorsChecked} onChange={e => {
                            const isChecked = e.target.checked;
                            setSelections((prev: any) => {
                                let newFloorsSlabsSelected = [...prev.floorsSlabsSelected];
                                if (isChecked) {
                                    if (!newFloorsSlabsSelected.includes('unheatedBelowFrost')) {
                                        newFloorsSlabsSelected.push('unheatedBelowFrost');
                                    }
                                    newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'heatedFloors');
                                } else {
                                    newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'unheatedBelowFrost');
                                }
                                return {
                                    ...prev,
                                    floorsSlabsSelected: newFloorsSlabsSelected,
                                    hasInFloorHeat: newFloorsSlabsSelected.includes('heatedFloors') ? "yes" : "no"
                                };
                            });
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">Unheated Floor Below Frostline</span>
                    </label>
                    <label className={cn("flex items-center gap-2", isHeatedFloorsChecked && "opacity-50 cursor-not-allowed")}>
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedAboveFrost")} disabled={isHeatedFloorsChecked} onChange={e => {
                            const isChecked = e.target.checked;
                            setSelections((prev: any) => {
                                let newFloorsSlabsSelected = [...prev.floorsSlabsSelected];
                                if (isChecked) {
                                    if (!newFloorsSlabsSelected.includes('unheatedAboveFrost')) {
                                        newFloorsSlabsSelected.push('unheatedAboveFrost');
                                    }
                                    newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'heatedFloors');
                                } else {
                                    newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'unheatedAboveFrost');
                                }
                                return {
                                    ...prev,
                                    floorsSlabsSelected: newFloorsSlabsSelected,
                                    hasInFloorHeat: newFloorsSlabsSelected.includes('heatedFloors') ? "yes" : "no"
                                };
                            });
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">Unheated Floor Above Frost Line (or walk-out basement)</span>
                    </label>
                    <label className={cn("flex items-center gap-2", (isUnheatedFloorChecked || isSlabOnGradeChecked) && "opacity-50 cursor-not-allowed")}>
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("heatedFloors")} disabled={isUnheatedFloorChecked || isSlabOnGradeChecked} onChange={e => {
                            const isChecked = e.target.checked;
                            setSelections((prev: any) => {
                                let newFloorsSlabsSelected = [...prev.floorsSlabsSelected];
                                if (isChecked) {
                                    if (!newFloorsSlabsSelected.includes('heatedFloors')) {
                                        newFloorsSlabsSelected.push('heatedFloors');
                                    }
                                    newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item =>
                                        item !== 'unheatedBelowFrost' &&
                                        item !== 'unheatedAboveFrost' &&
                                        item !== 'slabOnGradeIntegralFooting'
                                    );
                                } else {
                                    newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'heatedFloors');
                                }
                                return {
                                    ...prev,
                                    floorsSlabsSelected: newFloorsSlabsSelected,
                                    hasInFloorHeat: isChecked ? "yes" : "no"
                                };
                            });
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">Heated Floors</span>
                    </label>
                    <label className={cn("flex items-center gap-2", isHeatedFloorsChecked && "opacity-50 cursor-not-allowed")}>
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")} disabled={isHeatedFloorsChecked} onChange={e => {
                            const value = "slabOnGradeIntegralFooting";
                            const isChecked = e.target.checked;
                            setSelections((prev: any) => {
                                let newFloorsSlabsSelected = [...prev.floorsSlabsSelected];
                                if (isChecked) {
                                    if (!newFloorsSlabsSelected.includes(value)) {
                                        newFloorsSlabsSelected.push(value);
                                    }
                                    // Uncheck heated floors
                                    newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'heatedFloors');
                                } else {
                                    newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== value);
                                }
                                return {
                                    ...prev,
                                    floorsSlabsSelected: newFloorsSlabsSelected,
                                    hasInFloorHeat: newFloorsSlabsSelected.includes('heatedFloors') ? "yes" : "no"
                                };
                            });
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">Slab on grade with integral Footing</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsOverUnheatedSpaces")} onChange={e => {
                            const value = "floorsOverUnheatedSpaces";
                            setSelections((prev: any) => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter((item: string) => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</span>
                    </label>
                </div>
            </div>

            {selections.floorsSlabsSelected.includes("heatedFloors") && <div id="inFloorHeatRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Heated Floors <span className="text-red-500">*</span></label>
                <Input required type="text"
                    placeholder={`Min RSI ${selections.province === "saskatchewan" ? "2.84 (R-16.1)" : "1.34"} for ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`}
                    value={selections.inFloorHeatRSI}
                    onChange={e => setSelections(prev => ({
                        ...prev,
                        inFloorHeatRSI: e.target.value
                    }))}
                    className={cn(
                        (validationErrors.inFloorHeatRSI || isMissing("inFloorHeatRSI")) && missingFieldClass,
                        validationErrors.inFloorHeatRSI && "border-red-500 ring-2 ring-red-500"
                    )}
                />
                {(() => {
                    const minRSI = selections.province === "saskatchewan" ? 2.84 : 1.34;
                    const validation = validateRSI_9362(selections.inFloorHeatRSI, minRSI, `heated floors`);
                    if (!validation.isValid && validation.warning) {
                        return <WarningButton title="🛑 RSI Value Too Low" variant="destructive" defaultOpen={true}>
                            <p className="text-xs">
                                The RSI value must be increased to at least {minRSI} to meet NBC 9.36.2 requirements for heated floors in {selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}.
                            </p>
                        </WarningButton>;
                    }
                    return null;
                })()}
                <EffectiveRSIWarning />
            </div>}

            {selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting") && <div id="slabOnGradeIntegralFootingRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Slab on grade with integral Footing <span className="text-red-500">*</span></label>
                <Input
                    required
                    type="text"
                    inputMode="decimal"
                    placeholder="Min RSI 2.84 or N/A"
                    value={selections.slabOnGradeIntegralFootingRSI}
                    onKeyDown={(e) => {
                        // allow navigation/edit keys
                        const allowedKeys = [
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                            "Home",
                            "End",
                        ];
                        if (allowedKeys.includes(e.key)) return;

                        // allow digits + dot
                        if (/[0-9.]/.test(e.key)) return;

                        // allow typing toward N/A only
                        if (/[a-z]/i.test(e.key) && !["n", "a"].includes(e.key.toLowerCase())) {
                            e.preventDefault();
                            return;
                        }
                        if (!["/", "n", "N", "a", "A"].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        const raw = e.target.value; // no trim here → avoids cursor lag

                        // If user is typing N / N/ / NA / N/A, keep it
                        if (/^n/i.test(raw)) {
                            const kept = raw.replace(/[^nNaA/]/g, "");
                            const firstSlash = kept.indexOf("/");
                            const finalNA =
                                firstSlash === -1
                                    ? kept
                                    : kept.slice(0, firstSlash + 1) +
                                    kept.slice(firstSlash + 1).replace(/\//g, "");

                            setSelections((prev) => ({
                                ...prev,
                                slabOnGradeIntegralFootingRSI: finalNA,
                            }));
                            return;
                        }

                        // Otherwise numeric-only decimal
                        let v = raw.replace(/[^\d.]/g, "");
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setSelections((prev) => ({
                            ...prev,
                            slabOnGradeIntegralFootingRSI: v,
                        }));
                    }}
                    onBlur={() => {
                        const v = (selections.slabOnGradeIntegralFootingRSI || "").trim();

                        // Normalize N/A on blur
                        if (/^n\/?a$/i.test(v)) {
                            setSelections((prev) => ({
                                ...prev,
                                slabOnGradeIntegralFootingRSI: "N/A",
                            }));
                            return;
                        }

                        // Clean trailing dot (e.g. "2.")
                        if (/^\d+\.$/.test(v)) {
                            setSelections((prev) => ({
                                ...prev,
                                slabOnGradeIntegralFootingRSI: v.slice(0, -1),
                            }));
                        }
                    }}
                    className={cn(
                        (validationErrors.slabOnGradeIntegralFootingRSI ||
                            isMissing("slabOnGradeIntegralFootingRSI")) &&
                        missingFieldClass,
                        validationErrors.slabOnGradeIntegralFootingRSI &&
                        "border-red-500 ring-2 ring-red-500"
                    )}
                />

                <EffectiveRSIWarning />

                {selections.slabOnGradeIntegralFootingRSI && !isNaN(parseFloat(selections.slabOnGradeIntegralFootingRSI)) && parseFloat(selections.slabOnGradeIntegralFootingRSI) < 2.84 && <WarningButton title="🛑 RSI Value Too Low" variant="destructive" defaultOpen={true}>
                    <p className="text-xs">
                        The RSI value must be at least 2.84 to meet NBC 9.36.2 minimum requirements for slab on grade with integral footing.
                    </p>
                </WarningButton>}
            </div>}

            {selections.floorsSlabsSelected.includes("floorsOverUnheatedSpaces") && <div id="floorsOverUnheatedSpacesRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Floors over Unheated Spaces (Cantilevers or Exposed Floors) <span className="text-red-500">*</span></label>
                <Input
                    required
                    type="text"
                    inputMode="decimal"
                    placeholder="Min RSI 5.02"
                    value={selections.floorsOverUnheatedSpacesRSI}
                    onKeyDown={(e) => {
                        // allow navigation/edit keys
                        const allowedKeys = [
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                            "Home",
                            "End",
                        ];
                        if (allowedKeys.includes(e.key)) return;

                        // allow digits + dot
                        if (/[0-9.]/.test(e.key)) return;

                        // block all letters/symbols
                        e.preventDefault();
                    }}
                    onChange={(e) => {
                        const raw = e.target.value; // no trim here (prevents cursor lag)

                        // numeric-only decimal
                        let v = raw.replace(/[^\d.]/g, "");
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setSelections((prev) => ({
                            ...prev,
                            floorsOverUnheatedSpacesRSI: v,
                        }));
                    }}
                    onBlur={() => {
                        const v = (selections.floorsOverUnheatedSpacesRSI || "").trim();

                        // clean trailing dot (e.g. "5.")
                        if (/^\d+\.$/.test(v)) {
                            setSelections((prev) => ({
                                ...prev,
                                floorsOverUnheatedSpacesRSI: v.slice(0, -1),
                            }));
                        }
                    }}
                    className={cn(
                        (validationErrors.floorsOverUnheatedSpacesRSI ||
                            isMissing("floorsOverUnheatedSpacesRSI")) &&
                        missingFieldClass,
                        validationErrors.floorsOverUnheatedSpacesRSI &&
                        "border-red-500 ring-2 ring-red-500"
                    )}
                />

                {(() => {
                    const minRSI = 5.02;
                    const validation = validateRSI_9362(
                        selections.floorsOverUnheatedSpacesRSI,
                        minRSI,
                        `floors over unheated spaces`
                    );

                    const showWarning = !validation.isValid && !!validation.warning;

                    return showWarning ? (
                        <WarningButton
                            title="🛑 RSI Value Too Low"
                            variant="destructive"
                            defaultOpen={true}
                        >
                            <p className="text-xs">
                                The RSI value must be increased to at least 5.02 to meet NBC 9.36.2
                                requirements for floors over unheated spaces.
                            </p>
                        </WarningButton>
                    ) : null;
                })()}

                <EffectiveRSIWarning />
            </div>}

            {selections.floorsSlabsSelected.includes("unheatedBelowFrost") && <div id="unheatedFloorBelowFrostRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Unheated Floor Below Frost Line <span className="text-red-500">*</span></label>
                <Input
                    required
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter RSI value or 'uninsulated'"
                    value={selections.unheatedFloorBelowFrostRSI}
                    onKeyDown={(e) => {
                        const allowedControlKeys = [
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                            "Home",
                            "End",
                        ];
                        if (allowedControlKeys.includes(e.key)) return;

                        const current = (selections.unheatedFloorBelowFrostRSI || "").toLowerCase();

                        // --- Numeric path ---
                        if (/^\d*\.?\d*$/.test(current)) {
                            if (/[0-9.]/.test(e.key)) return;
                        }

                        // --- "uninsulated" path ---
                        const target = "uninsulated";
                        if (/^[a-z]$/i.test(e.key)) {
                            const next = (current + e.key.toLowerCase());
                            if (target.startsWith(next)) return;
                        }

                        // block everything else
                        e.preventDefault();
                    }}
                    onChange={(e) => {
                        const raw = e.target.value;

                        // if typing text → restrict strictly to prefix of "uninsulated"
                        if (/^[a-z]/i.test(raw)) {
                            const target = "uninsulated";
                            const lower = raw.toLowerCase();

                            if (target.startsWith(lower)) {
                                setSelections((prev) => ({
                                    ...prev,
                                    unheatedFloorBelowFrostRSI: lower,
                                }));
                            }
                            return;
                        }

                        // numeric-only decimal
                        let v = raw.replace(/[^\d.]/g, "");
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setSelections((prev) => ({
                            ...prev,
                            unheatedFloorBelowFrostRSI: v,
                        }));
                    }}
                    onBlur={() => {
                        const v = (selections.unheatedFloorBelowFrostRSI || "").trim().toLowerCase();

                        // normalize keyword
                        if (v === "uninsulated") {
                            setSelections((prev) => ({
                                ...prev,
                                unheatedFloorBelowFrostRSI: "uninsulated",
                            }));
                            return;
                        }

                        // clean trailing dot
                        if (/^\d+\.$/.test(v)) {
                            setSelections((prev) => ({
                                ...prev,
                                unheatedFloorBelowFrostRSI: v.slice(0, -1),
                            }));
                        }
                    }}
                    className={cn(
                        (validationErrors.unheatedFloorBelowFrostRSI ||
                            isMissing("unheatedFloorBelowFrostRSI")) &&
                        missingFieldClass,
                        validationErrors.unheatedFloorBelowFrostRSI &&
                        "border-red-500 ring-2 ring-red-500"
                    )}
                />
                <div className="p-3 bg-muted border border-border rounded-md">
                    <p className="text-sm font-medium">
                        ℹ️ Unheated Floor Below Frost Line
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        This assembly typically remains uninsulated as per NBC requirements but can be insulated to improve comfort in these areas. Enter 'uninsulated' or specify an RSI value if insulation is provided.
                    </p>
                </div>
            </div>}

            {selections.floorsSlabsSelected.includes("unheatedAboveFrost") && <div id="unheatedFloorAboveFrostRSI" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Unheated Floor Above Frost Line <span className="text-red-500">*</span></label>
                <Input
                    required
                    type="text"
                    inputMode="decimal"
                    placeholder="Minimum RSI 1.96"
                    value={selections.unheatedFloorAboveFrostRSI}
                    onKeyDown={(e) => {
                        // allow navigation/edit keys
                        const allowedKeys = [
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                            "Home",
                            "End",
                        ];
                        if (allowedKeys.includes(e.key)) return;

                        // allow digits + dot
                        if (/[0-9.]/.test(e.key)) return;

                        // block everything else
                        e.preventDefault();
                    }}
                    onChange={(e) => {
                        const raw = e.target.value; // no trim here (prevents cursor lag)

                        // numeric-only decimal
                        let v = raw.replace(/[^\d.]/g, "");
                        const firstDot = v.indexOf(".");
                        if (firstDot !== -1) {
                            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
                        }

                        setSelections((prev) => ({
                            ...prev,
                            unheatedFloorAboveFrostRSI: v,
                        }));
                    }}
                    onBlur={() => {
                        const v = (selections.unheatedFloorAboveFrostRSI || "").trim();

                        // clean trailing dot (e.g. "1.")
                        if (/^\d+\.$/.test(v)) {
                            setSelections((prev) => ({
                                ...prev,
                                unheatedFloorAboveFrostRSI: v.slice(0, -1),
                            }));
                        }
                    }}
                    className={cn(
                        (validationErrors.unheatedFloorAboveFrostRSI ||
                            isMissing("unheatedFloorAboveFrostRSI")) &&
                        missingFieldClass,
                        validationErrors.unheatedFloorAboveFrostRSI && "border-red-500 ring-2 ring-red-500"
                    )}
                />

                {(() => {
                    const minRSI = 1.96;
                    const v = (selections.unheatedFloorAboveFrostRSI || "").trim();

                    const showWarning =
                        v !== "" &&
                        !isNaN(Number(v)) &&
                        Number(v) < minRSI;

                    return showWarning ? (
                        <WarningButton
                            title="🛑 RSI Value Too Low"
                            variant="destructive"
                            defaultOpen={true}
                        >
                            <p className="text-xs">
                                The RSI value must be increased to at least 1.96 to meet NBC
                                requirements for unheated floor above frost line.
                            </p>
                        </WarningButton>
                    ) : null;
                })()}

                <EffectiveRSIWarning />
            </div>}

            <div id="windowUValue" className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Window & Door U-Value <span className="text-red-500">*</span></label>
                    <InfoButton title="Did You Know?">
                        <div className="space-y-4">
                            <div>
                                <p className="text-base text-muted-foreground">
                                    Part 9.36 of the building code allows limited trade-offs in your above-ground building envelope design so you can keep flexibility while still meeting energy efficiency rules. If you’re a builder or designer trying to tweak R-values without triggering performance modelling, you’ve got three basic options:
                                </p>
                            </div>

                            <div>
                                <h5 className="font-medium text-base mb-1">1. Wall-to-Wall Trade-offs</h5>
                                <p className="text-base text-muted-foreground">
                                    Want to use a thinner wall in one spot? You can do that — as long as you boost the insulation elsewhere to balance it out. Total area and thermal performance must stay the same overall, and there are limits on how low you can go.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-medium text-base mb-1">2. Window-to-Window Trade-offs</h5>
                                <p className="text-base text-muted-foreground">
                                    Need to use a cheaper window with a higher U-value? No problem — just improve the performance of other windows in the same direction (e.g., all south-facing). Everything needs to net out to the same overall heat loss.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-medium text-base mb-1">3. Window Area for Attic Insulation (Modular Homes Only)</h5>
                                <p className="text-base text-muted-foreground">
                                    Factory-built homes with low rooflines (due to transport limits) might not fit the required attic insulation. If your home has fewer windows (less than 15% of the wall area), that reduced heat loss gives you an “energy credit” to offset the missing attic insulation.
                                </p>
                            </div>

                            <div>
                                <p className="text-base text-muted-foreground">
                                    These are simple, cost-saving tools that let you stay code-compliant without full performance modelling — but they only apply to above-grade assemblies, and you’ll need to follow specific rules for area, orientation, and limits on how much you can trade.
                                </p>
                            </div>

                            <div>
                                <p className="text-base text-muted-foreground">
                                    <b>Alternatively</b>, performance modelling offers more flexibility, allowing you to mix and match upgrades across the whole building. It often leads to smarter material choices, more design freedom, and cost savings over prescriptive compliance - especially for complex or high-performance homes.
                                </p>
                            </div>
                        </div>
                        <Button asChild variant="secondary" className="h-6 px-2 text-xs">
                            <a href="/find-a-provider" target="_blank" rel="noopener noreferrer">
                                <Search className="h-4 w-4" />
                                Find a service provider
                            </a>
                        </Button>
                    </InfoButton>
                </div>
                <Input required type="text"
                    placeholder="Input Range of U-values - Max U-Value 1.61 W/(m²·K) or Min Energy Rating ≥ 25"
                    value={selections.windowUValue}
                    onChange={e => setSelections(prev => ({
                        ...prev,
                        windowUValue: e.target.value
                    }))}
                    className={cn(
                        (validationErrors.windowUValue || isMissing("windowUValue")) && missingFieldClass,
                        validationErrors.windowUValue && "border-red-500 ring-2 ring-red-500"
                    )}
                />
                {(() => {
                    // Check if input is a U-value and if it's too high
                    const inputValue = selections.windowUValue;
                    if (inputValue) {
                        const numValue = parseFloat(inputValue);
                        if (!isNaN(numValue) && numValue > 1.61) {
                            return <WarningButton title="U-Value Too High" variant="destructive">
                                <p className="text-sm text-destructive/80">
                                    The U-value must be 1.61 W/(m²·K) or lower to meet NBC 9.36.2 requirements for windows and doors.
                                </p>
                            </WarningButton>;
                        }
                    }
                    return null;
                })()}
                <WarningButton title="ℹ️ Window & Door Performance Verification">
                    <p>
                        Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please record the range of lowest-highest performing window and door U-Value’s (ie, U-value W/(m²×).
                    </p>
                    <p className="mt-2">
                        See below an illustrative example of a window unit showing the performance values that must be recorded in the Window & Door Schedule.
                    </p>
                    <img src="/assets/img/window-door-uvalue-example.png" alt="Window & Door Performance Example" className="mt-4 rounded-md border mx-auto block" />
                </WarningButton>
            </div>

            <div id="hasSkylights" className={cn(
                "space-y-2",
                (validationErrors.hasSkylights || isMissing("hasSkylights")) && "p-2 border-2 border-red-500 rounded-md bg-red-50"
            )}>
                <label className="text-sm font-medium text-foreground">Does the house have skylights? <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input required type="radio" name="hasSkylights-9362" value="yes" checked={selections.hasSkylights === "yes"} onChange={e => setSelections(prev => ({
                            ...prev,
                            hasSkylights: e.target.value
                        }))} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input required type="radio" name="hasSkylights-9362" value="no" checked={selections.hasSkylights === "no"} onChange={e => setSelections(prev => ({
                            ...prev,
                            hasSkylights: e.target.value,
                            skylightUValue: ""
                        }))} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">No</span>
                    </label>
                </div>
            </div>

            {selections.hasSkylights === "yes" && <div id="skylightUValue" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Skylight U-Value <span className="text-red-500">*</span></label>
                <Input required type="text"
                    placeholder={`Enter U-value (maximum ${selections.province === "alberta" && selections.climateZone === "7B" ? "2.41" : "2.75"} W/(m²·K))`}
                    value={selections.skylightUValue}
                    onChange={e => setSelections(prev => ({
                        ...prev,
                        skylightUValue: e.target.value
                    }))}
                    className={cn(
                        (validationErrors.skylightUValue || isMissing("skylightUValue")) && missingFieldClass,
                        validationErrors.skylightUValue && "border-red-500 ring-2 ring-red-500"
                    )}
                />
                {(() => {
                    return selections.skylightUValue && parseFloat(selections.skylightUValue) > maxUValue && <WarningButton title="U-Value Too High" variant="destructive">
                        <p className="text-sm text-destructive/80">
                            The U-value must be reduced to {maxUValue} or lower to meet NBC requirements for skylights in your climate zone.
                        </p>
                    </WarningButton>;
                })()}
            </div>}

            {selections.hasSkylights === "yes" && <WarningButton title="⚠️ Important: Skylight Shaft Insulation">
                <p className="text-xs">
                    Skylight shafts must be insulated to at least the same RSI value required for above‑grade exterior walls.
                </p>
            </WarningButton>}

            <div id="airtightness" className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Airtightness Level (Unguarded Testing) <span className="text-red-500">*</span></label>
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
                                        <img src="/lovable-uploads/9d231144-3c4e-430b-9f8c-914698eae23e.png" alt="Figure 9.25-9 Potential air leakage locations in a house showing various points where air can escape including joints at attic hatches, ceiling light fixtures, windows, electrical outlets, around posts and columns, chimney leaks, plumbing stack penetrations, and more" className="w-full h-auto border border-border rounded" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Figure 9.25-9 from Housing and Small Buildings - Illustrated User's Guide, National Building Code of Canada 2020, Part 9 of Division B
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/50 rounded-md space-y-2">
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
                <Input
                    type="text"
                    value={selections.airtightness ? `${selections.airtightness} ACH50` : 'Select province and building type'}
                    disabled
                    className="disabled:opacity-75 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Target air-leakage rate is automatically assigned based on location.</p>

                <WarningButton title="⚠️ Caution: Air-Tightness Targets Without Testing History">
                    <div className="text-xs space-y-2">
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
                </WarningButton>

                {/* Mid-Construction Blower Door Test Checkbox */}
                <div id="midConstructionBlowerDoorPlanned" className="space-y-3 pt-4 border-t border-border/20">
                    <div className="flex items-start gap-3">
                        <input type="checkbox" id="midConstructionBlowerDoor-9362" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                            ...prev,
                            midConstructionBlowerDoorPlanned: e.target.checked
                        }))} className="w-4 h-4 text-primary mt-1" />
                        <div className="flex-1">
                            <label htmlFor="midConstructionBlowerDoor-9362" className="text-sm font-medium cursor-pointer text-foreground">
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

                    <WarningButton title="ℹ️ Benefits of Mid-Construction Blower Door Testing">
                        <div className="text-xs space-y-2">
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
                    </WarningButton>
                </div>
            </div>

        </div>
    );
}