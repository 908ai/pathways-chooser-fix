import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import InfoButton from "@/components/InfoButton";


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
}: Props) {

  return (
    <>
      {
        <Card className="bg-slate-700/40">
           {/* <CardHeader className="pb-4">
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
           </CardHeader> */}
           <CardContent className="space-y-6 pt-6">
             {/* Personal/Contact Information */}
             <div className="space-y-4">
               <h4 className="text-md font-medium text-white border-b border-slate-500 pb-2 tracking-wide">Personal & Contact Information <span className="text-red-400 font-semibold">(Required)</span></h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-100">First Name</label>
                   <Input type="text" placeholder="Enter first name" value={selections.firstName} onChange={e => setSelections(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.firstName && "border-red-500 ring-2 ring-red-500")} />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-100">Last Name</label>
                   <Input type="text" placeholder="Enter last name" value={selections.lastName} onChange={e => setSelections(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.lastName && "border-red-500 ring-2 ring-red-500")} />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-100">Company</label>
                   <Input type="text" placeholder="Enter company name" value={selections.company} onChange={e => setSelections(prev => ({
                  ...prev,
                  company: e.target.value
                }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.company && "border-red-500 ring-2 ring-red-500")} />
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-100">Phone Number</label>
                   <Input type="tel" placeholder="Enter phone number" value={selections.phoneNumber} onChange={e => setSelections(prev => ({
                  ...prev,
                  phoneNumber: e.target.value
                }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.phoneNumber && "border-red-500 ring-2 ring-red-500")} />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-100">Company Address</label>
                 <Input type="text" placeholder="Enter company address" value={selections.companyAddress} onChange={e => setSelections(prev => ({
                ...prev,
                companyAddress: e.target.value
              }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.companyAddress && "border-red-500 ring-2 ring-red-500")} />
               </div>
             </div>

             {/* Building & Location Information */}
              <div className="space-y-4 pt-10">
                <h4 className="text-md font-medium text-white border-b border-slate-500 pb-2 tracking-wide">Building & Location Details <span className="text-red-400 font-semibold">(Required)</span></h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Street Address</label>
                    <Input type="text" placeholder="e.g., 123 Main St" value={selections.streetAddress} onChange={e => setSelections(prev => ({ ...prev, streetAddress: e.target.value }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.streetAddress && "border-red-500 ring-2 ring-red-500")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Unit Number (Optional)</label>
                    <Input type="text" placeholder="e.g., Apt, Unit, Suite" value={selections.unitNumber} onChange={e => setSelections(prev => ({ ...prev, unitNumber: e.target.value }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-100">City</label>
                    <Input type="text" placeholder="Enter city" value={selections.city} onChange={e => setSelections(prev => ({ ...prev, city: e.target.value }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.city && "border-red-500 ring-2 ring-red-500")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Province</label>
                    <Select value={selections.province} onValueChange={value => {
                      setSelections(prev => ({
                        ...prev,
                        province: value,
                        climateZone: "", // Reset climate zone when province changes
                      }));
                    }}>
                      <SelectTrigger className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.province && "border-red-500 ring-2 ring-red-500")}>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
                        <SelectItem value="alberta">Alberta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Postal Code</label>
                    <Input type="text" placeholder="Enter postal code" value={selections.postalCode} onChange={e => setSelections(prev => ({ ...prev, postalCode: e.target.value }))} className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.postalCode && "border-red-500 ring-2 ring-red-500")} />
                  </div>
                  {selections.province === "alberta" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-100">Climate Zone</label>
                        <InfoButton title="Climate Zone Information">
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
                        </InfoButton>
                      </div>
                      <Select value={selections.climateZone} onValueChange={value => setSelections(prev => ({ ...prev, climateZone: value }))}>
                        <SelectTrigger className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.climateZone && "border-red-500 ring-2 ring-red-500")}>
                          <SelectValue placeholder="Select climate zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7A">Zone 7A (6000+ HDD)</SelectItem>
                          <SelectItem value="7B">Zone 7B (6000-6999 HDD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Building Type</label>
                    <Select value={selections.buildingType} onValueChange={value => setSelections(prev => ({ ...prev, buildingType: value }))}>
                      <SelectTrigger className={cn("bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400", validationErrors.buildingType && "border-red-500 ring-2 ring-red-500")}>
                        <SelectValue placeholder="Select building type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="single-detached">Single-detached home</SelectItem>
                        <SelectItem value="single-detached-secondary">Single-detached home with a secondary suite</SelectItem>
                        <SelectItem value="multi-unit">Multi-Unit Residential Building or Town/Row-House</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Occupancy Class</label>
                    <Input type="text" placeholder="C" value={selections.occupancyClass} onChange={e => setSelections(prev => ({ ...prev, occupancyClass: e.target.value }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                  </div>
                </div>
             </div>
           </CardContent>
        </Card>        
      }
    </>
  );
}