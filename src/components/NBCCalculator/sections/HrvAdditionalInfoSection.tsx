import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfoButton from "@/components/InfoButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Props {
    selections: any;
    setSelections: React.Dispatch<React.SetStateAction<any>>;
}

const HrvAdditionalInfoSection: React.FC<Props> = ({ selections, setSelections }) => {
    const InfoCollapsible = ({
        title,
        children,
        variant = "warning",
    }: {
        title: string;
        children: React.ReactNode;
        variant?: "warning" | "destructive";
    }) => {
        const [isOpen, setIsOpen] = useState(true);
        const bgColor =
            variant === "warning"
                ? "bg-gradient-to-r from-slate-800/60 to-teal-800/60"
                : "bg-gradient-to-r from-slate-800/60 to-red-800/60";
        const borderColor =
            variant === "warning"
                ? "border border-orange-400"
                : "border-2 border-red-400";

        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className={`p-2 ${bgColor} ${borderColor} rounded-lg backdrop-blur-sm`}>
                <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
                    <span className="text-xs font-bold text-white">{title}</span>
                    <ChevronDown className={`h-5 w-5 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                    <div className="text-white text-xs">{children}</div>
                </CollapsibleContent>
            </Collapsible>
        );
    };

    const certifications = [
        {
            id: "energuide",
            label: "EnerGuide",
            imageUrl: "/lovable-uploads/7eafc507-a263-4914-a980-9adb84046e56.png",
            url: "https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/energuide-rated-new-homes",
            description: "Official home energy rating system for Canada"
        },
        {
            id: "chba-net-zero",
            label: "CHBA Net Zero",
            imageUrl: "/lovable-uploads/1aa4ac59-9662-45fa-8013-06a725025afa.png",
            url: "https://www.chba.ca/net-zero/",
            description: "Canadian Home Builders' Association Net Zero certification"
        },
        {
            id: "built-green",
            label: "Built Green",
            imageUrl: "/lovable-uploads/ccb67952-2457-4aeb-806a-e595f87d6fe0.png",
            url: "https://builtgreencanada.ca",
            description: "National green building certification program"
        },
        {
            id: "energy-star",
            label: "ENERGY STAR",
            imageUrl: "/lovable-uploads/4e1d3921-9d37-4dfa-85a3-8db2e13d50fb.png",
            url: "https://natural-resources.canada.ca/energy-efficiency/energy-star/new-homes",
            description: "High-efficiency homes certification"
        },
        ...(selections.province === "saskatchewan" ? [{
            id: "sask-energy-beyond-codes",
            label: "SaskEnergy Beyond Codes Rebate",
            imageUrl: "/lovable-uploads/d890e038-24fc-4885-a732-d0055f89ff2e.png",
            url: "https://www.saskenergy.com/homes-beyond-code-program",
            description: "Saskatchewan-specific energy efficiency rebate program"
        }] : []),
        {
            id: "solar-ready",
            label: "Solar Ready",
            imageUrl: "/lovable-uploads/solar-ready-sun-bw.png",
            url: "https://natural-resources.canada.ca/sites/nrcan/files/canmetenergy/files/pubs/SolarReadyGuidelines_en.pdf",
            description: "Home design prepared for future solar panel installation"
        }
    ];

    return (
        <>
            {
                <div className="pt-6 border-t border-slate-600 space-y-6">
                    <h3 className="text-lg font-semibold text-white">HRV/ERV Information</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-slate-100">Does this building include an HRV or ERV?</label>
                            <InfoButton title="Should I include an HRV (Heat Recovery Ventilator)?">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Should I include an HRV (Heat Recovery Ventilator)?</h4>
                                        <p className="text-xs text-muted-foreground">
                                            An HRV is a system that brings in fresh outdoor air while recovering heat from the stale indoor air it exhausts. It improves indoor air quality and energy efficiency — especially in airtight homes.
                                        </p>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-1">Why you should consider an HRV:</h5>
                                        <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                            <li><strong>Better indoor air quality:</strong> Removes stale air, moisture, odors, and pollutants while bringing in fresh air.</li>
                                            <li><strong>Energy savings:</strong> Recovery up to 80-90% of the heat from outgoing air, reducing heating costs.</li>
                                            <li><strong>Comfort:</strong> Maintains consistent temperatures and humidity levels throughout your home.</li>
                                            <li><strong>Code compliance:</strong> In many cases, an HRV can help you meet building envelope requirements with less insulation.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-1">When is an HRV required?</h5>
                                        <p className="text-xs text-muted-foreground">
                                            While not always mandatory, HRVs are required or strongly recommended for homes with very low air leakage rates (typically below 2.5 ACH50) to ensure adequate ventilation. They're also required for certain energy efficiency programs.
                                        </p>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-sm mb-1">HRV vs. ERV:</h5>
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <p><strong>HRV (Heat Recovery Ventilator):</strong> Recovers heat only. Best for cold, dry climates like most of Canada.</p>
                                            <p><strong>ERV (Energy Recovery Ventilator):</strong> Recovers both heat and moisture. Better for humid climates or homes with high humidity issues.</p>
                                        </div>
                                    </div>
                                </div>
                            </InfoButton>
                        </div>
                        <Select value={selections.hasHrv} onValueChange={value => setSelections(prev => ({
                            ...prev,
                            hasHrv: value
                        }))}>
                            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                                <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="with_hrv">Yes - with HRV/ERV</SelectItem>
                                <SelectItem value="without_hrv">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selections.hasHrv === "with_hrv" && <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-100">HRV/ERV Make/Model</label>
                        <Input type="text" placeholder="Input HRV/ERV make/model (e.g. Fantech SHR 1504)" value={selections.hrvEfficiency || ""} onChange={e => setSelections(prev => ({
                            ...prev,
                            hrvEfficiency: e.target.value
                        }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                    </div>}

                    {/* Secondary Suite HRV - Show for buildings with multiple units */}
                    {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && <div className="space-y-4 p-4 bg-slate-900/50 border border-slate-600 rounded-md">
                        <h5 className="font-medium text-white">Secondary Suite HRV/ERV</h5>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-slate-100">Will there be a second HRV/ERV for the secondary suite?</label>
                                <InfoButton title="Secondary Suite HRV/ERV Information">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-sm mb-2">Secondary Suite HRV/ERV Options</h4>
                                            <p className="text-xs text-muted-foreground">
                                                For buildings with secondary suites, you have options for ventilation systems.
                                            </p>
                                        </div>

                                        <div>
                                            <h5 className="font-medium text-sm mb-1">Option 1: Shared System</h5>
                                            <p className="text-xs text-muted-foreground">
                                                Use one larger HRV/ERV system to serve both the main dwelling and secondary suite, with proper ducting and controls.
                                            </p>
                                        </div>

                                        <div>
                                            <h5 className="font-medium text-sm mb-1">Option 2: Separate Systems</h5>
                                            <p className="text-xs text-muted-foreground">
                                                Install separate HRV/ERV systems for each unit to provide independent control and operation.
                                            </p>
                                        </div>
                                    </div>
                                </InfoButton>
                            </div>
                            <Select value={selections.hasSecondaryHrv} onValueChange={value => setSelections(prev => ({
                                ...prev,
                                hasSecondaryHrv: value
                            }))}>
                                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400">
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="shared">Shared system (one HRV/ERV for both units)</SelectItem>
                                    <SelectItem value="separate">Separate HRV/ERV for secondary suite</SelectItem>
                                    <SelectItem value="none">No secondary HRV/ERV</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selections.hasSecondaryHrv === "separate" && <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-100">Secondary Suite HRV/ERV Make/Model</label>
                            <Input type="text" placeholder="Input secondary HRV/ERV make/model" value={selections.secondaryHrvEfficiency || ""} onChange={e => setSelections(prev => ({
                                ...prev,
                                secondaryHrvEfficiency: e.target.value
                            }))} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-teal-400" />
                        </div>}
                    </div>}

                    {/* MURB/Secondary Suite Mechanical Systems Warning */}
                    {(selections.buildingType === "multi-unit" || selections.buildingType === "single-detached-secondary") && <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-orange-600 text-lg">⚠️</span>
                            <div className="space-y-2">
                                <h4 className="font-medium text-orange-800">MURB/Secondary Suite Mechanical Systems</h4>
                                <p className="text-sm text-orange-700">
                                    For {selections.buildingType === "multi-unit" ? "multi-unit residential buildings (MURBs)" : "homes with secondary suites"},
                                    please ensure you list all mechanical system types, make/models, and any other relevant information
                                    in the comments section below. This includes:
                                </p>
                                <ul className="list-disc ml-4 text-sm text-orange-700 space-y-1">
                                    <li>Secondary heating system type and make/model (if applicable)</li>
                                    <li>Secondary/multiple service water heating systems</li>
                                    <li>Secondary HRV/ERV systems</li>
                                    <li>Any additional heating equipment specifications</li>
                                    <li>Special installation requirements or configurations</li>
                                    <li>Zone-specific heating arrangements</li>
                                </ul>
                            </div>
                        </div>
                    </div>}

                    {/* Certification Interests */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-100">Are you interested in any of the following certifications or programs?</label>
                            <InfoButton title="Certification Information">
                                <div className="space-y-6 text-sm">
                                    {/* Summary Table */}
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <h3 className="font-semibold text-base mb-4">Summary Table: Benefits at a Glance</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-2 pr-4 font-medium">Program / Feature</th>
                                                        <th className="text-left py-2 pr-4 font-medium">Homeowner Benefit</th>
                                                        <th className="text-left py-2 font-medium">Builder Benefit</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="space-y-2">
                                                    <tr className="border-b border-muted">
                                                        <td className="py-2 pr-4 font-medium">EnerGuide (GJ/year)</td>
                                                        <td className="py-2 pr-4">Understand energy use, access rebates, improve efficiency</td>
                                                        <td className="py-2">Required for performance path, supports other certifications</td>
                                                    </tr>
                                                    <tr className="border-b border-muted">
                                                        <td className="py-2 pr-4 font-medium">Net Zero / NZ Ready</td>
                                                        <td className="py-2 pr-4">Energy independence, comfort, resale value</td>
                                                        <td className="py-2">Market leadership, premium product, support clean energy goals</td>
                                                    </tr>
                                                    <tr className="border-b border-muted">
                                                        <td className="py-2 pr-4 font-medium">Built Green</td>
                                                        <td className="py-2 pr-4">Healthier, more durable, environmentally friendly home</td>
                                                        <td className="py-2">Flexible tiers, environmental branding</td>
                                                    </tr>
                                                    <tr className="border-b border-muted">
                                                        <td className="py-2 pr-4 font-medium">ENERGY STAR</td>
                                                        <td className="py-2 pr-4">Lower bills, trusted label, better comfort</td>
                                                        <td className="py-2">Simple compliance path, public recognition</td>
                                                    </tr>
                                                    <tr className="border-b border-muted">
                                                        <td className="py-2 pr-4 font-medium">SaskEnergy Rebates</td>
                                                        <td className="py-2 pr-4">Reduces upfront upgrade costs</td>
                                                        <td className="py-2">Easier upsell of efficiency features</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 pr-4 font-medium">Solar-Ready Design</td>
                                                        <td className="py-2 pr-4">Prepares for low-cost solar install, supports $40K loan</td>
                                                        <td className="py-2">Low-cost upgrade, future-proofs builds</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-base mb-3">1. EnerGuide Certification (Natural Resources Canada)</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium">Homeowner Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Provides an energy rating in gigajoules per year (GJ/year)—the lower the number, the better.</li>
                                                    <li>Helps identify areas for improvement, lower utility costs, and enhance comfort.</li>
                                                    <li>A rating of 0 GJ/year indicates a Net Zero home that offsets 100% of its energy with renewables.</li>
                                                    <li>Required for many rebate programs and certifications like Net Zero and ENERGY STAR.</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Builder Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>A pathway for compliance under the performance path of the tiered energy code.</li>
                                                    <li>Establishes credibility and trust with homebuyers.</li>
                                                    <li>Provides the baseline to pursue ENERGY STAR, Net Zero, and Built Green certifications.</li>
                                                    <li>Supports marketing efforts and helps communicate the value of energy-efficient construction.</li>
                                                    <li>Third party certification provides validation of the performance of the home and how it was constructed with a final blower door test included.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-base mb-3">2. Net Zero and Net Zero Ready (CHBA)</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium">Homeowner Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Best-in-class energy efficiency: Net Zero homes produce as much energy as they use annually; Net Zero Ready homes are designed for future solar install.</li>
                                                    <li>Significantly lower utility bills and improved comfort, air quality, and noise reduction.</li>
                                                    <li>Highly durable and future-proof, with potential for higher resale value.</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Builder Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Positions the builder as a leader in high-performance, sustainable design.</li>
                                                    <li>Access to CHBA's Net Zero labeling and marketing resources.</li>
                                                    <li>Attracts forward-thinking buyers and increases profit margins through differentiated product offerings.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-base mb-3">3. Built Green Certification</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium">Homeowner Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Covers a broader spectrum than energy alone: materials, indoor air quality, water conservation, durability, and waste management.</li>
                                                    <li>Results in healthier, more comfortable homes with long-term durability and reduced environmental impact.</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Builder Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Flexible, tiered system (Bronze to Platinum) allows phased adoption of sustainability goals.</li>
                                                    <li>Offers a recognized label for environmentally responsible building.</li>
                                                    <li>Aligns with evolving buyer values and regulatory trends.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-base mb-3">4. ENERGY STAR for New Homes</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium">Homeowner Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Homes are at least 20% more efficient than code-built homes.</li>
                                                    <li>Trusted government-backed label offering assurance of energy savings, comfort, and quieter operation.</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Builder Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Clear, prescriptive path to code-exceeding performance.</li>
                                                    <li>Helps qualify for rebates and incentives.</li>
                                                    <li>Widely recognized by buyers and lenders.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-base mb-3">5. SaskEnergy Residential Rebates</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium">Homeowner Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Helps lower the cost of upgrading to more efficient equipment, insulation, windows, and more (up to $9,000 in rebates).</li>
                                                    <li>Incentivizes high-performance construction and energy-saving retrofits.</li>
                                                    <li>May be stackable with federal programs (e.g., Canada Greener Homes).</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Builder Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Helps close the affordability gap for clients.</li>
                                                    <li>Makes upselling energy-efficient features more accessible and appealing.</li>
                                                    <li>Adds value without increasing construction costs significantly when planned early.</li>
                                                    <li>Up to $800 in rebates for builders</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-base mb-3">6. Building a Solar-Ready Home</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium">Homeowner Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Avoids costly retrofits later by pre-installing conduit, roof reinforcement, panel space, and breaker capacity.</li>
                                                    <li>Enables faster and more affordable future solar installations.</li>
                                                    <li>Adds resale value and aligns with Canada's Net Zero goals.</li>
                                                    <li>Canada Greener Homes Loan offers up to $40,000 interest-free for solar if the homeowner has occupied the home for at least 6 months: <a href="https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/canada-greener-homes-initiative/canada-greener-homes-loan" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Learn more and apply</a></li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Builder Benefits:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Inexpensive to incorporate during construction—highly valued by buyers and differentiates your home from the competition.</li>
                                                    <li>Supports Net Zero Ready certification and prepares homes for future incentives.</li>
                                                    <li>Enhances builder reputation in sustainability and long-term value creation.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </InfoButton>
                        </div>
                        <div className="space-y-3">
                            {certifications.map(cert => (
                                <div key={cert.id} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-600/50 transition-all hover:border-slate-500/80">
                                    <Checkbox
                                        id={cert.id}
                                        checked={selections.interestedCertifications.includes(cert.id)}
                                        onCheckedChange={(checked) => {
                                            setSelections(prev => ({
                                                ...prev,
                                                interestedCertifications: checked ? [...prev.interestedCertifications, cert.id] : prev.interestedCertifications.filter(id => id !== cert.id)
                                            }));
                                        }}
                                        className="h-6 w-6"
                                    />
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-shrink-0 w-28 h-14 flex items-center justify-center bg-white/5 rounded-md p-1">
                                            <img src={cert.imageUrl} alt={`${cert.label} Logo`} className="max-h-full max-w-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor={cert.id} className="font-semibold text-white cursor-pointer block">{cert.label}</label>
                                            <p className="text-sm text-slate-300">{cert.description}</p>
                                            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-300 hover:text-teal-200 underline mt-1 inline-block">
                                                Learn more →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alert for certification interests */}
                    {selections.interestedCertifications.length > 0 && <InfoCollapsible title="Performance Modelling Required">
                        <div className="text-xs text-white space-y-2">
                            <p>
                                Since you're interested in certifications, performance modelling (NBC 9.36.5 or 9.36.7) is required.
                                Performance modelling provides greater design flexibility, can reduce construction costs, and is often
                                required for certification programs. It also helps optimize your home's energy performance and ensures
                                you meet certification requirements efficiently.
                            </p>
                            <p className="font-medium">
                                Please note: Additional fees may be incurred for performance modelling services. A detailed estimate will be provided upon request.
                            </p>
                            <p className="font-medium">
                                Contact us to discuss how performance modelling can help achieve your certification goals.
                            </p>
                        </div>
                    </InfoCollapsible>}
                </div>
            }
        </>
    );
};

export default HrvAdditionalInfoSection;