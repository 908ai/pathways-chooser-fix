import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap } from "lucide-react";
import InfoButton from "@/components/InfoButton";

import { getPathwayDisplayName } from "../utils/helpers";


type Props = {
  selections: any;
  setSelections: React.Dispatch<React.SetStateAction<any>>;
  onPathwayChange?: (pathwayInfo: string) => void;
};

export default function CompliancePathSection({
  selections,
  setSelections,
  onPathwayChange,
}: Props) {

  return (
    <>
      {
                <Card className="bg-slate-700/40">
                   <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        Compliance Path Selection
                      </CardTitle>
                      <CardDescription className="text-slate-200">
                        Choose the compliance pathway for your project. This is a critical decision that affects all subsequent steps.
                      </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     {/* Compliance Path Selection */}
                       <div className="space-y-4">
                         {(!selections.buildingType || (selections.province === "alberta" && !selections.climateZone)) && <div className="p-4 bg-purple-50/80 border border-purple-300/50 rounded-md backdrop-blur-sm">
                              <p className="text-sm text-purple-300 font-medium drop-shadow-sm">
                                Please complete the Project Information step to continue.
                             </p>
                           </div>}
                         
                         {selections.buildingType && (selections.province !== "alberta" || selections.climateZone) && <>
                         <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-white">Which compliance path are you using?</label>
                            <InfoButton
                              title="NBC Part 9 Energy Compliance – Simple Overview"
                              size="large"
                              className="animate-glow-pulse rounded-full border-2 border-primary"
                            >
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      The National Building Code of Canada (NBC) offers four main pathways to show your building meets energy efficiency requirements:
                                    </p>
                                    <div className="w-full h-px bg-muted mb-3" />
                                  </div>
                                  
                                   <div className="space-y-4">
                                     <div>
                                        <h5 className="font-medium text-sm mb-1">1. NBC 2020 9.36.2 – 9.36.4: Base Prescriptive Path</h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>This is the standard, minimum compliance route.</p>
                                          <p>You meet fixed insulation (RSI) values and HVAC/water heating system requirements — no energy modelling or points system required.</p>
                                          <p>An HRV is optional but influences which RSI values you must meet. No HRV means higher RSI requirements for your walls, foundation and attic.</p>
                                          <p className="bg-muted rounded-md p-3">⚠️ Warning: This path may lead to higher build costs due to limited flexibility. Assemblies must meet strict minimums without trade-offs, which can increase material and labour costs.</p>
                                          <p className="mt-2">
                                            <strong>Trade-off Option (9.36.2.11):</strong> 🔗 <a href="https://www.calgary.ca/content/dam/www/pda/pd/documents/building/green/9.36-trade-off-report.xlsm" download className="text-blue-500 underline hover:text-red-600">
                                              Download Trade-off Calculator
                                            </a> - Allows flexibility to balance R-values between building components.
                                          </p>
                                        </div>
                                       <div className="w-full h-px bg-muted mt-3" />
                                     </div>

                                     <div>
                                       <h5 className="font-medium text-sm mb-1">2. NBC 9.36.5 – Performance Modelling (Most builders choose this path)</h5>
                                       <div className="text-sm text-muted-foreground space-y-1">
                                         <p>Your design is modelled against a "reference house" which is the exact same house physically that you intend to build, but with all the specifications that meet minimum prescriptive requirements. If your house performs as well or better, it passes.</p>
                                         <p>✅ This path is now the minimum requirement in many jurisdictions for basic code compliance.</p>
                                         <p>✅ Estimated savings* of up to $5,000 are possible on a 2,000 sq ft detached home, even when aiming for Tier 2, thanks to flexible trade-offs (e.g., using R20 walls instead of R24 with better airtightness). <small><i>*Actual savings may vary depending on local pricing and builder practices.</i></small></p>
                                         
                                         <p>✅ More information: 🔗 <a href="https://solinvictusenergyservices.com/energy-hack" download className="text-blue-500 underline hover:text-red-600">Energy Code Hack</a></p>
                                         <p className="font-medium mt-2">Benefits:</p>
                                         <div className="ml-2 space-y-1">
                                           <p>• Greater design flexibility (e.g., trade-offs between walls, windows, or systems)</p>
                                           <p>• Supports custom, non-standard, or cost-optimized assemblies</p>
                                           <p>• Allows for right-sized HVAC and reduced mechanical oversizing which can save you money</p>
                                           <p>• Helps optimize comfort and efficiency before construction</p>
                                           <p>• Ideal for developers, volume builders, and custom home projects</p>
                                         </div>
                                       </div>
                                       <div className="w-full h-px bg-muted mt-3" />
                                     </div>

                                      <div>
                                        <h5 className="font-medium text-sm mb-1">3. NBC 9.36.7 – Tiered Performance Path <span className="inline-block ml-2 px-2 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold rounded">(Tier 2-5)</span></h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>An extension of the 9.36.5 performance method that targets higher energy performance tiers (Tier 2 and above).</p>
                                          <p>Requires modelling reductions in energy use, heat loss, and peak cooling.</p>
                                          <p className="font-medium mt-2">Benefits:</p>
                                          <div className="ml-2 space-y-1">
                                            <p>• Test multiple upgrade combinations to meet Tier goals affordably</p>
                                            <p>• Unlock access to incentive programs and energy labelling (e.g., CHBA Net Zero, Sask Power Beyond Code rebates)</p>
                                            <p>• More accurate energy predictions and long-term savings</p>
                                            <p>• Freedom to choose how energy performance is achieved (e.g., envelope upgrades vs. mechanical systems)</p>
                                          </div>
                                          <p className="mt-2"><strong>Note:</strong> HRVs are not required, but typically included to meet Tier thresholds effectively.</p>
                                        </div>
                                        <div className="w-full h-px bg-muted mt-3" />
                                      </div>

                                      <div>
                                        <h5 className="font-medium text-sm mb-1">4. NBC 9.36.8 – Tiered Prescriptive Path <span className="inline-block ml-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded">(Tier 2-5)</span></h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>This is a points-based route to meet Tier 2 and above without energy modelling.</p>
                                          <p>Points are earned for upgrades to insulation, windows, airtightness, HVAC, and more.</p>
                                          <p>An HRV or ERV is mandatory — without it, you cannot use this path.</p>
                                          <p className="bg-muted rounded-md p-3">⚠️ Warning: May increase build costs due to rigid performance targets. Some flexibility for trade-offs with additional calculations required, otherwise every element must meet its specific upgrade requirement to claim points.</p>
                                        </div>
                                        <div className="w-full h-px bg-muted mt-3" />
                                      </div>
                                   </div>

                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                    <p className="text-sm font-medium mb-1">In summary:</p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <p>• Use 9.36.2 for minimum code compliance with standard assemblies (least flexible).</p>
                                      <p>• Use 9.36.5 for the most flexibility, lower costs, and now the most common path to Tier 1 compliance.</p>
                                      <p>• Use 9.36.7 if you're aiming for Tier 2+ using simulation and want more control over your design.</p>
                                      <p>• Use 9.36.8 if you prefer a checklist/points-based approach to Tier compliance and are committed to installing an HRV.</p>
                                    </div>
                                  </div>
                            </InfoButton>
                          </div>
                          
                          {/* Current pathway display */}
                          {selections.compliancePath && <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 shadow-sm">
                              {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? <div className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
                                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-lg">PRESCRIPTIVE PATH SELECTED</div>
                                    <div className="text-sm opacity-80">Following checklist-based requirements</div>
                                  </div>
                                </div> : <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Zap className="h-5 w-5" />
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-lg">PERFORMANCE PATH SELECTED</div>
                                    <div className="text-sm opacity-80">Using energy modeling and simulation</div>
                                  </div>
                                </div>}
                            </div>}
                          
                           <Select value={selections.compliancePath} onValueChange={value => {
                          setSelections(prev => ({
                            ...prev,
                            compliancePath: value,
                            // Reset only technical selections when compliance path changes (preserve personal info)
                            frontDoorOrientation: "",
                            hasHrv: "",
                            isVolumeOver380: "",
                            buildingVolume: "",
                            ceilingsAtticRSI: "",
                            hasCathedralOrFlatRoof: "",
                            cathedralFlatRSI: "",
                            wallRSI: "",
                            floorsUnheatedRSI: "",
                            floorsGarageRSI: "",
                            hasSkylights: "",
                            skylightUValue: "",
                            hasSlabOnGrade: "",
                            hasInFloorHeat: "",
                            floorsSlabsSelected: [],
                            foundationWallsRSI: "",
                            slabOnGradeRSI: "",
                            slabOnGradeIntegralFootingRSI: "",
                            floorsOverUnheatedSpacesRSI: "",
                            unheatedFloorBelowFrostRSI: "",
                            unheatedFloorAboveFrostRSI: "",
                            heatedFloorsRSI: "",
                            windowUValue: "",
                            belowGradeRSI: "",
                            airtightness: "",
                            atticRSI: "",
                            hrv: "",
                            hasSecondaryHrv: "",
                            secondaryHrvEfficiency: "",
                            hasSecondaryHeating: "",
                            secondaryHeatingType: "",
                            secondaryHeatingEfficiency: "",
                            secondaryIndirectTank: "",
                            secondaryIndirectTankSize: "",
                            hasMurbMultipleHeating: "",
                            murbSecondHeatingType: "",
                            murbSecondHeatingEfficiency: "",
                            murbSecondIndirectTank: "",
                            murbSecondIndirectTankSize: "",
                            waterHeater: "",
                            waterHeaterType: "",
                            hasSecondaryWaterHeater: "",
                            secondaryWaterHeaterSameAsMain: "",
                            secondaryWaterHeater: "",
                            secondaryWaterHeaterType: "",
                            hasMurbMultipleWaterHeaters: "",
                            murbSecondWaterHeater: "",
                            murbSecondWaterHeaterType: "",
                            hasDWHR: ""
                          }));
                          onPathwayChange?.(getPathwayDisplayName(value));
                        }}>
                           <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                             <SelectValue placeholder="Select compliance path" />
                           </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="9365" className="border-l-4 border-l-blue-500">
                                    <div className="flex items-center gap-2">
                                      <Zap className="h-4 w-4 text-blue-600" />
                                      <span>9.36.5 - <strong>Performance</strong> Path</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9362" className="border-l-4 border-l-orange-500">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-orange-600" />
                                      <span>9.36.2 - 9.36.4 <strong>Prescriptive</strong> Path</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9367" className="border-l-4 border-l-blue-500">
                                    <div className="flex items-center gap-2">
                                      <Zap className="h-4 w-4 text-blue-600" />
                                      <span>9.36.7 - Tiered <strong>Performance</strong> Path <span className="font-bold text-emerald-600">(Tier 2-5)</span></span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9368" className="border-l-4 border-l-orange-500">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-orange-600" />
                                      <span>9.36.8 – Tiered <strong>Prescriptive</strong> Path <span className="font-bold text-purple-300">(Tier 2-5)</span></span>
                                    </div>
                                  </SelectItem>
                                 </SelectContent>
                           </Select>
                         </div>
                        
                         {/* Front Door Orientation for Performance Paths */}
                         {(selections.compliancePath === "9365" ||
                          selections.compliancePath === "9367") && <div className="space-y-2">
                             <div className="flex items-center gap-2">
                               <label className="text-sm font-medium text-white">Front Door Orientation</label>
                                  <InfoButton title="Why Orientation Matters in Energy Efficiency">
                                      <div className="space-y-4">
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Peak Cooling Loads:</h5>
                                          <p className="text-sm text-muted-foreground">Orientation impacts solar gains throughout the year. In summer and shoulder seasons, limiting solar gain helps prevent overheating—an explicit requirement of the Tiered Energy Codes. In winter, optimizing solar gain helps reduce heating loads, improving performance without sacrificing comfort.</p>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Optimizes Performance Modelling:</h5>
                                          <p className="text-sm text-muted-foreground">Strategic solar design can earn "bonus points" in energy models by reducing heating demand—advantages not available in the prescriptive path.</p>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Glazing Area Impacts Compliance:</h5>
                                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            <li>Reference house assume a 17–22% window-to-wall ratio.</li>
                                            <li>Homes with less glazing than the reference benefit from reduced heat loss and can earn additional performance credits.</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Supports Higher Tier Compliance:</h5>
                                          <p className="text-sm text-muted-foreground">Smart orientation and glazing design are low-cost, high-impact strategies that improve energy performance and help meet Tier 1, Tier 2, or Net Zero Ready targets.</p>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Additional Benefits:</h5>
                                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            {/* <li>Smart solar gain strategies can earn "bonus points" by offsetting heating loads in the energy model.</li> */}
                                            {/* <li>Designs with less glazing than the reference earn performance credits due to reduced heat loss.</li> */}
                                            <li>Orientation and glazing strategies are low-cost design choices that help meet Tier 1, Tier 2, or even Net Zero Ready targets more easily.</li>
                                          </ul>
                                        </div>
                                      </div>
                                   </InfoButton>
                             </div>
                            <Select value={selections.frontDoorOrientation} onValueChange={value => setSelections(prev => ({
                          ...prev,
                          frontDoorOrientation: value
                        }))}>
                              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                                <SelectValue placeholder="Select orientation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="N">North (N)</SelectItem>
                                <SelectItem value="NE">Northeast (NE)</SelectItem>
                                <SelectItem value="E">East (E)</SelectItem>
                                <SelectItem value="SE">Southeast (SE)</SelectItem>
                                <SelectItem value="S">South (S)</SelectItem>
                                <SelectItem value="SW">Southwest (SW)</SelectItem>
                                <SelectItem value="W">West (W)</SelectItem>
                                <SelectItem value="NW">Northwest (NW)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>}
                         </>}
                      </div>
                   </CardContent>
                </Card>        
      }
    </>
  );
}