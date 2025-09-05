import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info, FileText, Zap, X } from "lucide-react";
import FileUpload from "@/components/FileUpload";

import { getPathwayDisplayName, isSingleDetached } from "../utils/helpers";


type Props = {
  selections: any;
  setSelections: React.Dispatch<React.SetStateAction<any>>;
  uploadedFiles: (File & { url?: string; path?: string })[];
  handleFileUploaded: (fileData: { name: string; url: string; size: number; type: string; path?: string }) => void;
  removeFile: (index: number) => void;
  onPathwayChange?: (pathwayInfo: string) => void;
  projectId: string | null;
};

export default function ProjectInformationSection({
  selections,
  setSelections,
  uploadedFiles,
  handleFileUploaded,
  removeFile,
  onPathwayChange,
  projectId,
}: Props) {

  // ✅ alias para manter o nome usado no bloco colado
  const onFileUploaded = handleFileUploaded;

  return (
    <>
      {
                <Card className="bg-gradient-to-r from-slate-700/40 to-teal-700/40 border-slate-400/50 backdrop-blur-sm shadow-lg">
                   <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        📋 Project Information
                        {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? <Badge variant="outline" className="ml-2 border-orange-400 text-orange-300 bg-orange-900/30">
                            Prescriptive Path
                          </Badge> : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? <Badge variant="outline" className="ml-2 border-blue-400 text-blue-300 bg-blue-900/30">
                            Performance Path
                          </Badge> : null}
                      </CardTitle>
                      <CardDescription className="text-slate-200">
                        Personal details, building location, and compliance path selection
                      </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     {/* Personal/Contact Information */}
                     <div className="space-y-4">
                       <h4 className="text-md font-medium text-white border-b pb-2">Personal & Contact Information <span className="text-red-500">(Required)</span></h4>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-sm font-medium">First Name</label>
                           <Input type="text" placeholder="Enter first name" value={selections.firstName} onChange={e => setSelections(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))} />
                         </div>
                         
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Last Name</label>
                           <Input type="text" placeholder="Enter last name" value={selections.lastName} onChange={e => setSelections(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))} />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Company</label>
                           <Input type="text" placeholder="Enter company name" value={selections.company} onChange={e => setSelections(prev => ({
                          ...prev,
                          company: e.target.value
                        }))} />
                         </div>

                         <div className="space-y-2">
                           <label className="text-sm font-medium">Phone Number</label>
                           <Input type="tel" placeholder="Enter phone number" value={selections.phoneNumber} onChange={e => setSelections(prev => ({
                          ...prev,
                          phoneNumber: e.target.value
                        }))} />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-sm font-medium">Company Address</label>
                         <Input type="text" placeholder="Enter company address" value={selections.companyAddress} onChange={e => setSelections(prev => ({
                        ...prev,
                        companyAddress: e.target.value
                      }))} />
                       </div>
                     </div>

                     {/* Building & Location Information */}
                     <div className="space-y-4">
                       <h4 className="text-md font-medium text-white border-b pb-2">Building & Location Details <span className="text-red-500">(Required)</span></h4>

                       {/* Upload Building Plans */}
                        <div className="space-y-2 p-4 bg-red-50/50 border border-red-200 rounded-lg">
                          <label className="text-sm font-medium">Building Plans & Documents</label>
                          <div className="space-y-2">
                            <FileUpload
                              onFileUploaded={handleFileUploaded}
                              projectId={projectId}
                              maxFiles={10}
                              acceptedTypes={['pdf', 'dwg', 'jpg', 'jpeg', 'png', 'tiff', 'doc', 'docx', 'xls', 'xlsx', 'txt']}
                              maxSizePerFile={10 * 1024 * 1024}
                            />
                            {uploadedFiles.length > 0 && <div className="space-y-2">
                                <div className="flex items-center gap-2 text-green-600">
                                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium">{uploadedFiles.length} file(s) uploaded successfully</span>
                                </div>
                                <div className="space-y-1">
                                  {uploadedFiles.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-emerald-50/80 border border-emerald-300/50 rounded-md backdrop-blur-sm">
                                       <span className="text-sm truncate text-emerald-900">{file.name}</span>
                                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0 text-green-600 hover:text-red-600">
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>)}
                                </div>
                              </div>}
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-sm font-medium">Building/Project Address</label>
                         <Input type="text" placeholder="Enter building/project address" value={selections.buildingAddress} onChange={e => setSelections(prev => ({
                        ...prev,
                        buildingAddress: e.target.value
                      }))} />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Building Type</label>
                          <Select value={selections.buildingType} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        buildingType: value
                      }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select building type" />
                            </SelectTrigger>
                             <SelectContent className="bg-background border shadow-lg z-50">
                               <SelectItem value="single-detached">Single-detached home</SelectItem>
                               <SelectItem value="single-detached-secondary">Single-detached home with a secondary suite</SelectItem>
                               <SelectItem value="multi-unit">Multi-Unit Residential Building or Town/Row-House</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Province</label>
                            <Select value={selections.province} onValueChange={value => {
                          setSelections(prev => ({
                            ...prev,
                            province: value,
                            // Reset technical selections when province changes
                            compliancePath: "",
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
                        }}>
                             <SelectTrigger>
                               <SelectValue placeholder="Select your province" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
                               <SelectItem value="alberta">Alberta</SelectItem>
                             </SelectContent>
                           </Select>
                          </div>

                           {/* Climate Zone Selection for Alberta */}
                           {selections.province === "alberta" && <div className="space-y-2">
                               <div className="flex items-center gap-2">
                                 <label className="text-sm font-medium">Climate Zone <span className="text-red-500">*</span></label>
                                 <Dialog>
                                   <DialogTrigger asChild>
                                     <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                       <Info className="h-3 w-3 mr-1" />
                                       More info
                                     </Button>
                                   </DialogTrigger>
                                   <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                     <DialogHeader>
                                       <DialogTitle>Climate Zone Information</DialogTitle>
                                     </DialogHeader>
                                     <div className="space-y-4">
                                       <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                         <h4 className="font-semibold text-green-800 mb-2">Saskatchewan</h4>
                                         <p className="text-green-700">All of Saskatchewan is in Climate Zone 7A (5000 to 5999 HDD)</p>
                                       </div>
                                       
                                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                         <h4 className="font-semibold text-blue-800 mb-2">Alberta Climate Zones</h4>
                                         <img src="/lovable-uploads/9b289384-01b6-4f5f-a713-ddcae27167db.png" alt="Climate Zone Map for Alberta showing Zone 6, 7A, 7B, and 8 with corresponding cities and HDD ranges" className="w-full h-auto rounded-lg border border-gray-200" />
                                         <div className="mt-4 text-xs text-blue-600">
                                           <p><strong>HDD:</strong> Heating Degree Days - a measure of how much (in degrees), and for how long (in days), the outside air temperature was below a certain level.</p>
                                         </div>
                                       </div>
                                     </div>
                                   </DialogContent>
                                 </Dialog>
                               </div>
                              <Select value={selections.climateZone} onValueChange={value => setSelections(prev => ({
                          ...prev,
                          climateZone: value
                        }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select climate zone" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="7A">Zone 7A (6000+ HDD)</SelectItem>
                                  <SelectItem value="7B">Zone 7B (6000-6999 HDD)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>}

                          <div className="space-y-2">
                           <label className="text-sm font-medium">Occupancy Class</label>
                           <Input type="text" placeholder="C" value={selections.occupancyClass} onChange={e => setSelections(prev => ({
                          ...prev,
                          occupancyClass: e.target.value
                        }))} />
                         </div>
                       </div>
                     </div>

                      {/* Compliance Path Selection */}
                       <div className="space-y-4">
                         {(!selections.buildingType || selections.province === "alberta" && !selections.climateZone) && <div className="p-4 bg-purple-50/80 border border-purple-300/50 rounded-md backdrop-blur-sm">
                              <p className="text-sm text-purple-300 font-medium drop-shadow-sm">
                               {!selections.buildingType ? "Please select a building type above to continue with compliance path selection." : "Please select a climate zone above to continue with compliance path selection."}
                             </p>
                           </div>}
                         
                         {selections.buildingType && (selections.province !== "alberta" || selections.climateZone) && <h4 className="text-md font-medium text-foreground border-b pb-2">
                           Compliance Path for {isSingleDetached(selections.buildingType) ? "Single-Detached Home" : "Multi-Unit Residential Building"} <span className="text-red-500">(Required)</span>
                           {selections.province === "alberta" && selections.climateZone && <span className="text-sm font-normal text-muted-foreground ml-2">
                               (Climate Zone {selections.climateZone})
                             </span>}
                         </h4>}

                         {selections.buildingType && (selections.province !== "alberta" || selections.climateZone) && <>
                         <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium">Which compliance path are you using?</label>
                            <Dialog>
                              <DialogTrigger asChild>
                                 <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                  <Info className="h-3 w-3 mr-1" />
                                  More Info
                                </Button>
                              </DialogTrigger>
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
                                    <div className="w-full h-px bg-muted mb-3" />
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
                                            <strong>Trade-off Option (9.36.2.11):</strong> <a href="/reference/calgary-trade-off-calculator.xlsm" download className="text-emerald-300 underline hover:text-emerald-200">
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
                                          <p className="text-warning-foreground">⚠️ Warning: May increase build costs due to rigid performance targets. Some flexibility for trade-offs with additional calculations required, otherwise every element must meet its specific upgrade requirement to claim points.</p>
                                        </div>
                                        <div className="w-full h-px bg-muted mt-3" />
                                      </div>
                                   </div>

                                  <div className="p-3 bg-muted rounded-md">
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
                         {(selections.compliancePath === "9365" || selections.compliancePath === "9367") && <div className="space-y-2">
                             <div className="flex items-center gap-2">
                               <label className="text-sm font-medium">Front Door Orientation</label>
                                  <Dialog>
                                   <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                        <Info className="h-3 w-3 mr-1" />
                                        More Info
                                      </Button>
                                   </DialogTrigger>
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