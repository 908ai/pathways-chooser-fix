import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import InfoButton from "@/components/InfoButton";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WarningButton } from "./WarningButton";
import { heatPumpOptions } from "../constants";

export function MechanicalSection({
    selections,
    setSelections,
    validationErrors,
    showMissingFields,
    isMissing,
    missingFieldClass,
    isF280RequiredCity,
    isWaterHeaterBoiler,
    isSecondaryWaterHeaterBoiler,
}: {
    selections: any;
    setSelections: any;
    validationErrors: Record<string, boolean>;
    showMissingFields: boolean;
    isMissing: (key: string) => boolean;
    missingFieldClass: string;
    isF280RequiredCity: boolean;
    isWaterHeaterBoiler: boolean;
    isSecondaryWaterHeaterBoiler: boolean;
}) {
    return (
        <div className="space-y-4">
            {/* F280 Calculation (only when required by city/jurisdiction) */}
            {isF280RequiredCity && (
                <div id="hasF280Calculation" className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground">
                            Have you completed the required CSA-F280 Calculation for heating and cooling loads?
                            <span className="text-red-500"> *</span>
                        </label>

                        <InfoButton title="What is an F280 Calculation?">
                            <div className="space-y-4">
                                <p className="text-sm text-foreground">
                                    An F280 calculation is a heating and cooling load calculation based on CSA Standard F280.
                                    It helps size HVAC equipment properly based on insulation, windows, air leakage, and climate.
                                </p>

                                <div>
                                    <p className="text-sm font-medium mb-2">Why it's beneficial:</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Ensures equipment is properly sized (not too big or too small).</li>
                                        <li>Improves comfort and efficiency.</li>
                                        <li>Can reduce costs by avoiding oversized systems.</li>
                                        <li>Often required for permits in some jurisdictions.</li>
                                    </ul>
                                </div>

                                <div className="p-3 bg-blue-100 rounded-md">
                                    <p className="text-sm font-medium mb-1">💡 Pro Tip:</p>
                                    <p className="text-sm text-foreground">
                                        F280 is especially helpful in energy-efficient homes where heating loads are much lower.
                                    </p>
                                </div>
                            </div>
                        </InfoButton>
                    </div>

                    <Select
                        required
                        value={selections.hasF280Calculation}
                        onValueChange={(value) =>
                            setSelections((prev) => ({
                                ...prev,
                                hasF280Calculation: value,
                            }))
                        }
                    >
                        <SelectTrigger className={cn(isMissing("hasF280Calculation") && missingFieldClass)}>
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>

                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                            <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div id="heatingType" className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Heating Type <span className="text-red-500">*</span></label>
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

            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500/50 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
                    ⚠️ Mechanical Equipment Documentation
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                    The Authority Having Jurisdiction (AHJ) may verify specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations. More info at: <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">https://solinvictusenergyservices.com/cancsa-f28012</a>
                </p>
            </div>

            {selections.heatingType && (
                <div id="heatingEfficiency" className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground">
                            {selections.heatingType === 'heat-pump' ? 'Heat Pump Type and Efficiency' : 'Heating Efficiency'} <span className="text-red-500">*</span>
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
                                <SelectTrigger className={cn(
                                    (validationErrors.heatingEfficiency || isMissing("heatingEfficiency")) && missingFieldClass,
                                    validationErrors.heatingEfficiency && "border-red-500 ring-2 ring-red-500"
                                )}>
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
                                        className={cn((validationErrors.otherHeatingEfficiency || isMissing("otherHeatingEfficiency")) && missingFieldClass)}
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
                        <Input required type="text"
                            placeholder={selections.heatingType === 'boiler' ? "Enter heating efficiency (e.g. 90% AFUE)" : "Enter heating efficiency (e.g. 95% AFUE)"}
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
                            <Alert variant="destructive">
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
                    <label className="text-sm font-medium text-foreground">Indirect tank size (gallons) <span className="text-red-500">*</span></label>
                    <Input required type="number"
                        placeholder="Enter tank size in gallons"
                        value={selections.indirectTankSize}
                        onChange={e => setSelections(prev => ({
                            ...prev,
                            indirectTankSize: e.target.value
                        }))}
                        className={cn(
                            (validationErrors.indirectTankSize || isMissing("indirectTankSize")) && missingFieldClass,
                            validationErrors.indirectTankSize && "border-red-500 ring-2 ring-red-500"
                        )}
                    />
                </div>}
            </div>}

            {/* Secondary Suite Heating - Show for single-detached with secondary suite AND multi-unit buildings for performance path */}
            {((selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && ["9362", "9365", "9367"].includes(selections.compliancePath)) && <div className="space-y-4 p-4 bg-muted/50 border rounded-md">
                <h5 className="font-medium text-foreground">Secondary Suite Heating System</h5>

                <div id="hasSecondaryHeating" className={cn(
                    "space-y-2",
                    (validationErrors.hasSecondaryHeating || isMissing("hasSecondaryHeating")) && "p-2 border-2 border-red-500 rounded-md bg-red-50"
                )}>
                    <label className="text-sm font-medium text-foreground">Will there be a separate heating system for the secondary suite? <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input required type="radio" name="hasSecondaryHeating" value="yes" checked={selections.hasSecondaryHeating === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHeating: e.target.value,
                                secondaryHeatingType: "",
                                // Reset when changing
                                secondaryHeatingEfficiency: "",
                                otherSecondaryHeatingEfficiency: "",
                                secondaryIndirectTank: "",
                                secondaryIndirectTankSize: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input required type="radio" name="hasSecondaryHeating" value="no" checked={selections.hasSecondaryHeating === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHeating: e.target.value,
                                secondaryHeatingType: "",
                                secondaryHeatingEfficiency: "",
                                otherSecondaryHeatingEfficiency: "",
                                secondaryIndirectTank: "",
                                secondaryIndirectTankSize: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasSecondaryHeating === "yes" && <>
                    <div id="secondaryHeatingType" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Secondary Suite Heating Type <span className="text-red-500">*</span></label>
                        <Select required value={selections.secondaryHeatingType} onValueChange={value => setSelections(prev => ({
                            ...prev,
                            secondaryHeatingType: value,
                            secondaryHeatingEfficiency: "",
                            otherSecondaryHeatingEfficiency: "",
                            secondaryIndirectTank: value !== 'boiler' ? '' : prev.secondaryIndirectTank,
                            secondaryIndirectTankSize: value !== 'boiler' ? '' : prev.secondaryIndirectTankSize,
                        }))}>
                            <SelectTrigger className={cn(
                                (validationErrors.secondaryHeatingType || isMissing("secondaryHeatingType")) && missingFieldClass,
                                validationErrors.secondaryHeatingType && "border-red-500 ring-2 ring-red-500"
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

                    {selections.secondaryHeatingType && <div id="secondaryHeatingEfficiency" className="space-y-2">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-foreground">
                                {selections.secondaryHeatingType === 'heat-pump' ? 'Secondary Heat Pump Type and Efficiency' : 'Secondary Suite Heating Efficiency'} <span className="text-red-500">*</span>
                            </label>
                            {selections.secondaryHeatingType === 'heat-pump' && (
                                <InfoButton title="Heat Pump Efficiency">
                                    Select the applicable heat pump type to automatically apply the minimum efficiency requirement based on NBC Table 9.36.3.10. If your system type or performance rating is not listed, choose Other and enter specifications manually.
                                </InfoButton>
                            )}
                        </div>
                        {selections.secondaryHeatingType === 'heat-pump' ? (
                            <>
                                <Select required value={selections.secondaryHeatingEfficiency} onValueChange={value => setSelections(prev => ({ ...prev, secondaryHeatingEfficiency: value, otherSecondaryHeatingEfficiency: "" }))}>
                                    <SelectTrigger className={cn(
                                        (validationErrors.secondaryHeatingEfficiency || isMissing("secondaryHeatingEfficiency")) && missingFieldClass,
                                        validationErrors.secondaryHeatingEfficiency && "border-red-500 ring-2 ring-red-500"
                                    )}>
                                        <SelectValue placeholder="Select heat pump type and efficiency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {heatPumpOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selections.secondaryHeatingEfficiency === 'Other' && (
                                    <div className="mt-2 space-y-2">
                                        <Input
                                            required
                                            type="text"
                                            placeholder="Enter specifications manually"
                                            value={selections.otherSecondaryHeatingEfficiency || ''}
                                            onChange={e => setSelections(prev => ({ ...prev, otherSecondaryHeatingEfficiency: e.target.value }))}
                                            className={cn((validationErrors.otherSecondaryHeatingEfficiency || isMissing("otherSecondaryHeatingEfficiency")) && missingFieldClass)}
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
                            <Input required type="text"
                                placeholder={selections.secondaryHeatingType === 'boiler' ? "Enter heating efficiency (e.g. 90% AFUE)" : "Enter heating efficiency (e.g. 95% AFUE)"}
                                value={selections.secondaryHeatingEfficiency}
                                onChange={e => setSelections(prev => ({
                                    ...prev,
                                    secondaryHeatingEfficiency: e.target.value
                                }))}
                                className={cn(
                                    (validationErrors.secondaryHeatingEfficiency || isMissing("secondaryHeatingEfficiency")) && missingFieldClass,
                                    validationErrors.secondaryHeatingEfficiency && "border-red-500 ring-2 ring-red-500"
                                )}
                            />
                        )}
                        {selections.secondaryHeatingEfficiency && selections.secondaryHeatingType !== 'heat-pump' && (() => {
                            const inputValue = parseFloat(selections.secondaryHeatingEfficiency);
                            let minValue = 0;
                            let systemType = "";
                            if (selections.secondaryHeatingType === 'boiler') {
                                minValue = 90;
                                systemType = "Boiler (90% AFUE minimum)";
                            } else {
                                minValue = 95; // Furnace
                                systemType = "Furnace (95% AFUE minimum)";
                            }

                            const showWarning = !isNaN(inputValue) && inputValue < minValue;

                            return showWarning ? (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Secondary Heating Efficiency Too Low</AlertTitle>
                                    <AlertDescription>
                                        {systemType} – Your input of {inputValue} is below the minimum requirement.
                                    </AlertDescription>
                                </Alert>
                            ) : null;


                        })()}
                    </div>}

                    {selections.secondaryHeatingType === 'boiler' && <div className="space-y-4">
                        <div id="secondaryIndirectTank" className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Are you installing an indirect tank for the secondary suite? <span className="text-red-500">*</span></label>
                            <Select required value={selections.secondaryIndirectTank} onValueChange={value => setSelections(prev => ({
                                ...prev,
                                secondaryIndirectTank: value,
                                secondaryIndirectTankSize: value === 'no' ? '' : prev.secondaryIndirectTankSize,
                            }))}>
                                <SelectTrigger className={cn(
                                    (validationErrors.secondaryIndirectTank || isMissing("secondaryIndirectTank")) && missingFieldClass,
                                    validationErrors.secondaryIndirectTank && "border-red-500 ring-2 ring-red-500"
                                )}>
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selections.secondaryIndirectTank === 'yes' && <div id="secondaryIndirectTankSize" className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Secondary Suite Indirect Tank Size (Gallons) <span className="text-red-500">*</span></label>
                            <Input required type="text"
                                placeholder="Enter tank size in gallons (e.g., 40, 50, 60, 80)"
                                value={selections.secondaryIndirectTankSize}
                                onChange={e => setSelections(prev => ({
                                    ...prev,
                                    secondaryIndirectTankSize: e.target.value
                                }))}
                                className={cn(
                                    (validationErrors.secondaryIndirectTankSize || isMissing("secondaryIndirectTankSize")) && missingFieldClass,
                                    validationErrors.secondaryIndirectTankSize && "border-red-500 ring-2 ring-red-500"
                                )}
                            />
                        </div>}
                    </div>}
                </>}
            </div>}

            <div id="coolingApplicable" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Are you installing cooling/air conditioning? <span className="text-red-500">*</span></label>
                <Select required value={selections.coolingApplicable} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    coolingApplicable: value,
                    coolingEfficiency: value === 'no' ? '' : prev.coolingEfficiency,
                }))}>
                    <SelectTrigger className={cn(
                        (validationErrors.coolingApplicable || isMissing("coolingApplicable")) && missingFieldClass,
                        validationErrors.coolingApplicable && "border-red-500 ring-2 ring-red-500"
                    )}>
                        <SelectValue placeholder="Select if cooling is applicable" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.coolingApplicable === "yes" && (
                <div id="coolingEfficiency" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Cooling System Efficiency <span className="text-red-500">*</span></label>
                    <Input
                        required
                        type="text"
                        placeholder="Enter SEER (min 14.5) or SEER2 (min 14.3) value"
                        value={selections.coolingEfficiency}
                        onChange={e => setSelections(prev => ({
                            ...prev,
                            coolingEfficiency: e.target.value
                        }))}
                        className={cn(
                            (validationErrors.coolingEfficiency || isMissing("coolingEfficiency")) && missingFieldClass,
                            validationErrors.coolingEfficiency && "border-red-500 ring-2 ring-red-500"
                        )}
                    />
                </div>
            )}

            <div id="waterHeaterType" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Service Water Heater Type <span className="text-red-500">*</span></label>
                <Select required value={selections.waterHeaterType} onValueChange={value => {
                    setSelections((prev: any) => ({
                        ...prev,
                        waterHeaterType: value,
                        waterHeater: "", // Reset efficiency when type changes
                        otherWaterHeaterType: value !== 'other' ? '' : prev.otherWaterHeaterType,
                    }));
                }} disabled={isWaterHeaterBoiler}>
                    <SelectTrigger className={cn(
                        (validationErrors.waterHeaterType || isMissing("waterHeaterType")) && missingFieldClass,
                        validationErrors.waterHeaterType && "border-red-500 ring-2 ring-red-500"
                    )}>
                        <SelectValue placeholder="Select water heater type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="boiler">Boiler</SelectItem>
                        <SelectItem value="gas-storage">Gas Storage Tank</SelectItem>
                        <SelectItem value="gas-tankless">Gas Tankless</SelectItem>
                        <SelectItem value="electric-storage">Electric Storage Tank</SelectItem>
                        <SelectItem value="electric-tankless">Electric Tankless</SelectItem>
                        <SelectItem value="electric-heat-pump">Electric Heat Pump</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.waterHeaterType === "other" && <div id="otherWaterHeaterType" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Specify Other Water Heater Type <span className="text-red-500">*</span></label>
                <Input required type="text"
                    placeholder="Please specify the water heater type"
                    value={selections.otherWaterHeaterType || ""}
                    onChange={e => setSelections(prev => ({
                        ...prev,
                        otherWaterHeaterType: e.target.value
                    }))}
                    className={cn(
                        (validationErrors.otherWaterHeaterType || isMissing("otherWaterHeaterType")) && missingFieldClass,
                        validationErrors.otherWaterHeaterType && "border-red-500 ring-2 ring-red-500"
                    )}
                />
            </div>}

            {selections.waterHeaterType && selections.waterHeaterType !== 'boiler' && <div id="waterHeater" className="space-y-2">
                <label className="text-sm font-medium text-foreground">Service Water Heater Efficiency <span className="text-red-500">*</span></label>
                <Input required type="text" placeholder={(() => {
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
                }))}
                    className={cn(
                        (validationErrors.waterHeater || isMissing("waterHeater")) && missingFieldClass,
                        validationErrors.waterHeater && "border-red-500 ring-2 ring-red-500"
                    )}
                />
            </div>}

            {/* Secondary Suite Water Heater - Show for single-detached with secondary suite AND multi-unit buildings for performance path */}
            {((selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && ["9362", "9365", "9367"].includes(selections.compliancePath)) &&
             <div className="space-y-4 p-4 bg-muted/50 border rounded-md">
                <h5 className="font-medium text-foreground">Secondary Suite Water Heating</h5>

                <div id="hasSecondaryWaterHeater" className={cn(
                    "space-y-2",
                    (validationErrors.hasSecondaryWaterHeater || isMissing("hasSecondaryWaterHeater")) && "p-2 border-2 border-red-500 rounded-md bg-red-50"
                )}>
                    <label className="text-sm font-medium text-foreground">Will there be a second hot water system for the secondary suite? <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input required type="radio" name="hasSecondaryWaterHeater" value="yes" checked={selections.hasSecondaryWaterHeater === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryWaterHeater: e.target.value,
                                secondaryWaterHeaterSameAsMain: "",
                                // Reset when changing
                                secondaryWaterHeater: "",
                                secondaryWaterHeaterType: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input required type="radio" name="hasSecondaryWaterHeater" value="no" checked={selections.hasSecondaryWaterHeater === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryWaterHeater: e.target.value,
                                secondaryWaterHeaterSameAsMain: "",
                                secondaryWaterHeater: "",
                                secondaryWaterHeaterType: ""
                            }))} className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasSecondaryWaterHeater === "yes" && <>
                    <div id="secondaryWaterHeaterSameAsMain" className={cn(
                        "space-y-2",
                        (validationErrors.secondaryWaterHeaterSameAsMain || isMissing("secondaryWaterHeaterSameAsMain")) && "p-2 border-2 border-red-500 rounded-md bg-red-50"
                    )}>
                        <label className="text-sm font-medium text-foreground">Will it be the same as the main water heater system? <span className="text-red-500">*</span></label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input required type="radio" name="secondaryWaterHeaterSameAsMain" value="yes" checked={selections.secondaryWaterHeaterSameAsMain === "yes"} onChange={e => setSelections(prev => ({
                                    ...prev,
                                    secondaryWaterHeaterSameAsMain: e.target.value,
                                    secondaryWaterHeater: "",
                                    secondaryWaterHeaterType: ""
                                }))} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input required type="radio" name="secondaryWaterHeaterSameAsMain" value="no" checked={selections.secondaryWaterHeaterSameAsMain === "no"} onChange={e => setSelections(prev => ({
                                    ...prev,
                                    secondaryWaterHeaterSameAsMain: e.target.value
                                }))} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">No</span>
                            </label>
                        </div>
                    </div>

                    {selections.secondaryWaterHeaterSameAsMain === "no" && <>
                        <div id="secondaryWaterHeaterType" className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Secondary Suite Water Heater Type <span className="text-red-500">*</span></label>
                            <Select required value={selections.secondaryWaterHeaterType} onValueChange={value => {
                                setSelections(prev => ({
                                    ...prev,
                                    secondaryWaterHeaterType: value,
                                    secondaryWaterHeater: "" // Reset efficiency when type changes
                                }));
                            }} disabled={isSecondaryWaterHeaterBoiler}>
                                <SelectTrigger className={cn(
                                    (validationErrors.secondaryWaterHeaterType || isMissing("secondaryWaterHeaterType")) && missingFieldClass,
                                    validationErrors.secondaryWaterHeaterType && "border-red-500 ring-2 ring-red-500"
                                )}>
                                    <SelectValue placeholder="Select water heater type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="boiler">Boiler</SelectItem>
                                    <SelectItem value="gas-storage">Gas Storage Tank</SelectItem>
                                    <SelectItem value="gas-tankless">Gas Tankless</SelectItem>
                                    <SelectItem value="electric-storage">Electric Storage Tank</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selections.secondaryWaterHeaterType && selections.secondaryWaterHeaterType !== 'boiler' && <div id="secondaryWaterHeater" className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Secondary Suite Water Heater Efficiency <span className="text-red-500">*</span></label>
                            <Input required type="text" placeholder={(() => {
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
                            }))}
                                className={cn(
                                    (validationErrors.secondaryWaterHeater || isMissing("secondaryWaterHeater")) && missingFieldClass,
                                    validationErrors.secondaryWaterHeater && "border-red-500 ring-2 ring-red-500"
                                )}
                            />
                        </div>}
                    </>}
                </>}
            </div>}

            <div id="hasDWHR" className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Is a drain water heat recovery system being installed? <span className="text-red-500">*</span></label>
                    <InfoButton title="Drain Water Heat Recovery System Information">
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h4 className="font-medium text-base">ℹ️ Drain Water Heat Recovery (DWHR)</h4>
                            </div>

                            <div className="space-y-3">
                                <p className="text-base text-muted-foreground">
                                    DWHR systems capture heat from shower drain water and use it to preheat incoming cold water, reducing hot water energy use by 20–40%.
                                </p>

                                <div className="space-y-2">
                                    <h5 className="font-medium text-base">How it works:</h5>
                                    <p className="text-base text-muted-foreground">When hot water goes down the drain (like from a shower), the DWHR unit uses a heat exchanger to transfer that thermal energy to the incoming cold water supply before it reaches your water heater.</p>
                                </div>

                                <div className="space-y-2">
                                    <h5 className="font-medium text-base">Benefits:</h5>
                                    <div className="text-base text-muted-foreground space-y-1">
                                        <p>• Reduces water heating energy consumption</p>
                                        <p>• Lowers utility bills</p>
                                        <p>• Contributes to overall building energy efficiency</p>
                                        <p>• Works continuously with no maintenance required</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </InfoButton>
                </div>
                <Select required value={selections.hasDWHR} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasDWHR: value
                }))}>
                    <SelectTrigger className={cn(
                        (validationErrors.hasDWHR || isMissing("hasDWHR")) && missingFieldClass,
                        validationErrors.hasDWHR && "border-red-500 ring-2 ring-red-500"
                    )}>
                        <SelectValue placeholder="Select yes or no" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}