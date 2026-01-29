import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, ChevronDown, Search, AlertTriangle } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { cn } from "@/lib/utils";
import { EffectiveRSIWarning } from "@/components/NBCCalculator/components/EffectiveRSIWarning";

import {
    hrvOptions,
    waterHeaterOptions,
} from "../../../../NBCCalculator/constants/options";

export default function MechanicalSection({
    selections,
    setSelections,
    validationErrors,
    showMissingFields,
    hasMissingMechanical,
    mechanicalCompleted,
    mechanicalKeys,
    isMissing,
    missingFieldClass,
    isF280RequiredCity,
}: any) {
    return (
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
            {isF280RequiredCity && (
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
            )}

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
    );
}
