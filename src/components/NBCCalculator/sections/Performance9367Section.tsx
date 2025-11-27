import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, ChevronDown, AlertTriangle, Search } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import InfoButton from "@/components/InfoButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function Performance9367Section({
    selections,
    setSelections,
    handleFileUploadRequest,
    uploadedFiles,
    removeFile,
}: {
    selections: any;
    setSelections: any;
    handleFileUploadRequest: (file: File) => Promise<void>;
    uploadedFiles: File[];
    removeFile: (file: File) => void;
}) {
    // Local state for collapsible warnings
    const [expandedWarnings, setExpandedWarnings] = useState<{
        [key: string]: boolean;
    }>({});

    const toggleWarning = (warningId: string) => {
        setExpandedWarnings((prev) => ({
            ...prev,
            [warningId]: !prev[warningId],
        }));
    };

    const WarningButton = ({
        warningId,
        title,
        children,
        variant = "warning",
        defaultOpen = false,
    }: {
        warningId: string;
        title: string;
        children: React.ReactNode;
        variant?: "warning" | "destructive";
        defaultOpen?: boolean;
    }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        
        const baseClasses = "p-2 border rounded-lg";
        const variantClasses = {
            warning: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/30 dark:border-orange-500/50 dark:text-orange-300",
            destructive: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-300",
        };
        const iconColor = variant === "warning" ? "text-orange-700 dark:text-orange-400" : "text-red-700 dark:text-red-400";
        const contentColor = variant === "warning" ? "text-orange-700 dark:text-orange-300" : "text-red-700 dark:text-red-300";

        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn(baseClasses, variantClasses[variant])}>
                <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
                    <span className="text-xs font-bold">{title}</span>
                    <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", isOpen ? "rotate-180" : "", iconColor)} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                    <div className={cn("text-xs", contentColor)}>{children}</div>
                </CollapsibleContent>
            </Collapsible>
        );
    };

    const isHeatedFloorsChecked = selections.floorsSlabsSelected.includes("heatedFloors");
    const isUnheatedFloorChecked = selections.floorsSlabsSelected.includes("unheatedBelowFrost") || selections.floorsSlabsSelected.includes("unheatedAboveFrost");
    const isSlabOnGradeChecked = selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting");

    return (
        <>
            {
                <>
                    {/* Building volume section removed for 9.36.7 */}

                    <div id="ceilingsAtticRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Ceilings below Attics</label>
                        <Input type="text" placeholder='Enter assembly info (e.g., R50 Loose-fill/2x10/16"OC)' value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            ceilingsAtticRSI: e.target.value
                        }))} />
                    </div>

                    <div id="hasCathedralOrFlatRoof" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Is there any cathedral ceilings or flat roof?</label>
                        <Select value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                            ...prev,
                            hasCathedralOrFlatRoof: value,
                            cathedralFlatRSI: ""
                        }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no">No</SelectItem>
                                <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selections.hasCathedralOrFlatRoof === "yes" && <div id="cathedralFlatRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Cathedral / Flat Roofs</label>
                        <Input type="text" placeholder="Enter insulation type &/or R-value (e.g, R50 Loose-fill)., N/A" value={selections.cathedralFlatRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            cathedralFlatRSI: e.target.value
                        }))} />
                    </div>}

                    <div id="wallRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Above Grade Walls</label>
                        <Input type="text" placeholder='Enter assembly info (e.g., R20 Batt/2x6/16"OC)' value={selections.wallRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            wallRSI: e.target.value
                        }))} />
                    </div>

                    <div id="belowGradeRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Below Grade Walls (Foundation Walls)</label>
                        <Input type="text" placeholder='Enter assembly info (e.g., R12 Batt/2x4/24"OC)' value={selections.belowGradeRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            belowGradeRSI: e.target.value
                        }))} />
                    </div>

                    <div id="floorsSlabsSelected" className="space-y-4">
                        <label className="text-sm font-medium text-foreground">Floors/Slabs (Select all that apply)</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsUnheated")} onChange={e => {
                                    const value = "floorsUnheated";
                                    setSelections(prev => ({
                                        ...prev,
                                        floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                                    }));
                                }} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsGarage")} onChange={e => {
                                    const value = "floorsGarage";
                                    setSelections(prev => ({
                                        ...prev,
                                        floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                                    }));
                                }} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Floors above Garages</span>
                            </label>
                            <label className={`flex items-center gap-2 ${isHeatedFloorsChecked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedBelowFrost")} disabled={isHeatedFloorsChecked} onChange={e => {
                                    const isChecked = e.target.checked;
                                    setSelections(prev => {
                                        let newFloorsSlabsSelected = [...prev.floorsSlabsSelected];
                                        if (isChecked) {
                                            if (!newFloorsSlabsSelected.includes('unheatedBelowFrost')) {
                                                newFloorsSlabsSelected.push('unheatedBelowFrost');
                                            }
                                            newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'heatedFloors');
                                        } else {
                                            newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'unheatedBelowFrost');
                                        }
                                        return {
                                            ...prev,
                                            floorsSlabsSelected: newFloorsSlabsSelected,
                                            hasInFloorHeat: 'no'
                                        };
                                    });
                                }} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Unheated Floor Below Frostline</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedAboveFrost")} onChange={e => {
                                    const value = "unheatedAboveFrost";
                                    setSelections(prev => ({
                                        ...prev,
                                        floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                                    }));
                                }} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Unheated Floor Above Frost Line (or walk-out basement)</span>
                            </label>
                            <label className={`flex items-center gap-2 ${isUnheatedFloorChecked || isSlabOnGradeChecked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input type="checkbox" checked={selections.floorsSlabsSelected.includes("heatedFloors")} disabled={isUnheatedFloorChecked || isSlabOnGradeChecked} onChange={e => {
                                    const isChecked = e.target.checked;
                                    setSelections(prev => {
                                        let newFloorsSlabsSelected = [...prev.floorsSlabsSelected];
                                        if (isChecked) {
                                            if (!newFloorsSlabsSelected.includes('heatedFloors')) {
                                                newFloorsSlabsSelected.push('heatedFloors');
                                            }
                                            newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => 
                                                item !== 'unheatedBelowFrost' && 
                                                item !== 'unheatedAboveFrost' &&
                                                item !== 'slabOnGradeIntegralFooting'
                                            );
                                        } else {
                                            newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'heatedFloors');
                                        }
                                        return {
                                            ...prev,
                                            floorsSlabsSelected: newFloorsSlabsSelected,
                                            hasInFloorHeat: isChecked ? "yes" : "no"
                                        };
                                    });
                                }} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Heated Floors</span>
                            </label>
                            <label className={`flex items-center gap-2 ${isHeatedFloorsChecked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input type="checkbox" checked={selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")} disabled={isHeatedFloorsChecked} onChange={e => {
                                    const value = "slabOnGradeIntegralFooting";
                                    const isChecked = e.target.checked;
                                    setSelections(prev => {
                                        let newFloorsSlabsSelected = [...prev.floorsSlabsSelected];
                                        if (isChecked) {
                                            if (!newFloorsSlabsSelected.includes(value)) {
                                                newFloorsSlabsSelected.push(value);
                                            }
                                            // Uncheck heated floors
                                            newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== 'heatedFloors');
                                        } else {
                                            newFloorsSlabsSelected = newFloorsSlabsSelected.filter(item => item !== value);
                                        }
                                        return {
                                            ...prev,
                                            floorsSlabsSelected: newFloorsSlabsSelected,
                                            hasInFloorHeat: newFloorsSlabsSelected.includes('heatedFloors') ? "yes" : "no"
                                        };
                                    });
                                }} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">Slab on grade with integral Footing</span>
                            </label>
                        </div>
                    </div>

                    {selections.floorsSlabsSelected.includes("floorsUnheated") && <div id="floorsUnheatedRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                        <Input type="text" placeholder="Enter insulation type &/or RSI/R-value, or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            floorsUnheatedRSI: e.target.value
                        }))} />
                    </div>}

                    {selections.floorsSlabsSelected.includes("floorsGarage") && <div id="floorsGarageRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Floors above Garages</label>
                        <Input type="text" placeholder="Enter insulation type &/or RSI/R-value, or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            floorsGarageRSI: e.target.value
                        }))} />
                    </div>}

                    {selections.floorsSlabsSelected.includes("unheatedBelowFrost") && <div id="unheatedFloorBelowFrostRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Unheated Floor Below Frost Line</label>
                        <Input type="text" placeholder="Enter RSI value or 'uninsulated'" value={selections.unheatedFloorBelowFrostRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            unheatedFloorBelowFrostRSI: e.target.value
                        }))} />
                    </div>}

                    {selections.floorsSlabsSelected.includes("unheatedAboveFrost") && <div id="unheatedFloorAboveFrostRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Unheated Floor Above Frost Line</label>
                        <Input type="text" placeholder='Enter insulation type & R-value (e.g., 2" XPS or R10 Rigid), or N/A' value={selections.unheatedFloorAboveFrostRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            unheatedFloorAboveFrostRSI: e.target.value
                        }))} />
                    </div>}

                    {selections.floorsSlabsSelected.includes("heatedFloors") && <div id="heatedFloorsRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Heated Floors</label>
                        <Input type="text" placeholder='Enter insulation type & R-value (e.g., 2" XPS or R10 Rigid)' value={selections.heatedFloorsRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            heatedFloorsRSI: e.target.value
                        }))} />
                        <WarningButton warningId="heatedFloorsRSI-hydronic-9368" title="⚠️ Hydronic Floor Insulation Required">
                            <p className="text-xs space-y-2">
                                Hydronic floors must be insulated to prevent heat loss to the ground or unheated areas below. The insulation should be installed between the heated floor and any unheated space, with proper vapor barrier placement. Minimum insulation values vary by province and specific application - consult local building codes and your mechanical designer for specific requirements.
                            </p>
                        </WarningButton>
                    </div>}

                    {selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting") && <div id="slabOnGradeIntegralFootingRSI" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Slab on grade with integral Footing</label>
                        <Input type="text" placeholder="Enter insulation type &/or R-value, or N/A" value={selections.slabOnGradeIntegralFootingRSI} onChange={e => setSelections(prev => ({
                            ...prev,
                            slabOnGradeIntegralFootingRSI: e.target.value
                        }))} />
                    </div>}

                    {/* Window Schedule Upload */}
                    <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-500/50">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Upload window/door schedule from your supplier e.g., "All Weather, Plygem, etc."</label>
                            <div className="flex items-center space-x-4">
                                <Input
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                                    onChange={async (e) => {
                                        if (!e.target.files) return;
                                        for (const file of Array.from(e.target.files)) {
                                            await handleFileUploadRequest(file);
                                        }
                                    }}
                                    className="file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Accepted formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG
                            </p>
                            <p className="text-xs text-foreground font-medium">
                                You're welcome to upload documents later, but please be aware this may cause delays.
                            </p>
                        </div>

                        {uploadedFiles.length > 0 && <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</span>
                            </div>
                            <div className="space-y-2">
                                {uploadedFiles.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/30 dark:border-green-500/50">
                                    <div className="flex items-center space-x-2">
                                        <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm text-green-800 dark:text-green-300">{file.name}</span>
                                        <span className="text-xs text-green-600 dark:text-green-400">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => removeFile(file)} className="h-6 w-6 p-0 text-green-600 hover:text-red-600 dark:text-green-400 dark:hover:text-red-400">
                                        ×
                                    </Button>
                                </div>)}
                            </div>
                        </div>}
                    </div>

                    <div id="windowUValue" className="space-y-2">
                        <WarningButton warningId="windowUValue-9367" title="ℹ️ Window Schedule Required">
                            <p className="text-xs">
                                Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please record the range of lowest-highest performing window and door U-Value (ie, highest U-value W/(m²×K)).
                            </p>
                        </WarningButton>
                    </div>

                    <div id="hasSkylights" className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Do you have skylights?</label>
                        <Select value={selections.hasSkylights} onValueChange={value => setSelections(prev => ({
                            ...prev,
                            hasSkylights: value,
                            skylightUValue: ""
                        }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>

                        {selections.hasSkylights === "yes" && <div id="skylightUValue" className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Skylight U-Value</label>
                            <Input type="text" placeholder="Enter U-Value (W/(m²·K))" value={selections.skylightUValue || ""} onChange={e => setSelections(prev => ({
                                ...prev,
                                skylightUValue: e.target.value
                            }))} />
                        </div>}
                    </div>

                    {selections.hasSkylights === "yes" && <WarningButton warningId="skylight-shaft-insulation-9368" title="⚠️ Important: Skylight Shaft Insulation">
                        <p className="text-xs">
                            Skylight shafts must be insulated. Be prepared to provide further details upon request.
                        </p>
                    </WarningButton>}

                    <div id="airtightness" className="space-y-2">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-foreground">Airtightness Level</label>
                            <InfoButton title="What's a Blower Door Test?">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-base text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                                    </div>

                                    <div className="w-full h-px bg-muted"></div>

                                    <div className="space-y-4">
                                        <div>
                                            <h5 className="font-medium text-base mb-2">What Do the Numbers Mean?</h5>
                                            <div className="space-y-3 text-base text-muted-foreground">
                                                <div>
                                                    <p className="font-medium">• ACH₅₀ (Air Changes per Hour @ 50 Pa):</p>
                                                    <p className="ml-4">How many times the air inside the home is replaced in one hour.</p>
                                                    <p className="ml-4">Lower is better — ≤1.0 is common for Net Zero Ready homes.</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">• NLA₁₀ (Normalized Leakage Area):</p>
                                                    <p className="ml-4">Total leak area per square metre of envelope.</p>
                                                    <p className="ml-4">Think: "This building leaks like it has a 10 cm² hole per m² of wall."</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">• NLR₅₀ (Normalized Leakage Rate):</p>
                                                    <p className="ml-4">Volume of air leaking per second per m² of surface at 50 Pa.</p>
                                                    <p className="ml-4">Useful for comparing attached units or small zones.</p>
                                                </div>
                                                <p className="font-medium text-primary">Lower values = tighter home = better performance</p>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-muted"></div>

                                        <div>
                                            <h5 className="font-medium text-base mb-2">What's a Zone?</h5>
                                            <p className="text-base text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                            <div className="text-base text-muted-foreground ml-4 space-y-1">
                                                <p>• A full detached house</p>
                                                <p>• A single unit in a row house or duplex</p>
                                                <p>• A section of a large home or multi-unit building</p>
                                            </div>
                                            <p className="text-base text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                        </div>

                                        <div className="w-full h-px bg-muted"></div>

                                        <div>
                                            <h5 className="font-medium text-base mb-2">What's an Attached Zone?</h5>
                                            <p className="text-base text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                        </div>

                                        <div className="w-full h-px bg-muted"></div>

                                        <div>
                                            <h5 className="font-medium text-base mb-2">Why Small Units Often Show Higher Leakage</h5>
                                            <div className="text-base text-muted-foreground ml-4 space-y-1">
                                                <p>• Small homes have more corners and connections relative to their size.</p>
                                                <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                                <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-muted"></div>

                                        <div>
                                            <h5 className="font-medium text-base mb-2">Guarded vs. Unguarded Testing</h5>
                                            <div className="space-y-3 text-base text-muted-foreground">
                                                <div>
                                                    <p className="font-medium">Unguarded Test</p>
                                                    <div className="ml-4 space-y-1">
                                                        <p>• Tests one unit at a time, while neighbours are at normal pressure.</p>
                                                        <p>• Includes leakage between units.</p>
                                                        <p>• Easier to do (especially as units are completed and occupied), but can overestimate leakage.</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Guarded Test</p>
                                                    <div className="ml-4 space-y-1">
                                                        <p>• All adjacent units are depressurized (or pressurized) at the same time.</p>
                                                        <p>• Blocks airflow between units, giving a more accurate picture of leakage to the outside.</p>
                                                        <p>• Ideal for multi-unit buildings, but more complex.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-muted"></div>

                                        <div>
                                            <h5 className="font-medium text-base mb-2">How Do You Pass?</h5>
                                            <p className="text-base text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                            <div className="text-base text-muted-foreground ml-4 space-y-1">
                                                <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                                <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                            </div>
                                            <p className="text-base text-muted-foreground mt-2">The design air leakage rate, established by the builder and energy modeller, is incorporated into the energy model and later verified through testing at either the mid-construction or final stage. If the measured air changes per hour (ACH, if chosen) exceed the code-specified airtightness level, the building fails; if the measured ACH is lower, it passes.</p>                                            
                                            <p className="text-base text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                        </div>

                                        <div className="w-full h-px bg-muted"></div>

                                        <div>
                                            <h5 className="font-medium text-base mb-2">Other Key Points</h5>
                                            <div className="text-base text-muted-foreground ml-4 space-y-1">
                                                <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                                <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                                <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different. Reference the Illustrated Guide for the image above.</p>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-muted"></div>

                                        <div>
                                            <h5 className="font-medium text-base mb-2">Potential Air Leakage Locations</h5>
                                            <p className="text-base text-muted-foreground mb-3">Common areas where air leakage occurs in buildings:</p>
                                            <div className="mb-3">
                                                <img src="/lovable-uploads/9d231144-3c4e-430b-9f8c-914698eae23e.png" alt="Figure 9.25-9 Potential air leakage locations in a house showing various points where air can escape including joints at attic hatches, ceiling light fixtures, windows, electrical outlets, around posts and columns, chimney leaks, plumbing stack penetrations, and more" className="w-full h-auto border border-border rounded" onLoad={() => console.log('Air leakage diagram loaded successfully')} onError={e => console.log('Failed to load air leakage diagram:', e)} />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Figure 9.25-9 from Housing and Small Buildings - Illustrated User's Guide, National Building Code of Canada 2020, Part 9 of Division B
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2 dark:bg-blue-900/30 dark:border-blue-500/50">
                                            <p className="text-base font-medium text-blue-800 dark:text-blue-300">📋 Helpful Resources:</p>
                                            <div className="space-y-1">
                                                <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-base text-blue-700 dark:text-blue-400 hover:text-red-800 dark:hover:text-red-400 block">
                                                    🔗 View the Blower Door Checklist
                                                </a>
                                                <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-base text-blue-700 dark:text-blue-400 hover:text-red-800 dark:hover:text-red-400 block">
                                                    🔗 More airtightness information
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </InfoButton>
                        </div>
                        <Input type="text" placeholder={`Min ${selections.province === "saskatchewan" ? "3.2" : "3.0"} ACH50 for ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`} value={selections.airtightness} onChange={e => setSelections(prev => ({
                            ...prev,
                            airtightness: e.target.value
                        }))} />

                        {(() => {
                            const airtightnessValue = parseFloat(selections.airtightness || "0");

                            // Determine minimum threshold based on province and building type
                            let minimumThreshold = 2.5; // Default for Alberta single-detached
                            let thresholdText = "2.5";
                            if (selections.province === "saskatchewan") {
                                minimumThreshold = 3.2;
                                thresholdText = "3.2";
                            } else if (selections.province === "alberta" && selections.buildingType === "multi-unit") {
                                minimumThreshold = 3.0;
                                thresholdText = "3.0";
                            }
                            const showWarning = airtightnessValue > 0 && airtightnessValue < minimumThreshold;
                            return showWarning ? (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Blower Door Test Required</AlertTitle>
                                    <AlertDescription>
                                        You've selected an air leakage rate below {thresholdText} ACH@50pa. A blower door test is required prior to occupancy to verify this result.
                                    </AlertDescription>
                                </Alert>
                            ) : null;   
                        })()}

                        {/* Mid-Construction Blower Door Test Checkbox */}
                        <div id="midConstructionBlowerDoorPlanned" className="space-y-3 pt-4 border-t border-border/20">
                            <Checkbox
                                id="midConstructionBlowerDoor-9367-3"
                                checked={selections.midConstructionBlowerDoorPlanned}
                                onCheckedChange={(checked) => {
                                    setSelections((prev) => ({
                                        ...prev,
                                        midConstructionBlowerDoorPlanned: checked === true, // `checked` pode ser true | false | "indeterminate"
                                    }));
                                }}
                                className="h-4 w-4 text-primary"
                            />
                            <label
                                htmlFor="midConstructionBlowerDoor-9367-3"
                                className="ml-2 text-sm font-medium cursor-pointer text-foreground"
                            >
                                Mid-Construction Blower Door Test Planned (Optional)
                            </label>
                            <Button asChild variant="secondary" className="h-6 px-2 text-xs ml-2">
                                <a href="/find-a-provider" target="_blank" rel="noopener noreferrer">
                                    <Search className="h-4 w-4" />
                                    Find a service provider
                                </a>
                            </Button> 
                            <WarningButton warningId="mid-construction-blower-door-info-9367-3" title="ℹ️ Benefits of Mid-Construction Blower Door Testing">
                                <div className="text-xs space-y-2">
                                    <p className="font-medium">Benefits of a mid-construction (misconstruction) blower door test:</p>
                                    <ul className="list-disc ml-4 space-y-1">
                                        <li>Identifies air leaks early so they can be sealed before drywall.</li>
                                        <li>Reduces costly rework later in the build.</li>
                                        <li>Improves energy performance, helping meet code or rebate targets.</li>
                                        <li>Enhances durability by minimizing moisture movement through assemblies.</li>
                                        <li>Ensures proper placement of air barrier details.</li>
                                        <li>Supports better HVAC sizing with more accurate airtightness data.</li>
                                    </ul>
                                    <div className="flex items-center gap-1 text-sm mt-3">
                                        <span>📄</span>
                                        <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                            View the Blower Door Checklist
                                        </a>  
                                    </div>
                                    <div className="flex items-center gap-1 text-sm mt-3">
                                        <span>▶️</span>
                                        <a href="https://www.youtube.com/watch?v=4KtCansnpLE" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                            BILD Alberta - Building Airtightness Testing
                                        </a>  
                                    </div>   
                                </div>
                            </WarningButton>
                        </div>
                    </div>

                    {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <>
                        <div id="waterHeaterType" className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Water Heater Type</label>
                            <Select value={selections.waterHeaterType} onValueChange={value => setSelections(prev => ({
                                ...prev,
                                waterHeaterType: value
                            }))}>
                                <SelectTrigger>
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
                            <Input type="text" placeholder="Enter Water Heater Make/Model" value={selections.waterHeater} onChange={e => setSelections(prev => ({
                                ...prev,
                                waterHeater: e.target.value
                            }))} />
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
                            <SelectTrigger>
                                <SelectValue placeholder="Select yes or no" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
                            <SelectTrigger>
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
                        <Input type="text" placeholder={selections.heatingType === 'furnace' ? "Enter Furnace Make/Model" : selections.heatingType === 'boiler' ? "Enter Boiler Make/Model" : selections.heatingType === 'heat-pump' ? "Enter Heat Pump Make/Model" : "Enter heating equipment make/model"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                            ...prev,
                            heatingEfficiency: e.target.value
                        }))} />
                    </div>}

                    {selections.heatingType === 'boiler' && <div className="space-y-4">
                        <div id="indirectTank" className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Are you installing an indirect tank?</label>
                            <Select value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                                ...prev,
                                indirectTank: value,
                                indirectTankSize: value === 'no' ? '' : prev.indirectTankSize,
                            }))}>
                                <SelectTrigger>
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
                            <Input type="number" placeholder="Enter tank size in gallons" value={selections.indirectTankSize} onChange={e => setSelections(prev => ({
                                ...prev,
                                indirectTankSize: e.target.value
                            }))} />
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
                            <SelectTrigger>
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
                            <Input type="text" value={selections.coolingMakeModel} onChange={e => setSelections(prev => ({
                                ...prev,
                                coolingMakeModel: e.target.value
                            }))} placeholder="Enter cooling system make and model" />
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
                            />
                        </div>
                    </div>}

                    {/* Secondary Suite HRV - Show for buildings with multiple units */}
                    {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && <div className="space-y-4 p-4 bg-muted/50 border rounded-md">
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
                                <SelectTrigger>
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
                            <Input type="text" placeholder="Input secondary HRV/ERV make/model" value={selections.secondaryHrvEfficiency || ""} onChange={e => setSelections(prev => ({
                                ...prev,
                                secondaryHrvEfficiency: e.target.value
                            }))} />
                        </div>}
                    </div>}
                </>
            }
        </>
    );
}