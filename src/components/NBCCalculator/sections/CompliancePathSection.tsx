import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info, FileText, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { getPathwayDisplayName, isSingleDetached } from "../utils/helpers";


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
                <Card>
                   <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        Compliance Path Selection
                      </CardTitle>
                      <CardDescription>
                        Choose the compliance pathway for your project. This is a critical decision that affects all subsequent steps.
                      </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                       <div className="space-y-4">
                         {(!selections.buildingType || (selections.province === "alberta" && !selections.climateZone)) && <div className="p-4 bg-secondary border rounded-md">
                              <p className="text-sm text-secondary-foreground font-medium">
                                Please complete the Project Information step to continue.
                             </p>
                           </div>}
                         
                         {selections.buildingType && (selections.province !== "alberta" || selections.climateZone) && <>
                         <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium">Which compliance path are you using?</label>
                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
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
                                  <DialogTitle>NBC Part 9 Energy Compliance – Simple Overview</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">NBC Part 9 Energy Compliance – Simple Overview</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      The National Building Code of Canada (NBC) offers four main pathways to show your building meets energy efficiency requirements:
                                    </p>
                                    <div className="w-full h-px bg-border mb-3" />
                                  </div>
                                  
                                   <div className="space-y-4">
                                     <div>
                                        <h5 className="font-medium text-sm mb-1">1. NBC 2020 9.36.2 – 9.36.4: Base Prescriptive Path</h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>This is the standard, minimum compliance route.</p>
                                          <p>You meet fixed insulation (RSI) values and HVAC/water heating system requirements — no energy modelling or points system required.</p>
                                          <p>An HRV is optional but influences which RSI values you must meet. No HRV means higher RSI requirements for your walls, foundation and attic.</p>
                                          <p className="text-warning-foreground">⚠️ Warning: This path may lead to higher build costs due to limited flexibility. Assemblies must meet strict minimums without trade-offs, which can increase material and labour costs.</p>
                                          <p className="mt-2">
                                            <strong>Trade-off Option (9.36.2.11):</strong> <a href="/reference/calgary-trade-off-calculator.xlsm" download className="text-success underline hover:text-success/80">
                                              Download Trade-off Calculator
                                            </a> - Allows flexibility to balance R-values between building components.
                                          </p>
                                        </div>
                                       <div className="w-full h-px bg-border mt-3" />
                                     </div>

                                     <div>
                                       <h5 className="font-medium text-sm mb-1">2. NBC 9.36.5 – Performance Modelling (Most builders choose this path)</h5>
                                       <div className="text-sm text-muted-foreground space-y-1">
                                         <p>Your design is modelled against a "reference house" which is the exact same house physically that you intend to build, but with all the specifications that meet minimum prescriptive requirements. If your house performs as well or better, it passes.</p>
                                         <p>✅ This path is now the minimum requirement in many jurisdictions for basic code compliance.</p>
                                         <p>✅ Estimated savings of up to $6,000 are possible on a 2,000 sq ft detached home, even when aiming for Tier 2, thanks to flexible trade-offs (e.g., using R20 walls instead of R24 with better airtightness).</p>
                                         <p>✅ More information: solinvictusenergyservices.com/energy-hack</p>
                                         <p className="font-medium mt-2">Benefits:</p>
                                         <div className="ml-2 space-y-1">
                                           <p>• Greater design flexibility (e.g., trade-offs between walls, windows, or systems)</p>
                                           <p>• Supports custom, non-standard, or cost-optimized assemblies</p>
                                           <p>• Allows for right-sized HVAC and reduced mechanical oversizing which can save you money</p>
                                           <p>• Helps optimize comfort and efficiency before construction</p>
                                           <p>• Ideal for developers, volume builders, and custom home projects</p>
                                         </div>
                                       </div>
                                       <div className="w-full h-px bg-border mt-3" />
                                     </div>

                                      <div>
                                        <h5 className="font-medium text-sm mb-1">3. NBC 9.36.7 – Tiered Performance Path <Badge variant="secondary" className="text-xs">Tier 2-5</Badge></h5>
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
                                        <div className="w-full h-px bg-border mt-3" />
                                      </div>

                                      <div>
                                        <h5 className="font-medium text-sm mb-1">4. NBC 9.36.8 – Tiered Prescriptive Path <Badge variant="secondary" className="text-xs">Tier 2-5</Badge></h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>This is a points-based route to meet Tier 2 and above without energy modelling.</p>
                                          <p>Points are earned for upgrades to insulation, windows, airtightness, HVAC, and more.</p>
                                          <p>An HRV or ERV is mandatory — without it, you cannot use this path.</p>
                                          <p className="text-warning-foreground">⚠️ Warning: May increase build costs due to rigid performance targets. Some flexibility for trade-offs with additional calculations required, otherwise every element must meet its specific upgrade requirement to claim points.</p>
                                        </div>
                                        <div className="w-full h-px bg-border mt-3" />
                                      </div>
                                   </div>

                                  <div className="p-3 bg-secondary rounded-md">
                                    <p className="text-sm font-medium mb-1">In summary:</p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <p>• Use 9.36.2 for minimum code compliance with standard assemblies (least flexible).</p>
                                      <p>• Use 9.36.5 for the most flexibility, lower costs, and now the most common path to Tier 1 compliance.</p>
                                      <p>• Use 9.36.7 if you're aiming for Tier 2+ using simulation and want more control over your design.</p>
                                      <p>• Use 9.36.8 if you prefer a checklist/points-based approach to Tier compliance and are committed to installing an HRV.</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          {selections.compliancePath && <div className="flex items-center justify-center gap-2 p-4 bg-secondary rounded-lg border-2 border-dashed border-border shadow-sm">
                              {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? <div className="flex items-center gap-3 text-primary">
                                  <div className="p-2 bg-primary/10 rounded-full">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-lg">PRESCRIPTIVE PATH SELECTED</div>
                                    <div className="text-sm text-muted-foreground">Following checklist-based requirements</div>
                                  </div>
                                </div> : <div className="flex items-center gap-3 text-blue-500">
                                  <div className="p-2 bg-blue-500/10 rounded-full">
                                    <Zap className="h-5 w-5" />
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-lg">PERFORMANCE PATH SELECTED</div>
                                    <div className="text-sm text-muted-foreground">Using energy modeling and simulation</div>
                                  </div>
                                </div>}
                            </div>}
                          
                           <Select value={selections.compliancePath} onValueChange={value => {
                          setSelections(prev => ({
                            ...prev,
                            compliancePath: value,
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
                           <SelectTrigger>
                             <SelectValue placeholder="Select compliance path" />
                           </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="9365" className="border-l-4 border-l-blue-500">
                                    <div className="flex items-center gap-2">
                                      <Zap className="h-4 w-4 text-blue-500" />
                                      <span>9.36.5 - <strong>Performance</strong> Path</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9362" className="border-l-4 border-l-primary">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-primary" />
                                      <span>9.36.2 - 9.36.4 <strong>Prescriptive</strong> Path</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9367" className="border-l-4 border-l-blue-500">
                                    <div className="flex items-center gap-2">
                                      <Zap className="h-4 w-4 text-blue-500" />
                                      <span>9.36.7 - Tiered <strong>Performance</strong> Path <Badge variant="secondary">Tier 2-5</Badge></span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9368" className="border-l-4 border-l-primary">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-primary" />
                                      <span>9.36.8 – Tiered <strong>Prescriptive</strong> Path <Badge variant="secondary">Tier 2-5</Badge></span>
                                    </div>
                                  </SelectItem>
                                 </SelectContent>
                           </Select>
                         </div>
                        
                         {(selections.compliancePath === "9365" || selections.compliancePath === "9367") && <div className="space-y-2">
                             <div className="flex items-center gap-2">
                               <label className="text-sm font-medium">Front Door Orientation</label>
                                  <Dialog>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
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
                                       <DialogTitle>Why Orientation Matters in Energy Efficiency</DialogTitle>
                                     </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-semibold text-sm mb-2">Why Orientation Matters in Energy Efficiency</h4>
                                      </div>
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
                                            <li>Reference houses assume a 17–22% window-to-wall ratio.</li>
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
                                            <li>Smart solar gain strategies can earn "bonus points" by offsetting heating loads in the energy model.</li>
                                            <li>Designs with less glazing than the reference earn performance credits due to reduced heat loss.</li>
                                            <li>Orientation and glazing strategies are low-cost design choices that help meet Tier 1, Tier 2, or even Net Zero Ready targets more easily.</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                   </DialogContent>
                                 </Dialog>
                             </div>
                            <Select value={selections.frontDoorOrientation} onValueChange={value => setSelections(prev => ({
                          ...prev,
                          frontDoorOrientation: value
                        }))}>
                              <SelectTrigger>
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