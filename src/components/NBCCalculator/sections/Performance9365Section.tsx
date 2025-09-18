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
import { Info, ChevronDown, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import InfoButton from "@/components/InfoButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Performance9365Section({
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
    }: {
        warningId: string;
        title: string;
        children: React.ReactNode;
        variant?: "warning" | "destructive";
    }) => {
        const isExpanded = expandedWarnings[warningId];
        const bgColor =
            variant === "warning"
                ? "bg-gradient-to-r from-slate-800/60 to-teal-800/60"
                : "bg-gradient-to-r from-slate-800/60 to-red-800/60";
        const borderColor =
            variant === "warning"
                ? "border border-orange-400"
                : "border-2 border-red-400";

        return (
            <Collapsible open={isExpanded} onOpenChange={() => toggleWarning(warningId)} className={`p-2 ${bgColor} ${borderColor} rounded-lg backdrop-blur-sm`}>
                <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
                    <span className="text-xs font-bold text-white">{title}</span>
                    <ChevronDown className={`h-5 w-5 text-white transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                    <div className="text-white">{children}</div>
                </CollapsibleContent>
            </Collapsible>
        );
    };

    return (
        <>
            {selections.buildingAddress && selections.buildingAddress.toLowerCase().includes("red deer") && selections.province === "alberta" && <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-100">Have you completed the required CSA-F280 Calculation for heating and cooling loads?</label>
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
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                        <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
                    </SelectContent>
                </Select>
            </div>}

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Ceilings below Attics</label>
                <Input type="text" placeholder="e.g., R50 Loose-fill" value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    ceilingsAtticRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Is there any cathedral ceilings or flat roof?</label>
                <Select value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasCathedralOrFlatRoof: value,
                    cathedralFlatRSI: ""
                }))}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.hasCathedralOrFlatRoof === "yes" && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Cathedral / Flat Roofs</label>
                <Input type="text" placeholder="Enter insulation type &/or R-value, or N/A" value={selections.cathedralFlatRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    cathedralFlatRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>}

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Above Grade Walls</label>
                <Input type="text" placeholder='Enter insulation type &/or R-value (e.g., R20 Batt/2x6/16"OC), or N/A' value={selections.wallRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    wallRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Below Grade Walls (Foundation Walls)</label>
                <Input type="text" placeholder='Enter insulation type &/or R-value (e.g., R12 Batt/2x4/24"OC), or N/A' value={selections.belowGradeRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    belowGradeRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-slate-100">Floors/Slabs (Select all that apply)</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsUnheated")} onChange={e => {
                            const value = "floorsUnheated";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-slate-100">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsGarage")} onChange={e => {
                            const value = "floorsGarage";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-slate-100">Floors above Garages</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedBelowFrost")} onChange={e => {
                            const value = "unheatedBelowFrost";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-slate-100">Unheated Floor Below Frostline</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedAboveFrost")} onChange={e => {
                            const value = "unheatedAboveFrost";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-slate-100">Unheated Floor Above Frost Line (or walk-out basement)</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("heatedFloors")} onChange={e => {
                            const value = "heatedFloors";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value),
                                hasInFloorHeat: e.target.checked ? "yes" : "no"
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-slate-100">Heated Floors</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")} onChange={e => {
                            const value = "slabOnGradeIntegralFooting";
                            setSelections(prev => ({
                                ...prev,
                                floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                            }));
                        }} className="w-4 h-4 text-primary" />
                        <span className="text-sm text-slate-100">Slab on grade with integral Footing</span>
                    </label>
                </div>
            </div>

            {/* In-Floor Heat Dropdown for 9365 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Are you installing or roughing in in-floor heat?</label>
                <Select value={selections.hasInFloorHeat9365} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasInFloorHeat9365: value,
                    // Add to floorsSlabsSelected if yes, remove if no
                    floorsSlabsSelected: value === 'yes' ? [...prev.floorsSlabsSelected.filter(item => item !== 'heatedFloors'), 'heatedFloors'] : prev.floorsSlabsSelected.filter(item => item !== 'heatedFloors'),
                    // Clear heated floors RSI if selecting no
                    heatedFloorsRSI: value === 'no' ? '' : prev.heatedFloorsRSI
                }))}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select yes or no" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.hasInFloorHeat9365 === "yes" && <WarningButton warningId="inFloorHeating-9365-info" title="ℹ️ In-Floor Heating Requirements">
                <p className="text-xs text-white">
                    Since the house has in-floor heating, all floors must be insulated to meet NBC requirements.
                </p>
            </WarningButton>}

            {selections.floorsSlabsSelected.includes("floorsUnheated") && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                <Input type="text" placeholder="Enter insulation type &/or RSI/R-value, or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsUnheatedRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>}

            {selections.floorsSlabsSelected.includes("floorsGarage") && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Floors above Garages</label>
                <Input type="text" placeholder="Enter insulation type &/or RSI/R-value, or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsGarageRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>}

            {selections.floorsSlabsSelected.includes("unheatedBelowFrost") && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Unheated Floor Below Frost Line</label>
                <Input type="text" placeholder="Enter RSI value or 'uninsulated'" value={selections.unheatedFloorBelowFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorBelowFrostRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>}

            {selections.floorsSlabsSelected.includes("unheatedAboveFrost") && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Unheated Floor Above Frost Line</label>
                <Input type="text" placeholder='Enter insulation type & R-value (e.g., 2" XPS or R10 Rigid), or N/A' value={selections.unheatedFloorAboveFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorAboveFrostRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>}

            {selections.floorsSlabsSelected.includes("heatedFloors") && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Heated Floors</label>
                <Input type="text" placeholder='Enter insulation type & R-value (e.g., 2" XPS or R10 Rigid)' value={selections.heatedFloorsRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatedFloorsRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                <WarningButton warningId="heatedFloorsRSI-hydronic-9365" title="⚠️ Hydronic Floor Insulation Required">
                    <p className="text-xs text-white space-y-2">
                        Hydronic floors must be insulated to prevent heat loss to the ground or unheated areas below. The insulation should be installed between the heated floor and any unheated space, with proper vapor barrier placement. Minimum insulation values vary by province and specific application - consult local building codes and your mechanical designer for specific requirements.
                    </p>
                </WarningButton>
            </div>}

            {selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting") && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Slab on grade with integral Footing</label>
                <Input type="text" placeholder="Enter insulation type &/or R-value, or N/A" value={selections.slabOnGradeIntegralFootingRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    slabOnGradeIntegralFootingRSI: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>}

            {/* Window Schedule Upload */}
            <div className="space-y-4 p-4 bg-red-50/50 border border-red-200 rounded-lg">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Upload window/door schedule from your supplier e.g., "All Weather, Plygem, etc."</label>
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
                            className="file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Accepted formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG
                    </p>
                    <p className="text-xs text-white font-medium">
                        You're welcome to upload documents later, but please be aware this may cause delays.
                    </p>
                </div>

                {uploadedFiles.length > 0 && <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</span>
                    </div>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center space-x-2">
                                <Info className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-800">{file.name}</span>
                                <span className="text-xs text-green-600">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeFile(file)} className="h-6 w-6 p-0 text-green-600 hover:text-red-600">
                                ×
                            </Button>
                        </div>)}
                    </div>
                </div>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Do you have skylights?</label>
                <Select value={selections.hasSkylights} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasSkylights: value
                }))}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>

                {selections.hasSkylights === "yes" && <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Skylight U-Value</label>
                    <Input type="text" placeholder="Enter U-Value (W/(m²·K))" value={selections.skylightUValue || ""} onChange={e => setSelections(prev => ({
                        ...prev,
                        skylightUValue: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                </div>}
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-100">Airtightness Level</label>
                    <InfoButton title="What's a Blower Door Test?">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                            </div>

                            <div className="w-full h-px bg-muted"></div>

                            <div className="space-y-4">
                                <div>
                                    <h5 className="font-medium text-sm mb-2">What Do the Numbers Mean?</h5>
                                    <div className="space-y-3 text-sm text-muted-foreground">
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
                                    <h5 className="font-medium text-sm mb-2">What's a Zone?</h5>
                                    <p className="text-sm text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                    <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                        <p>• A full detached house</p>
                                        <p>• A single unit in a row house or duplex</p>
                                        <p>• A section of a large home or multi-unit building</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                </div>

                                <div className="w-full h-px bg-muted"></div>

                                <div>
                                    <h5 className="font-medium text-sm mb-2">What's an Attached Zone?</h5>
                                    <p className="text-sm text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                </div>

                                <div className="w-full h-px bg-muted"></div>

                                <div>
                                    <h5 className="font-medium text-sm mb-2">Why Small Units Often Show Higher Leakage</h5>
                                    <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                        <p>• Small homes have more corners and connections relative to their size.</p>
                                        <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                        <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-muted"></div>

                                <div>
                                    <h5 className="font-medium text-sm mb-2">Guarded vs. Unguarded Testing</h5>
                                    <div className="space-y-3 text-sm text-muted-foreground">
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
                                                <p>• All adjacent units are depressurized at the same time.</p>
                                                <p>• Blocks airflow between units, giving a more accurate picture of leakage to the outside.</p>
                                                <p>• Ideal for multi-unit buildings, but more complex.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-muted"></div>

                                <div>
                                    <h5 className="font-medium text-sm mb-2">How Do You Pass?</h5>
                                    <p className="text-sm text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                    <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                        <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                        <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                </div>

                                <div className="w-full h-px bg-muted"></div>

                                <div>
                                    <h5 className="font-medium text-sm mb-2">Other Key Points</h5>
                                    <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                        <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                        <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                        <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different. Reference the Illustrated Guide for the image above.</p>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-muted"></div>

                                <div>
                                    <h5 className="font-medium text-sm mb-2">Potential Air Leakage Locations</h5>
                                    <p className="text-sm text-muted-foreground mb-3">Common areas where air leakage occurs in buildings:</p>
                                    <div className="mb-3">
                                        <img src="/lovable-uploads/9d231144-3c4e-430b-9f8c-914698eae23e.png" alt="Figure 9.25-9 Potential air leakage locations in a house showing various points where air can escape including joints at attic hatches, ceiling light fixtures, windows, electrical outlets, around posts and columns, chimney leaks, plumbing stack penetrations, and more" className="w-full h-auto border border-border rounded" onLoad={() => console.log('Air leakage diagram loaded successfully')} onError={e => console.log('Failed to load air leakage diagram:', e)} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Figure 9.25-9 from Housing and Small Buildings - Illustrated User's Guide, National Building Code of Canada 2020, Part 9 of Division B
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                    <p className="text-xs font-medium text-blue-800">📋 Helpful Resources:</p>
                                    <div className="space-y-1">
                                        <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300/80">
                                            View the Blower Door Checklist
                                        </a>
                                        <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                            More airtightness information
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
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />

                <WarningButton warningId="airtightness-caution-9365" title="⚠️ Caution: Air-Tightness Targets Without Testing History">
                    <div className="text-xs text-white space-y-2">
                        <p>
                            Choosing an air-tightness target lower than prescribed by NBC2020 without prior test results is risky.
                        </p>
                        <p>
                            We strongly recommend having at least 4–5 blower door tests from similar builds to know what levels you can reliably achieve.
                        </p>
                        <p>
                            If your final blower door test doesn't meet the target you've claimed, you could:
                        </p>
                        <ul className="list-disc ml-4 space-y-1">
                            <li>Miss required performance metrics</li>
                            <li>Be denied a permit or occupancy</li>
                            <li>Face expensive late-stage upgrades or rework</li>
                        </ul>
                        <p>
                            <strong>Good news:</strong> We track airtightness results across all projects so we can help you set realistic targets, reduce build costs, and optimize performance from day one.
                        </p>
                        <div className="flex items-center gap-1 text-sm mt-3">
                            <span>🔗</span>
                            <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300/80">
                                More information
                            </a>
                        </div>
                    </div>
                </WarningButton>

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
                        <Alert variant="destructive" style={{ backgroundColor: 'beige' }}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Blower Door Test Required</AlertTitle>
                            <AlertDescription>
                                You've selected an air leakage rate below {thresholdText} ACH@50pa. A blower door test is required prior to occupancy to verify this result.
                            </AlertDescription>
                        </Alert>
                    ) : null;
                })()}

                {/* Mid-Construction Blower Door Test Checkbox */}
                <div className="space-y-3 pt-4 border-t border-border/20">
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
                        className="ml-2 text-sm font-medium cursor-pointer text-slate-100"
                    >
                        Mid-Construction Blower Door Test Planned
                    </label>

                    <WarningButton warningId="mid-construction-blower-door-info-9367-3" title="ℹ️ Benefits of Mid-Construction Blower Door Testing">
                        <div className="text-xs text-white space-y-2">
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
                                <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300/80">
                                    View the Blower Door Checklist
                                </a>
                            </div>
                        </div>
                    </WarningButton>
                </div>
            </div>

            {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Water Heater Type</label>
                    <Select value={selections.waterHeaterType} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        waterHeaterType: value
                    }))}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                            <SelectValue placeholder="Select water heater type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="gas">Gas</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Water Heater</label>
                    <Input type="text" placeholder="Enter Water Heater Make/Model" value={selections.waterHeater} onChange={e => setSelections(prev => ({
                        ...prev,
                        waterHeater: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                </div>
            </>}

            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-100">Is a drain water heat recovery system being installed?</label>
                    <InfoButton title="Drain Water Heat Recovery System Information">
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h4 className="font-medium text-sm">ℹ️ Drain Water Heat Recovery (DWHR)</h4>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    DWHR systems capture heat from shower drain water and use it to preheat incoming cold water, reducing hot water energy use by 20–40%.
                                </p>

                                <div className="space-y-2">
                                    <h5 className="font-medium text-sm">How it works:</h5>
                                    <p className="text-sm text-muted-foreground">When hot water goes down the drain (like from a shower), the DWHR unit uses a heat exchanger to transfer that thermal energy to the incoming cold water supply before it reaches your water heater.</p>
                                </div>

                                <div className="space-y-2">
                                    <h5 className="font-medium text-sm">Benefits:</h5>
                                    <div className="text-sm text-muted-foreground space-y-1">
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
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select yes or no" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Heating Type</label>
                <Select value={selections.heatingType} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    heatingType: value
                }))}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select heating type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="furnace">Furnace</SelectItem>
                        <SelectItem value="boiler">Boiler</SelectItem>
                        <SelectItem value="heat-pump">Heat Pump</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>

                <WarningButton warningId="mechanical-equipment-docs-9365" title="⚠️ Mechanical Equipment Documentation">
                    <div className="text-xs text-white space-y-2">
                        <p>
                            The Authority Having Jurisdiction (AHJ) may request specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations.
                        </p>
                        <p>
                            <strong>F280 calculations:</strong> A heating and cooling load calculation based on CSA Standard F280-12 (or updated versions), which is the Canadian standard for determining how much heating or cooling a home needs. It accounts for factors like insulation levels, windows, air leakage, and local climate.
                        </p>
                        <p>
                            <strong>Benefits:</strong> Ensures HVAC systems are properly sized, improves comfort and efficiency, reduces energy costs, and is often required for building permits.
                        </p>
                        <div className="flex items-center gap-1 text-sm mt-3">
                            <span>🔗</span>
                            <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-yellow-300/80">
                                More information
                            </a>
                        </div>
                    </div>
                </WarningButton>
            </div>

            {selections.heatingType && <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">
                    {selections.heatingType === 'furnace' ? 'Furnace' : selections.heatingType === 'boiler' ? 'Boiler' : selections.heatingType === 'heat-pump' ? 'Heat Pump' : 'Heating Efficiency'}
                </label>
                <Input type="text" placeholder={selections.heatingType === 'furnace' ? "Enter Furnace Make/Model" : selections.heatingType === 'boiler' ? "Enter Boiler Make/Model" : selections.heatingType === 'heat-pump' ? "Enter Heat Pump Make/Model" : "Enter heating equipment make/model"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingEfficiency: e.target.value
                }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
            </div>}

            {selections.heatingType === 'boiler' && <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Are you installing an indirect tank?</label>
                    <Select value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        indirectTank: value
                    }))}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                            <SelectValue placeholder="Select if installing indirect tank" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selections.indirectTank === 'yes' && <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Indirect tank size (gallons)</label>
                    <Input type="number" placeholder="Enter tank size in gallons" value={selections.indirectTankSize} onChange={e => setSelections(prev => ({
                        ...prev,
                        indirectTankSize: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                </div>}
            </div>}

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Are you installing cooling/air conditioning?</label>
                <Select value={selections.coolingApplicable} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    coolingApplicable: value
                }))}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select if cooling is applicable" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selections.coolingApplicable === "yes" && <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Cooling System Make/Model</label>
                    <Input type="text" value={selections.coolingMakeModel} onChange={e => setSelections(prev => ({
                        ...prev,
                        coolingMakeModel: e.target.value
                    }))} placeholder="Enter cooling system make and model" className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                </div>
            </div>}

            {/* Secondary Suite HRV - Show for buildings with multiple units */}
            {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                <h5 className="font-medium text-foreground">Secondary Suite HRV/ERV</h5>

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-100">Will there be a second HRV/ERV for the secondary suite?</label>
                        <InfoButton title="Secondary Suite HRV/ERV Information">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Independent HRV/ERV for Secondary Suite</h4>
                                    <p className="text-xs text-muted-foreground">
                                        A secondary suite may require its own HRV/ERV system to ensure adequate ventilation and maintain indoor air quality independently from the main dwelling unit.
                                    </p>
                                </div>

                                <div>
                                    <h5 className="font-medium text-sm mb-1">When a second HRV/ERV is needed:</h5>
                                    <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                        <li><strong>Separate ventilation zones:</strong> When the secondary suite requires independent air quality control.</li>
                                        <li><strong>Building code requirements:</strong> Some jurisdictions require separate ventilation systems for secondary suites.</li>
                                        <li><strong>Different occupancy patterns:</strong> When main and secondary units have different ventilation needs.</li>
                                        <li><strong>Privacy and control:</strong> Allowing tenants to control their own indoor air quality.</li>
                                    </ul>
                                </div>
                            </div>
                        </InfoButton>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasSecondaryHrv" value="yes" checked={selections.hasSecondaryHrv === "yes"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHrv: e.target.value,
                                secondaryHrvEfficiency: "" // Reset when changing
                            }))} className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-slate-100">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="hasSecondaryHrv" value="no" checked={selections.hasSecondaryHrv === "no"} onChange={e => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHrv: e.target.value,
                                secondaryHrvEfficiency: ""
                            }))} className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-slate-100">No</span>
                        </label>
                    </div>
                </div>

                {selections.hasSecondaryHrv === "yes" && <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100">Secondary Suite HRV/ERV Efficiency</label>
                    <Input type="text" placeholder="Input HRV/ERV efficiency (e.g. SRE 65%)" value={selections.secondaryHrvEfficiency || ""} onChange={e => setSelections(prev => ({
                        ...prev,
                        secondaryHrvEfficiency: e.target.value
                    }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                </div>}
            </div>}
        </>
    );
}