import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, ChevronDown, Search, AlertTriangle } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { cn } from "@/lib/utils";
import { EffectiveRSIWarning } from "@/components/NBCCalculator/components/EffectiveRSIWarning";

import { getZoneOptions } from "../../../../NBCCalculator/constants/options";

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

    const zoneOptions = getZoneOptions(selections.climateZone);

    const hrvOptions = zoneOptions.hrv;
    const waterHeaterOptions = zoneOptions.waterHeater;

    return (
        <div className="space-y-6">
            {/* Auto-set HRV to required for 9368 and show notification */}
            {selections.compliancePath === "9368" && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-2 py-1 dark:bg-green-950/20 dark:border-green-500/30">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        <p className="text-sm text-green-800 dark:text-green-300">
                            HRV/ERV is mandatory for Path 9.36.8. Your selection is locked to "With HRV".
                        </p>
                    </div>
                </div>
            )}

            <div id="heatingType" className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Heating Type <span className="text-red-500">*</span></label>
                    <InfoButton title="CAN/CSA F280-12 - Room by Room Heat Loss/Gain Calculation">
                        <div className="space-y-4">
                            <div>
                                <h5 className="font-medium text-base mb-2">What's the Benefit of an F280 Calculation?</h5>
                                <p className="text-base text-muted-foreground">
                                    An F280 is a room-by-room heat loss and gain calculation that ensures your heating and cooling
                                    system is sized exactly right for your home — not based on guesses or whole-house averages.
                                    It's especially useful for energy-efficient homes, where oversized systems waste energy, cost more,
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
                <Select required value={selections.heatingType} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    heatingType: value,
                    heatingEfficiency: "",
                    otherHeatingEfficiency: "",
                    indirectTank: value !== 'boiler' ? '' : prev.indirectTank,
                    indirectTankSize: value !== 'boiler' ? '' : prev.indirectTankSize,
                }))}>
                    <SelectTrigger className={cn(
                        (validationErrors.heatingType || isMissing("heatingType")) && missingFieldClass,
                        validationErrors.heatingType && "border-red-500 ring-2 ring-red-500"
                    )}>
                        <SelectValue placeholder="Select heating type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="furnace">Furnace</SelectItem>
                        <SelectItem value="boiler">Boiler</SelectItem>
                        <SelectItem value="heat-pump">Heat Pump</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.heatingType && (
                <div id="heatingEfficiency" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        {selections.heatingType === 'heat-pump' ? 'Heat Pump Type and Efficiency' : 'Heating Efficiency'} <span className="text-red-500">*</span>
                    </label>
                    <Input required type="text"
                        placeholder={selections.heatingType === 'boiler' ? "Enter heating efficiency (e.g. 90% AFUE)" : selections.heatingType === 'heat-pump' ? "Enter heat pump efficiency (e.g. 10.0 HSPF)" : "Enter heating efficiency (e.g. 95% AFUE)"}
                        value={selections.heatingEfficiency}
                        onChange={e => setSelections(prev => ({
                            ...prev,
                            heatingEfficiency: e.target.value
                        }))}
                        className={cn(
                            (validationErrors.heatingEfficiency || isMissing("heatingEfficiency")) && missingFieldClass,
                            validationErrors.heatingEfficiency && "border-red-500 ring-2 ring-red-500"
                        )}
                    />
                </div>
            )}

            {selections.heatingType === 'boiler' && <div className="space-y-4">
                <div id="indirectTank" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Are you installing an indirect tank? <span className="text-red-500">*</span></label>
                    <Select required value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        indirectTank: value,
                        indirectTankSize: value === 'no' ? '' : prev.indirectTankSize
                    }))}>
                        <SelectTrigger className={cn(
                            (validationErrors.indirectTank || isMissing("indirectTank")) && missingFieldClass,
                            validationErrors.indirectTank && "border-red-500 ring-2 ring-red-500"
                        )}>
                            <SelectValue placeholder="Select if installing indirect tank" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selections.indirectTank === 'yes' && <div id="indirectTankSize" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Primary System Indirect Tank Size <span className="text-red-500">*</span></label>
                    <Select value={selections.indirectTankSize} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        indirectTankSize: value
                    }))}>
                        <SelectTrigger className={cn(
                            (validationErrors.indirectTankSize || isMissing("indirectTankSize")) && missingFieldClass,
                            validationErrors.indirectTankSize && "border-red-500 ring-2 ring-red-500"
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

            {/* HRV/ERV Section for 9368 - Mandatory */}
            <div className="space-y-3" id="hrvEfficiency">
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
                                <div className="flex justify-between items-center gap-3 w-full">
                                <span>{option.label}</span>
                                <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                    {option.points} pts
                                </Badge>
                            </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Secondary Suite HRV - Show for buildings with multiple units */}
            {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && selections.hasHrv === "with_hrv" && <div id="hasSecondaryHrv" className="space-y-4 p-4 bg-muted/50 border rounded-md">
                <h5 className="font-medium text-foreground">Secondary Suite HRV/ERV</h5>

                <div className="space-y-2">
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
                    <label className="text-sm font-medium text-foreground">Secondary Suite HRV/ERV Efficiency</label>
                    <Select
                        value={selections.secondaryHrvEfficiency}
                        onValueChange={(value) =>
                            setSelections((prev: any) => ({
                                ...prev,
                                secondaryHrvEfficiency: value,
                            }))
                        }
                    >
                        <SelectTrigger className={cn(
                            (isMissing("secondaryHrvEfficiency")) && missingFieldClass
                        )}>
                            <SelectValue placeholder="Select HRV/ERV option" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                            {hrvOptions.slice(1).map((option: any) => (
                                <SelectItem key={option.value} value={option.value}>
                                    <div className="flex justify-between items-center gap-3 w-full">
                                        <span>{option.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>}
            </div>}

            {/* Service Water Heater */}
            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <div id="waterHeater" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Service Water Heater <span className="text-red-400">*</span></label>
                <Select value={selections.waterHeater} onValueChange={value => setSelections((prev: any) => ({
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
                            <div className="flex justify-between items-center gap-3 w-full">
                                <span>{option.label}</span>
                                <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                    {option.points} pts
                                </Badge>
                            </div>
                        </SelectItem>)}
                    </SelectContent>
                </Select>
            </div>}

            {/* F280 Calculation (only when required by city/jurisdiction) */}
            {isF280RequiredCity && (
                <div id="hasF280Calculation" className="space-y-2">
                    <div className="rounded-lg border border-red-200 bg-orange-50 px-2 py-1 dark:bg-orange-950/20 dark:border-red-500/30">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">ℹ️</span>
                            <p className="text-xs text-red-800 dark:text-red-300">
                                <strong>CSA-F280 Calculation Required:</strong> This calculation is mandatory for applications in {selections.city}.
                            </p>
                        </div>
                    </div>
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
                            (validationErrors.hasF280Calculation || isMissing("hasF280Calculation")) && missingFieldClass,
                            validationErrors.hasF280Calculation && "border-red-500 ring-2 ring-red-500"
                        )}>
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>

                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                            <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
                            <SelectItem value="in-progress-or-na">F280 in Progress or N/A</SelectItem>
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
                                <SelectItem value="hot-water-tank">Hot Water Tank serving in-floor heat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
    
                    {(selections.murbSecondHeatingType === 'boiler' || selections.murbSecondHeatingType === 'hot-water-tank') && selections.hasInFloorHeat !== 'yes' && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive font-medium">
                                You selected a boiler / DHW in-floor system, but "Heated floors" is not selected. Please add "Heated floors" as a under "Is the house installing or roughing in in-floor heat?" type or pick a different system.
                            </p>
                        </div>
                    )}
    
                    {selections.murbSecondHeatingType && <div id="murbSecondHeatingEfficiency" className="space-y-2">
                        <label className="text-sm font-medium text-green-800 dark:text-green-300">Second Heating System Efficiency <span className="text-red-400">*</span></label>
                        <Input type="text" placeholder={selections.murbSecondHeatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.murbSecondHeatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : selections.murbSecondHeatingType === 'hot-water-tank' ? "Enter efficiency (e.g. 0.82 UEF)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.murbSecondHeatingEfficiency} onChange={e => setSelections(prev => ({
                            ...prev,
                            murbSecondHeatingEfficiency: e.target.value
                        }))}
                            className={cn(
                                (validationErrors.murbSecondHeatingEfficiency || isMissing("murbSecondHeatingEfficiency")) && missingFieldClass,
                                validationErrors.murbSecondHeatingEfficiency && "border-red-500 ring-2 ring-red-500"
                            )}
                        />
                        {selections.murbSecondHeatingEfficiency && !['heat-pump', 'hot-water-tank'].includes(selections.murbSecondHeatingType) && (() => {
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
                        {selections.murbSecondWaterHeater && (() => {
                            const inputValue = parseFloat(selections.murbSecondWaterHeater);
                            if (isNaN(inputValue)) return null;

                            let minValue = 0;
                            let systemType = "";

                            switch (selections.murbSecondWaterHeaterType) {
                                case "gas-storage":
                                    minValue = 0.60;
                                    systemType = "Gas Storage Tank (UEF ≥0.60 minimum)";
                                    break;
                                case "gas-tankless":
                                    minValue = 0.86;
                                    systemType = "Gas Tankless (UEF ≥0.86 minimum)";
                                    break;
                                case "electric-storage":
                                    minValue = 0.35;
                                    systemType = "Electric Storage Tank (UEF ≥0.35 minimum)";
                                    break;
                                case "heat-pump":
                                    minValue = 2.1;
                                    systemType = "Heat Pump Water Heater (EF ≥2.1 minimum)";
                                    break;
                                default:
                                    return null;
                            }

                            if (inputValue < minValue) {
                                return (
                                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                        <p className="text-sm text-destructive font-medium">
                                            ⚠️ Second Water Heater Efficiency Too Low
                                        </p>
                                        <p className="text-xs text-destructive/80 mt-1">
                                            {systemType} - Your input of {inputValue} is below the minimum requirement.
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>}
                </div>}
            </div>}
        </div>
    );
}