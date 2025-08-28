import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FileUpload from "@/components/FileUpload";
import { Badge } from "@/components/ui/badge";
import { Info, X } from "lucide-react";

interface ProjectInformationSectionProps {
  selections: any;
  setSelections: (fn: (prev: any) => any) => void;
  uploadedFiles: File[];
  setUploadedFiles: (fn: (prev: File[]) => File[]) => void;
  removeFile: (index: number) => void;
  handleFileUploaded: (fileData: { name: string; url: string; size: number; type: string; path?: string }) => void;
}

const ProjectInformationSection: React.FC<ProjectInformationSectionProps> = ({
  selections,
  setSelections,
  uploadedFiles,
  setUploadedFiles,
  removeFile,
  handleFileUploaded,
}) => {
  return (
    <Card className="bg-gradient-to-r from-slate-700/40 to-teal-700/40 border-slate-400/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-white">
          📋 Project Information
          {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? (
            <Badge variant="outline" className="ml-2 border-orange-400 text-orange-300 bg-orange-900/30">
              Prescriptive Path
            </Badge>
          ) : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? (
            <Badge variant="outline" className="ml-2 border-blue-400 text-blue-300 bg-blue-900/30">
              Performance Path
            </Badge>
          ) : null}
        </CardTitle>
        <CardDescription className="text-slate-200">
          Personal details, building location, and compliance path selection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal/Contact Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white border-b pb-2">
            Personal & Contact Information <span className="text-red-500">(Required)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input
                type="text"
                placeholder="Enter first name"
                value={selections.firstName}
                onChange={e => setSelections((prev: any) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                type="text"
                placeholder="Enter last name"
                value={selections.lastName}
                onChange={e => setSelections((prev: any) => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input
                type="text"
                placeholder="Enter company name"
                value={selections.company}
                onChange={e => setSelections((prev: any) => ({ ...prev, company: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={selections.phoneNumber}
                onChange={e => setSelections((prev: any) => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Address</label>
            <Input
              type="text"
              placeholder="Enter company address"
              value={selections.companyAddress}
              onChange={e => setSelections((prev: any) => ({ ...prev, companyAddress: e.target.value }))}
            />
          </div>
        </div>
        {/* Building & Location Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white border-b pb-2">
            Building & Location Details <span className="text-red-500">(Required)</span>
          </h4>
          {/* Upload Building Plans */}
          <div className="space-y-2 p-4 bg-red-50/50 border border-red-200 rounded-lg">
            <label className="text-sm font-medium">Building Plans & Documents</label>
            <div className="space-y-2">
              <FileUpload
                onFileUploaded={handleFileUploaded}
                maxFiles={10}
                acceptedTypes={['pdf', 'dwg', 'jpg', 'jpeg', 'png', 'tiff', 'doc', 'docx', 'xls', 'xlsx', 'txt']}
                maxSizePerFile={10 * 1024 * 1024}
              />
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{uploadedFiles.length} file(s) uploaded successfully</span>
                  </div>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-emerald-50/80 border border-emerald-300/50 rounded-md backdrop-blur-sm">
                        <span className="text-sm truncate text-emerald-900">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 text-green-600 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Building/Project Address</label>
            <Input
              type="text"
              placeholder="Enter building/project address"
              value={selections.buildingAddress}
              onChange={e => setSelections((prev: any) => ({ ...prev, buildingAddress: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Building Type</label>
            <Select
              value={selections.buildingType}
              onValueChange={value => setSelections((prev: any) => ({ ...prev, buildingType: value }))}
            >
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
              <Select
                value={selections.province}
                onValueChange={value => {
                  setSelections((prev: any) => ({
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
                }}
              >
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
            {selections.province === "alberta" && (
              <div className="space-y-2">
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
                          <img src="/lovable-uploads/9b289384-01b6-4f5f-a713-ddcae27167db.png" alt="Climate Zone Map for Alberta" className="w-full h-auto rounded-lg border border-gray-200" />
                          <div className="mt-4 text-xs text-blue-600">
                            <p><strong>HDD:</strong> Heating Degree Days - a measure of how much (in degrees), and for how long (in days), the outside air temperature was below a certain level.</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select
                  value={selections.climateZone}
                  onValueChange={value => setSelections((prev: any) => ({ ...prev, climateZone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select climate zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7A">Zone 7A (6000+ HDD)</SelectItem>
                    <SelectItem value="7B">Zone 7B (6000-6999 HDD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Occupancy Class</label>
              <Input
                type="text"
                placeholder="C"
                value={selections.occupancyClass}
                onChange={e => setSelections((prev: any) => ({ ...prev, occupancyClass: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInformationSection;