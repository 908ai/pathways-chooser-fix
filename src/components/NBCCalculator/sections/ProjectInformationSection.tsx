import {
  Card, CardContent
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Pencil, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import InfoButton from "@/components/InfoButton";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            *,
            company:companies(*)
          `)
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          if (profile.company) {
            setCompany(profile.company);
          }
          
          setSelections(prev => ({
            ...prev,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            company: profile.company?.name || '',
            phoneNumber: profile.company?.phone_number || '',
            companyAddress: profile.company?.address || ''
          }));
        }
      }
    };

    fetchProfile();
  }, [setSelections]);

  return (
    <>
      {
        <Card>
           {/* <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                📋 Project Information
                {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? <Badge variant="outline" className="ml-2 border-orange-400 text-orange-300 bg-orange-900/30">
                    Prescriptive Path
                  </Badge> : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? <Badge variant="outline" className="ml-2 border-blue-400 text-blue-300 bg-blue-900/30">
                    Performance Path
                  </Badge> : null}
              </CardTitle>
              <CardDescription>
                Personal details, building location, and compliance path selection
              </CardDescription>
           </CardHeader> */}
           <CardContent className="space-y-6 pt-6">
             {/* Personal/Contact Information */}
             <div className="space-y-4">
               <h4 className="text-md font-medium border-b border-border pb-2 tracking-wide text-foreground">Personal & Contact Information <span className="text-red-400 font-semibold">(Required)</span></h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div id="firstName" className="space-y-2">
                   <label className="text-sm font-medium text-foreground">First Name</label>
                   <div className="flex items-center gap-2">
                    <Input type="text" placeholder="Enter first name" value={selections.firstName} disabled className={cn(validationErrors.firstName && "border-red-500 ring-2 ring-red-500")} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to="/profile">
                            <Pencil className="h-5 w-5 text-muted-foreground cursor-pointer" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>To change this, please edit your profile.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                   </div>
                 </div>
                 
                 <div id="lastName" className="space-y-2">
                   <label className="text-sm font-medium text-foreground">Last Name</label>
                   <div className="flex items-center gap-2">
                    <Input type="text" placeholder="Enter last name" value={selections.lastName} disabled className={cn(validationErrors.lastName && "border-red-500 ring-2 ring-red-500")} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to="/profile">
                            <Pencil className="h-5 w-5 text-muted-foreground cursor-pointer" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>To change this, please edit your profile.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div id="company" className="space-y-2">
                   <label className="text-sm font-medium text-foreground">Company</label>
                   <div className="flex items-center gap-2">
                    <Input type="text" placeholder="Enter company name" value={selections.company} disabled className={cn(validationErrors.company && "border-red-500 ring-2 ring-red-500")} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to="/profile">
                            <Pencil className="h-5 w-5 text-muted-foreground cursor-pointer" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>To change this, please edit your profile.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                   </div>
                 </div>

                 <div id="phoneNumber" className="space-y-2">
                   <label className="text-sm font-medium text-foreground">Phone Number</label>
                   <div className="flex items-center gap-2">
                    <Input type="tel" placeholder="Enter phone number" value={selections.phoneNumber} disabled className={cn(validationErrors.phoneNumber && "border-red-500 ring-2 ring-red-500")} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to="/profile">
                            <Pencil className="h-5 w-5 text-muted-foreground cursor-pointer" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>To change this, please edit your profile.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                   </div>
                 </div>
               </div>

               <div id="companyAddress" className="space-y-2">
                 <label className="text-sm font-medium text-foreground">Company Address</label>
                 <div className="flex items-center gap-2">
                  <Input type="text" placeholder="Enter company address" value={selections.companyAddress} disabled className={cn(validationErrors.companyAddress && "border-red-500 ring-2 ring-red-500")} />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/profile">
                          <Pencil className="h-5 w-5 text-muted-foreground cursor-pointer" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>To change this, please edit your profile.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                 </div>
               </div>
             </div>

             {/* Building & Location Information */}
              <div className="space-y-4 pt-10">
                <h4 className="text-md font-medium border-b border-border pb-2 tracking-wide text-foreground">Building & Location Details <span className="text-red-400 font-semibold">(Required)</span></h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div id="streetAddress" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Street Address</label>
                    <Input type="text" placeholder="e.g., 123 Main St" value={selections.streetAddress} onChange={e => setSelections(prev => ({ ...prev, streetAddress: e.target.value }))} className={cn(validationErrors.streetAddress && "border-red-500 ring-2 ring-red-500")} />
                  </div>
                  <div id="unitNumber" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Unit Number <span className="text-muted-foreground font-normal">(Optional)</span></label>
                    <Input type="text" placeholder="e.g., Apt, Unit, Suite" value={selections.unitNumber} onChange={e => setSelections(prev => ({ ...prev, unitNumber: e.target.value }))} className={cn(validationErrors.unitNumber && "border-red-500 ring-2 ring-red-500")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div id="city" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">City</label>
                    <Input type="text" placeholder="Enter city" value={selections.city} onChange={e => setSelections(prev => ({ ...prev, city: e.target.value }))} className={cn(validationErrors.city && "border-red-500 ring-2 ring-red-500")} />
                  </div>
                  <div id="province" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Province</label>
                    <Select value={selections.province} onValueChange={value => {
                      setSelections(prev => ({
                        ...prev,
                        province: value,
                        climateZone: "", // Reset climate zone when province changes
                      }));
                    }}>
                      <SelectTrigger className={cn(validationErrors.province && "border-red-500 ring-2 ring-red-500")}>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
                        <SelectItem value="alberta">Alberta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div id="postalCode" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Postal Code</label>
                    <Input type="text" placeholder="Enter postal code" value={selections.postalCode} onChange={e => setSelections(prev => ({ ...prev, postalCode: e.target.value }))} className={cn(validationErrors.postalCode && "border-red-500 ring-2 ring-red-500")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div id="buildingType" className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Building Type</label>
                    <Select value={selections.buildingType} onValueChange={value => setSelections(prev => ({ ...prev, buildingType: value }))}>
                      <SelectTrigger className={cn(validationErrors.buildingType && "border-red-500 ring-2 ring-red-500")}>
                        <SelectValue placeholder="Select building type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="single-detached">Single-detached home</SelectItem>
                        <SelectItem value="single-detached-secondary">Single-detached home with a secondary suite</SelectItem>
                        <SelectItem value="multi-unit">Multi-Unit Residential Building or Town/Row-House</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div id="occupancyClass" className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Occupancy Class</label>
                      <InfoButton title="Understanding Occupancy Class">
                        <p>Homebuilders need to understand building occupancy classifications because it determines whether a project falls under Part 9 of the National Building Code (NBC), which governs small buildings like houses, row homes, small apartments, and similar low-rise structures. These rules apply only to certain building types, mainly residential (Group C) or home-type care (Group B, Division 4) with fewer than 10 residents.</p>
                        <p>If your building includes commercial uses (like a shop, office, or workshop), it might still fall under Part 9, but if you combine unrelated uses (like residential and a school or restaurant), or if it's an assembly space (Group A), detention/care facility (Group B), or high-hazard industrial (Group F, Div. 1), then you're out of scope and must follow the much more complex Part 3. Understanding this early avoids costly missteps in design, fire safety, and permit approval. For most new homes, the occupancy is Group C, unless there's a unique mixed-use or care component.</p>
                        <img src="/assets/img/occupancies-table91B-91C.png" alt="Occupancy classifications table" className="mt-4 rounded-md border mx-auto block" />
                      </InfoButton>
                    </div>
                    <Input type="text" placeholder="C" value={selections.occupancyClass} onChange={e => setSelections(prev => ({ ...prev, occupancyClass: e.target.value }))} />
                  </div>
                  {selections.province === "alberta" && (
                    <div id="climateZone" className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Climate Zone</label>
                        <InfoButton title="Climate Zone Information">
                          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/50 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Saskatchewan</h4>
                            <p className="text-green-700 dark:text-green-400">All of Saskatchewan is in Climate Zone 7A (5000 to 5999 HDD)</p>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/50 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Alberta Climate Zones</h4>
                            <img src="/lovable-uploads/9b289384-01b6-4f5f-a713-ddcae27167db.png" alt="Climate Zone Map for Alberta showing Zone 6, 7A, 7B, and 8 with corresponding cities and HDD ranges" className="w-full h-auto rounded-lg border border-gray-200" />
                            <div className="mt-4 text-xs text-blue-600 dark:text-blue-400">
                              <p><strong>HDD:</strong> Heating Degree Days - a measure of how much (in degrees), and for how long (in days), the outside air temperature was below a certain level.</p>
                            </div>
                          </div>
                        </InfoButton>
                      </div>
                      <Select value={selections.climateZone} onValueChange={value => setSelections(prev => ({ ...prev, climateZone: value }))}>
                        <SelectTrigger className={cn(validationErrors.climateZone && "border-red-500 ring-2 ring-red-500")}>
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
             </div>
           </CardContent>
        </Card>        
      }
    </>
  );
}