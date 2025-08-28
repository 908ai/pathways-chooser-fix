import React from "react";
import { Calculator, Edit, AlertTriangle, Info, Zap, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/FileUpload";

// Header Section Component
export const HeaderSection = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Calculator className="h-8 w-8 text-teal-300" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-200 via-blue-200 to-teal-200 bg-clip-text text-transparent drop-shadow-lg">
          NBC2020 Energy Code Pathways Selector
        </h1>
      </div>
      <p className="text-xl bg-gradient-to-r from-slate-300 to-teal-300 bg-clip-text text-transparent font-medium mb-4 drop-shadow-md">
        (Alberta & Saskatchewan)
      </p>
      <p className="text-gray-200 text-lg drop-shadow-md">
        National Building Code of Canada - Energy Performance Compliance Tool
      </p>
    </div>
  );
};

// Instructions Section Component
export const InstructionsSection = () => {
  return (
    <Card className="border-2 border-slate-400/30 bg-gradient-to-r from-slate-800/40 to-teal-800/40 backdrop-blur-md shadow-2xl">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full" defaultValue="instructions">
          <AccordionItem value="instructions" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-slate-500 to-teal-500 text-white text-sm font-semibold shadow-lg">
                  ?
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Getting Started & Instructions</h3>
                  <p className="text-sm text-slate-200">Energy Compliance Calculator Overview</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-2">
                <p className="text-white">
                  Welcome! This tool helps you compare different energy code compliance paths under NBC 2020 Part 9 — including both the Prescriptive and Performance options.
                </p>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Please follow these instructions:</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-white mb-2">1. Choose Your Code Pathway:</h5>
                       <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                         <li>You can follow either the Prescriptive Path (NBC 9.36.2–9.36.4 or 9.36.8) or the Performance Path (NBC 9.36.5 or 9.36.7).</li>
                         <li>Look for the info icons to learn more about how each option affects your project. If you see an orange warning icon, click it to view important details or additional information required for that choice.</li>
                         <li>If you're unsure, we recommend starting with inputs and reviewing your results before deciding or giving us a call directly.</li>
                       </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-white mb-2">2. Enter Your Building Details:</h5>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>Input values for insulation (attic, walls, slab), mechanical systems (heating, cooling, hot water, ventilation), and windows/doors.</li>
                        <li>Select values as accurately as possible. Estimated or placeholder values are okay — we'll flag anything that needs clarification.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-white mb-2">3. Understand What You'll See:</h5>
                       <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                         <li>As you make your selections, the app will calculate compliance and cost estimates for both pathways in the background. You'll see upgrade cost comparisons and energy performance insights to help guide your decisions. Results can be tailored to reflect your specific project details.</li>
                       </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-white mb-2">4. Need Help?</h5>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>If you have any questions, just click the "Contact Us" button. You'll talk to a real person from our local team — we're here to help you understand your options.</li>
                      </ul>
                    </div>
                  </div>

                   
                    <div className="mt-4">
                      <div className="space-y-3">
                        <h4 className="text-lg font-bold text-white">
                          Application Processing Notice
                        </h4>
                        <p className="text-white font-semibold">
                          Incomplete applications may delay results for Performance Path. Our team may follow up if additional info is needed.
                        </p>
                      </div>
                    </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

// Contact Section Component
export const ContactSection = () => {
  return (
    <Card className="bg-gradient-to-r from-slate-800/50 to-teal-800/50 border-slate-400/40 backdrop-blur-md shadow-2xl">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">📞</span>
            <h3 className="text-lg font-semibold text-white">Need Help? We're Here for You!</h3>
          </div>
          <p className="text-slate-100 max-w-2xl mx-auto">
            If you're unsure about anything, please call us directly. You'll speak to a real person from our small, local team. 
            We're here to walk you through the process, answer your questions, and help make energy compliance easy and stress-free.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-slate-500 to-teal-500 hover:from-slate-600 hover:to-teal-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200" 
              onClick={() => window.open('tel:403-872-2441', '_self')}
            >
              📞 Call Us: 403-872-2441
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Edit Mode Indicator Component
export const EditModeIndicator = ({ isEditing }: { isEditing: boolean }) => {
  if (!isEditing) return null;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-slate-600/20 to-teal-600/20 backdrop-blur-md border border-slate-400/50 rounded-xl relative z-10">
      <div className="flex items-center gap-2">
        <Edit className="h-5 w-5 text-slate-300" />
        <div>
          <div className="font-medium text-slate-100">Editing Project</div>
          <div className="text-sm text-slate-200">Make your changes and resubmit to update the project.</div>
        </div>
      </div>
    </div>
  );
};

// Warning Button Component
export const WarningButton = ({
  warningId,
  title,
  children,
  variant = "warning",
  expandedWarnings,
  toggleWarning
}: {
  warningId: string;
  title: string;
  children: React.ReactNode;
  variant?: "warning" | "destructive";
  expandedWarnings: { [key: string]: boolean };
  toggleWarning: (warningId: string) => void;
}) => {
  const isExpanded = expandedWarnings[warningId];
  const bgColor = variant === "warning" 
    ? "bg-gradient-to-r from-slate-800/60 to-teal-800/60" 
    : "bg-gradient-to-r from-slate-800/60 to-red-800/60";
  const borderColor = variant === "warning" 
    ? "border-2 border-orange-400" 
    : "border-2 border-red-400";

  return (
    <div className={`p-4 ${bgColor} ${borderColor} rounded-lg backdrop-blur-sm`}>
      <button 
        onClick={() => toggleWarning(warningId)} 
        className="flex items-center gap-3 w-full text-left"
      >
        <span className="text-lg font-bold text-white">
          {title}
        </span>
      </button>
      {isExpanded && (
        <div className="mt-4 animate-accordion-down">
          <div className="text-white font-semibold">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Compliance Sidebar Component
export const ComplianceSidebar = ({
  selections,
  totalPoints,
  compliance,
  getPoints,
  calculatePrescriptiveCost,
  calculatePerformanceCost,
  calculateCostSavings
}: {
  selections: any;
  totalPoints: number;
  compliance: any;
  getPoints: (category: string, value: string) => number;
  calculatePrescriptiveCost: () => number;
  calculatePerformanceCost: () => number;
  calculateCostSavings: () => number;
}) => {
  if (selections.compliancePath !== "9368") return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-72 z-50">
      <Card className="bg-gradient-to-br from-slate-800/90 to-teal-800/90 backdrop-blur-md border-slate-400/50 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Tiered Compliance
          </CardTitle>
          <CardDescription className="text-slate-200">
            NBC 9.36.8 Points System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {totalPoints.toFixed(1)}
            </div>
            <div className="text-sm text-slate-300">Total Points</div>
          </div>
          
          <div className="flex items-center justify-center">
            <Badge 
              variant={compliance.status === "success" ? "default" : compliance.status === "warning" ? "secondary" : "destructive"}
              className="text-sm px-3 py-1"
            >
              {compliance.tier}
            </Badge>
          </div>
          
          <div className="space-y-1 text-xs">
            {[{
              key: 'atticRSI',
              label: 'Attic Insulation'
            }, {
              key: 'wallRSI',
              label: 'Wall Insulation'
            }, {
              key: 'windowUValue',
              label: 'Windows'
            }, {
              key: 'belowGradeRSI',
              label: 'Below Grade'
            }, {
              key: 'buildingVolume',
              label: 'Building Volume'
            }, {
              key: 'airtightness',
              label: 'Airtightness'
            }, {
              key: 'hrvSystem',
              label: 'HRV/ERV'
            }, {
              key: 'waterHeater',
              label: 'Water Heater'
            }].map(({ key, label }) => {
              const value = selections[key as keyof typeof selections];
              if (!value || typeof value === 'boolean') return null;
              const points = Array.isArray(value) 
                ? value.reduce((total, item) => total + getPoints(key, item), 0) 
                : getPoints(key, value as string);
              if (points === 0) return null;
              return (
                <div key={key} className="flex justify-between items-center text-slate-200">
                  <span className="text-xs">{label}</span>
                  <span className="font-medium text-[#b7fdb1]">+{points.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
          
          <div className="border-t border-slate-600 pt-2">
            <p className="text-xs text-slate-300 text-center">
              {compliance.description}
            </p>
          </div>
          
          {/* Cost Information */}
          {(selections.compliancePath === "9368" || selections.compliancePath === "9362") && (
            <div className="border-t border-slate-600 pt-3 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h4 className="text-sm font-medium text-white">Cost Estimates</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-slate-300 hover:text-white">
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="left" align="start" className="w-80 bg-slate-800 border-slate-600 z-[100]">
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">How Cost Estimates Are Calculated</h4>
                      <div className="text-sm text-slate-300 space-y-2">
                        <p><strong>Prescriptive Path:</strong> Based on baseline construction costs plus upgrades required to meet minimum NBC2020 requirements for each building component.</p>
                        <p><strong>Performance Path:</strong> Calculated using optimized component selections that achieve the same energy performance at potentially lower cost through strategic trade-offs.</p>
                        <p><strong>Estimates Include:</strong> Materials, labor, and installation for insulation, windows, HVAC systems, and air sealing measures.</p>
                        <p><strong>Note:</strong> Costs are estimates for a typical 2,000 sq ft home and may vary based on local pricing, specific products, and installation complexity.</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <div className="bg-slate-700/40 p-3 rounded-lg">
                  <div className="text-lg font-bold text-purple-300 text-center">
                    ${calculatePrescriptiveCost().toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-300 text-center">
                    Prescriptive Path
                  </div>
                </div>
                <div className="bg-slate-700/40 p-3 rounded-lg">
                  <div className="text-lg font-bold text-green-300 text-center">
                    ${calculatePerformanceCost().toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-300 text-center">
                    Performance Path
                  </div>
                </div>
                {calculateCostSavings() > 0 && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-green-600/20 p-3 rounded-lg border border-purple-400/30">
                    <div className="text-lg font-bold text-yellow-300 text-center">
                      ${calculateCostSavings().toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-300 text-center">
                      Potential Savings
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 text-center">
                Estimates for 2,000 sq ft home
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Project Information Section Component
export const ProjectInformationSection = ({
  selections,
  setSelections,
  uploadedFiles,
  handleFileUploaded,
  removeFile
}: {
  selections: any;
  setSelections: (updater: (prev: any) => any) => void;
  uploadedFiles: File[];
  handleFileUploaded: (fileData: any) => void;
  removeFile: (index: number) => void;
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
                onChange={e => setSelections(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input 
                type="text" 
                placeholder="Enter last name" 
                value={selections.lastName} 
                onChange={e => setSelections(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))} 
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
                onChange={e => setSelections(prev => ({
                  ...prev,
                  company: e.target.value
                }))} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                type="tel" 
                placeholder="Enter phone number" 
                value={selections.phoneNumber} 
                onChange={e => setSelections(prev => ({
                  ...prev,
                  phoneNumber: e.target.value
                }))} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company Address</label>
            <Input 
              type="text" 
              placeholder="Enter company address" 
              value={selections.companyAddress} 
              onChange={e => setSelections(prev => ({
                ...prev,
                companyAddress: e.target.value
              }))} 
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
              onChange={e => setSelections(prev => ({
                ...prev,
                buildingAddress: e.target.value
              }))} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Building Type</label>
            <Select 
              value={selections.buildingType} 
              onValueChange={value => setSelections(prev => ({
                ...prev,
                buildingType: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select building type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-detached">Single-detached house</SelectItem>
                <SelectItem value="single-detached-secondary">Single-detached house with secondary suite</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="multi-unit">Multi-unit residential building (MURB)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

