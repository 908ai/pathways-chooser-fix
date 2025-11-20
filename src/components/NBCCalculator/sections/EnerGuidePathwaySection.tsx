import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import InfoButton from "@/components/InfoButton";

interface Props {
    selections: any;
    setSelections: React.Dispatch<React.SetStateAction<any>>;
}

const EnerGuidePathwaySection: React.FC<Props> = ({ selections, setSelections }) => {
    return (
        <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px] shadow-lg">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div id="energuidePathway" className="space-y-2">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-100">Would you like to pursue the EnerGuide Rating System (ERS) pathway in conjunction with the Performance Path?</label>
                            <InfoButton title="What is the EnerGuide Pathway?">
                                <div className="space-y-4">
                                    <div>
                                        <p>
                                            The EnerGuide pathway is one way to show that a new home meets energy efficiency requirements under Canada's building code (NBC 2020). Instead of following a strict checklist of materials and specs, this approach uses energy modelling to test how well a home will perform.
                                        </p>
                                    </div>

                                    {/* EnerGuide Label Image */}
                                    <div className="flex justify-center my-6">
                                        <img src="/lovable-uploads/41513243-46b5-48ef-bcf8-fe173a109b21.png" alt="The New EnerGuide Label - showing home energy performance rating and breakdown" className="max-w-full h-auto rounded-lg shadow-md" />
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-lg mb-3">How Does It Work?</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>A trained Energy Advisor creates a computer model of your home's design.</li>
                                            <li>That model is compared to a "reference house" built to basic code standards.</li>
                                            <li>If your design uses equal or less energy, it passes—even if you made different design choices than what's prescribed in the code.</li>
                                        </ul>
                                        <p className="mt-2">This means you have more freedom in how you build, as long as the home performs well overall.</p>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-lg mb-3">What's Involved?</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p>The advisor uses special software (usually HOT2000) to calculate things like:</p>
                                                <ul className="list-disc pl-5 space-y-1 mt-1">
                                                    <li>Energy use</li>
                                                    <li>Heat loss</li>
                                                    <li>Cooling needs</li>
                                                </ul>
                                            </div>
                                            <p>They also track airtightness with a blower door test to see how much air leaks out of the home.</p>
                                            <div>
                                                <p>You'll receive three key reports:</p>
                                                <ul className="list-disc pl-5 space-y-1 mt-1">
                                                    <li>Pre-construction report (submitted with your permit)</li>
                                                    <li>As-built report/label (shows what was actually built, submitted for occupancy)</li>
                                                    <li>A mid-construction report is optional.</li>
                                                </ul>
                                                <p className="mt-3 text-base">Note: There is an incremental cost for the final data collection & air-tightness test.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-lg mb-3">Who Does What?</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>Energy Advisor:</strong> Builds the model, runs tests, creates compliance documents.</li>
                                            <li><strong>Builder:</strong> Must build what's in the model and ensure it meets the code.</li>
                                            <li><strong>Building Official:</strong> Checks paperwork and inspects the home for compliance.</li>
                                        </ul>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-lg mb-3">Why Is Airtightness Important?</h3>
                                        <p>
                                            Airtight homes lose less heat and use less energy. In higher code tiers (like Tier 4 or 5), airtightness targets are mandatory and can't be traded off for other upgrades.
                                        </p>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-lg mb-3">How It Fits Into the Tiered Code</h3>
                                        <div className="space-y-2">
                                            <p>Canada's new energy code has tiers: the higher the tier, the more efficient the home. Builders can choose between:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>A prescriptive path (points-based, no energy modeling)</li>
                                                <li>A performance path (like ERS, which requires modeling)</li>
                                            </ul>
                                            <p>The EnerGuide path is part of the performance path. It's especially useful for builders wanting to reach higher energy tiers or qualify for rebates.</p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold text-lg mb-3">Bottom Line</h3>
                                        <p>
                                            The EnerGuide performance path is a flexible, model-based way to prove your new home is energy efficient. It's widely used, especially in places like Saskatchewan, where 90% of projects use this method—often because it's more adaptable, accurate, and rebate-friendly.
                                        </p>
                                    </div>
                                </div>
                            </InfoButton>
                        </div>
                        <Select value={selections.energuidePathway} onValueChange={value => setSelections(prev => ({
                            ...prev,
                            energuidePathway: value
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
                </div>
            </CardContent>
        </Card>
    );
};

export default EnerGuidePathwaySection;