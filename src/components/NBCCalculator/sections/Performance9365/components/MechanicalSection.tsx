import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { cn } from "@/lib/utils";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import WarningButton from "./WarningButton";

export default function MechanicalSection({
  selections,
  setSelections,
  showMissingFields,
  hasMissingMechanical,
  mechanicalCompleted,
  mechanicalKeysLength,
  isMissing,
  missingFieldClass,
}: {
  selections: any;
  setSelections: any;
  showMissingFields: boolean;
  hasMissingMechanical: boolean;
  mechanicalCompleted: number;
  mechanicalKeysLength: number;
  isMissing: (key: string) => boolean;
  missingFieldClass: string;
}) {
  return (
    <AccordionItem value="mechanical">
      <AccordionTrigger className={cn("px-4", showMissingFields && hasMissingMechanical ? "bg-red-50 text-red-900" : "")}>
        <div className="flex w-full items-center justify-between">
          <span className="text-base flex items-center gap-2">
            Mechanical Systems
            {showMissingFields && hasMissingMechanical && <AlertTriangle className="h-4 w-4 text-red-600" />}
          </span>
          <Badge variant={showMissingFields && hasMissingMechanical ? "destructive" : "secondary"}>{mechanicalCompleted} / {mechanicalKeysLength} completed</Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-4">
        <div className="space-y-4">
          {selections.city && (selections.city.toLowerCase().trim() === "red deer" || selections.city.toLowerCase().trim() === "innisfail") && selections.province === "alberta" && <div id="hasF280Calculation" className="space-y-2">
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
              <SelectTrigger className={cn(isMissing("hasF280Calculation") && missingFieldClass)}>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
              </SelectContent>
            </Select>
          </div>}

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
            <Select value={selections.heatingType} onValueChange={value => setSelections(prev => ({
              ...prev,
              heatingType: value,
              heatingEfficiency: "",
              indirectTank: value !== 'boiler' ? '' : prev.indirectTank,
              indirectTankSize: value !== 'boiler' ? '' : prev.indirectTankSize,
            }))}>
              <SelectTrigger className={cn(isMissing("heatingType") && missingFieldClass)}>
                <SelectValue placeholder="Select heating type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="furnace">Furnace</SelectItem>
                <SelectItem value="boiler">Boiler</SelectItem>
                <SelectItem value="heat-pump">Heat Pump</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <WarningButton warningId="mechanical-equipment-docs-9365" title="⚠️ Mechanical Equipment Documentation">
              <div className="text-xs space-y-2">
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
                  <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">
                    More information
                  </a>
                </div>
              </div>
            </WarningButton>
          </div>

          {selections.heatingType && <div id="heatingEfficiency" className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {selections.heatingType === 'furnace' ? 'Furnace' : selections.heatingType === 'boiler' ? 'Boiler' : selections.heatingType === 'heat-pump' ? 'Heat Pump' : 'Heating Efficiency'}
            </label>
            <Input type="text"
              placeholder={selections.heatingType === 'furnace' ? "Enter Furnace Make/Model" : selections.heatingType === 'boiler' ? "Enter Boiler Make/Model" : selections.heatingType === 'heat-pump' ? "Enter Heat Pump Make/Model" : "Enter heating equipment make/model"}
              value={selections.heatingEfficiency}
              onChange={e => setSelections(prev => ({
                ...prev,
                heatingEfficiency: e.target.value
              }))}
              className={cn(isMissing("heatingEfficiency") && missingFieldClass)}
            />
          </div>}

          {selections.heatingType === 'boiler' && <div className="space-y-4">
            <div id="indirectTank" className="space-y-2">
              <label className="text-sm font-medium text-foreground">Are you installing an indirect tank?</label>
              <Select value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                ...prev,
                indirectTank: value,
                indirectTankSize: value === 'no' ? '' : prev.indirectTankSize,
              }))}>
                <SelectTrigger className={cn(isMissing("indirectTank") && missingFieldClass)}>
                  <SelectValue placeholder="Select if installing indirect tank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selections.indirectTank === 'yes' && <div id="indirectTankSize" className="space-y-2">
              <label className="text-sm font-medium text-foreground">Indirect tank size (gallons)</label>
              <Input type="number"
                placeholder="Enter tank size in gallons"
                value={selections.indirectTankSize}
                onChange={e => setSelections(prev => ({
                  ...prev,
                  indirectTankSize: e.target.value
                }))}
                className={cn(isMissing("indirectTankSize") && missingFieldClass)}
              />
            </div>}
          </div>}

          <div id="coolingApplicable" className="space-y-2">
            <label className="text-sm font-medium text-foreground">Are you installing cooling/air conditioning?</label>
            <Select value={selections.coolingApplicable} onValueChange={value => setSelections(prev => ({
              ...prev,
              coolingApplicable: value,
              coolingMakeModel: value === 'no' ? '' : prev.coolingMakeModel,
              coolingEfficiency: value === 'no' ? '' : prev.coolingEfficiency,
            }))}>
              <SelectTrigger className={cn(isMissing("coolingApplicable") && missingFieldClass)}>
                <SelectValue placeholder="Select if cooling is applicable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selections.coolingApplicable === "yes" && <div className="space-y-4">
            <div id="coolingMakeModel" className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cooling System Make/Model</label>
              <Input type="text"
                value={selections.coolingMakeModel}
                onChange={e => setSelections(prev => ({
                  ...prev,
                  coolingMakeModel: e.target.value
                }))}
                placeholder="Enter cooling system make and model"
                className={cn(isMissing("coolingMakeModel") && missingFieldClass)}
              />
            </div>
            <div id="coolingEfficiency" className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cooling System Efficiency</label>
              <Input
                type="text"
                placeholder="Enter SEER (min 14.5) or SEER2 (min 14.3) value"
                value={selections.coolingEfficiency}
                onChange={e => setSelections(prev => ({
                  ...prev,
                  coolingEfficiency: e.target.value
                }))}
                className={cn(isMissing("coolingEfficiency") && missingFieldClass)}
              />
            </div>
          </div>}

          {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <>
            <div id="waterHeaterType" className="space-y-2">
              <label className="text-sm font-medium text-foreground">Water Heater Type</label>
              <Select value={selections.waterHeaterType} onValueChange={value => setSelections(prev => ({
                ...prev,
                waterHeaterType: value
              }))}>
                <SelectTrigger className={cn(isMissing("waterHeaterType") && missingFieldClass)}>
                  <SelectValue placeholder="Select water heater type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div id="waterHeater" className="space-y-2">
              <label className="text-sm font-medium text-foreground">Water Heater</label>
              <Input type="text"
                placeholder="Enter Water Heater Make/Model"
                value={selections.waterHeater}
                onChange={e => setSelections(prev => ({
                  ...prev,
                  waterHeater: e.target.value
                }))}
                className={cn(isMissing("waterHeater") && missingFieldClass)}
              />
            </div>
          </>}

          <div id="hasDWHR" className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-foreground">Is a drain water heat recovery system being installed?</label>
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
            <Select value={selections.hasDWHR} onValueChange={value => setSelections(prev => ({
              ...prev,
              hasDWHR: value
            }))}>
              <SelectTrigger className={cn(isMissing("hasDWHR") && missingFieldClass)}>
                <SelectValue placeholder="Select yes or no" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-6 border-slate-200 dark:border-slate-700 space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">HRV/ERV Information</h3>
            <div id="hasHrv" className="space-y-2">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground">Does this building include an HRV or ERV?</label>
                <InfoButton title="Should I include an HRV (Heat Recovery Ventilator)?">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-base mb-2">Should I include an HRV (Heat Recovery Ventilator)?</h4>
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
              <Select value={selections.hasHrv} onValueChange={value => setSelections(prev => ({
                ...prev,
                hasHrv: value,
                hrvEfficiency: value === 'without_hrv' ? '' : prev.hrvEfficiency,
                hasSecondaryHrv: value === 'without_hrv' ? '' : prev.hasSecondaryHrv,
                secondaryHrvEfficiency: value === 'without_hrv' ? '' : prev.secondaryHrvEfficiency,
              }))}>
                <SelectTrigger className={cn(isMissing("hasHrv") && missingFieldClass)}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="with_hrv">Yes - with HRV/ERV</SelectItem>
                  <SelectItem value="without_hrv">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selections.hasHrv === "with_hrv" && <div id="hrvEfficiency" className="space-y-2">
              <label className="text-sm font-medium text-foreground">HRV/ERV Make/Model</label>
              <Input type="text"
                placeholder="Input HRV/ERV make/model (e.g. Fantech SHR 1504)"
                value={selections.hrvEfficiency || ""}
                onChange={e => setSelections(prev => ({
                  ...prev,
                  hrvEfficiency: e.target.value
                }))}
                className={cn(isMissing("hrvEfficiency") && missingFieldClass)}
              />
            </div>}

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
                  <SelectTrigger className={cn(isMissing("hasSecondaryHrv") && missingFieldClass)}>
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
                <Input type="text"
                  placeholder="Input secondary HRV/ERV make/model"
                  value={selections.secondaryHrvEfficiency || ""}
                  onChange={e => setSelections(prev => ({
                    ...prev,
                    secondaryHrvEfficiency: e.target.value
                  }))}
                  className={cn(isMissing("secondaryHrvEfficiency") && missingFieldClass)}
                />
              </div>}
            </div>}

            {/* MURB/Secondary Suite Mechanical Systems Warning */}
            {(selections.buildingType === "multi-unit" || selections.buildingType === "single-detached-secondary") && <div className="p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500/50 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 text-lg">⚠️</span>
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-800 dark:text-orange-300">MURB/Secondary Suite Mechanical Systems</h4>
                  <p className="text-base text-orange-700 dark:text-orange-300">
                    For {selections.buildingType === "multi-unit" ? "multi-unit residential buildings (MURBs)" : "homes with secondary suites"},
                    please ensure you list all mechanical system types, make/models, and any other relevant information
                    in the comments section below. This includes:
                  </p>
                  <ul className="list-disc ml-4 text-base text-orange-700 dark:text-orange-300 space-y-1">
                    <li>Secondary heating system type and make/model (if applicable)</li>
                    <li>Secondary/multiple service water heating systems</li>
                    <li>Secondary HRV/ERV systems</li>
                    <li>Any additional heating equipment specifications</li>
                    <li>Special installation requirements or configurations</li>
                    <li>Zone-specific heating arrangements</li>
                  </ul>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}