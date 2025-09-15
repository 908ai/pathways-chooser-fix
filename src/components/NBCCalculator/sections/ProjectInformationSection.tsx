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
import { Info, FileText, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { getPathwayDisplayName, isSingleDetached } from "../utils/helpers";


type Props = {
  selections: any;
  setSelections: React.Dispatch<React.SetStateAction<any>>;
  validationErrors: Record<string, boolean>;
  onPathwayChange?: (pathwayInfo: string) => void;
};

export default function ProjectInformationSection({
  selections,
  setSelections,
  validationErrors,
  onPathwayChange,
}: Props) {

  return (
    <>
      {
                <Card>
                   <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        📋 Project Information
                        {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? <Badge variant="outline" className="ml-2 border-primary text-primary">
                            Prescriptive Path
                          </Badge> : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? <Badge variant="outline" className="ml-2 border-blue-400 text-blue-300 bg-blue-900/30">
                            Performance Path
                          </Badge> : null}
                      </CardTitle>
                      <CardDescription>
                        Personal details, building location, and compliance path selection
                      </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     <div className="space-y-4">
                       <h4 className="text-md font-medium border-b pb-2">Personal & Contact Information <span className="text-destructive">(Required)</span></h4>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-sm font-medium">First Name</label>
                           <Input type="text" placeholder="Enter first name" value={selections.firstName} onChange={e => setSelections(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))} className={cn(validationErrors.firstName && "border-destructive ring-2 ring-destructive")} />
                         </div>
                         
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Last Name</label>
                           <Input type="text" placeholder="Enter last name" value={selections.lastName} onChange={e => setSelections(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))} className={cn(validationErrors.lastName && "border-destructive ring-2 ring-destructive")} />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Company</label>
                           <Input type="text" placeholder="Enter company name" value={selections.company} onChange={e => setSelections(prev => ({
                          ...prev,
                          company: e.target.value
                        }))} className={cn(validationErrors.company && "border-destructive ring-2 ring-destructive")} />
                         </div>

                         <div className="space-y-2">
                           <label className="text-sm font-medium">Phone Number</label>
                           <Input type="tel" placeholder="Enter phone number" value={selections.phoneNumber} onChange={e => setSelections(prev => ({
                          ...prev,
                          phoneNumber: e.target.value
                        }))} className={cn(validationErrors.phoneNumber && "border-destructive ring-2 ring-destructive")} />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-sm font-medium">Company Address</label>
                         <Input type="text" placeholder="Enter company address" value={selections.companyAddress} onChange={e => setSelections(prev => ({
                        ...prev,
                        companyAddress: e.target.value
                      }))} className={cn(validationErrors.companyAddress && "border-destructive ring-2 ring-destructive")} />
                       </div>
                     </div>

                     <div className="space-y-4">
                       <h4 className="text-md font-medium border-b pb-2">Building & Location Details <span className="text-destructive">(Required)</span></h4>

                       <div className="space-y-2">
                         <label className="text-sm font-medium">Building/Project Address</label>
                         <Input type="text" placeholder="Enter building/project address" value={selections.buildingAddress} onChange={e => setSelections(prev => ({
                        ...prev,
                        buildingAddress: e.target.value
                      }))} className={cn(validationErrors.buildingAddress && "border-destructive ring-2 ring-destructive")} />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Building Type</label>
                          <Select value={selections.buildingType} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        buildingType: value
                      }))}>
                            <SelectTrigger className={cn(validationErrors.buildingType && "border-destructive ring-2 ring-destructive")}>
                              <SelectValue placeholder="Select building type" />
                            </SelectTrigger>
                             <SelectContent>
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
                             <SelectTrigger className={cn(validationErrors.province && "border-destructive ring-2 ring-destructive")}>
                               <SelectValue placeholder="Select your province" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
                               <SelectItem value="alberta">Alberta</SelectItem>
                             </SelectContent>
                           </Select>
                          </div>

                           {selections.province === "alberta" && <div className="space-y-2">
                               <div className="flex items-center gap-2">
                                 <label className="text-sm font-medium">Climate Zone <span className="text-destructive">*</span></label>
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
                                       <DialogTitle>Climate Zone Information</DialogTitle>
                                     </DialogHeader>
                                     <div className="space-y-4">
                                       <div className="bg-secondary border rounded-lg p-4">
                                         <h4 className="font-semibold text-secondary-foreground mb-2">Saskatchewan</h4>
                                         <p className="text-muted-foreground">All of Saskatchewan is in Climate Zone 7A (5000 to 5999 HDD)</p>
                                       </div>
                                       
                                       <div className="bg-secondary border rounded-lg p-4">
                                         <h4 className="font-semibold text-secondary-foreground mb-2">Alberta Climate Zones</h4>
                                         <img src="/lovable-uploads/9b289384-01b6-4f5f-a713-ddcae27167db.png" alt="Climate Zone Map for Alberta showing Zone 6, 7A, 7B, and 8 with corresponding cities and HDD ranges" className="w-full h-auto rounded-lg border" />
                                         <div className="mt-4 text-xs text-muted-foreground">
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
                                <SelectTrigger className={cn(validationErrors.climateZone && "border-destructive ring-2 ring-destructive")}>
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
                   </CardContent>
                </Card>        
      }
    </>
  );
}