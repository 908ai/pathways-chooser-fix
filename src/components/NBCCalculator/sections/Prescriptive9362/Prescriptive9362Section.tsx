import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

import { isSet, getEnvelopeKeys, getMechanicalKeys } from "./helpers";
import { EnvelopeSection } from "./components/EnvelopeSection";
import { MechanicalSection } from "./components/MechanicalSection";

export default function Prescriptive9362Section({
    selections,
    setSelections,
    validationErrors,
    showMissingFields = false,
}: {
    selections: any;
    setSelections: any;
    validationErrors: Record<string, boolean>;
    showMissingFields?: boolean;
}) {
    useEffect(() => {
        let targetAirtightness = "";
        if (selections.province === "saskatchewan") {
            targetAirtightness = "3.2";
        } else if (selections.province === "alberta") {
            if (selections.buildingType === "multi-unit") {
                targetAirtightness = "3.0";
            } else if (selections.buildingType) {
                targetAirtightness = "2.5";
            }
        }

        if (targetAirtightness && selections.airtightness !== targetAirtightness) {
            setSelections((prev: any) => ({
                ...prev,
                airtightness: targetAirtightness,
            }));
        }
    }, [selections.province, selections.buildingType, selections.airtightness, setSelections]);

    useEffect(() => {
        if (selections.heatingType === "boiler" && selections.indirectTank === "yes") {
            if (selections.waterHeaterType !== "boiler") {
                setSelections((prev: any) => ({ ...prev, waterHeaterType: "boiler" }));
            }
        }
    }, [selections.heatingType, selections.indirectTank, selections.waterHeaterType, setSelections]);

    useEffect(() => {
        if (selections.secondaryHeatingType === "boiler" && selections.secondaryIndirectTank === "yes") {
            if (selections.secondaryWaterHeaterType !== "boiler") {
                setSelections((prev: any) => ({ ...prev, secondaryWaterHeaterType: "boiler" }));
            }
        }
    }, [selections.secondaryHeatingType, selections.secondaryIndirectTank, selections.secondaryWaterHeaterType, setSelections]);

    const isWaterHeaterBoiler = selections.heatingType === "boiler" && selections.indirectTank === "yes";
    const isSecondaryWaterHeaterBoiler = selections.secondaryHeatingType === "boiler" && selections.secondaryIndirectTank === "yes";

    const maxUValue = selections.province === "alberta" && selections.climateZone === "7B" ? 2.41 : 2.75;

    // Accordion state
    const [openSections, setOpenSections] = useState<string[]>([]);

    const isMissing = (key: string) => showMissingFields && !isSet(selections[key]);
    const missingFieldClass = "border-red-400 bg-red-50 focus-visible:ring-red-500";

    const isComplete = (key: string) => {
        const val = selections[key];
        return isSet(val) && !validationErrors[key];
    };

    const isF280RequiredCity = ["red deer", "innisfail"].includes((selections?.city || "").toLowerCase().trim());

    useEffect(() => {
        if (!isF280RequiredCity && selections.hasF280Calculation) {
            setSelections((prev: any) => ({ ...prev, hasF280Calculation: "" }));
        }
    }, [isF280RequiredCity, selections.hasF280Calculation, setSelections]);

    const envelopeKeys = getEnvelopeKeys(selections);
    const mechanicalKeys = getMechanicalKeys(selections, isF280RequiredCity);

    const envelopeCompleted = envelopeKeys.filter(isComplete).length;
    const mechanicalCompleted = mechanicalKeys.filter(isComplete).length;

    const hasMissingEnvelope = envelopeKeys.some((key) => !isComplete(key));
    const hasMissingMechanical = mechanicalKeys.some((key) => !isComplete(key));

    useEffect(() => {
        if (showMissingFields) {
            const newOpenSections: string[] = [];
            if (hasMissingEnvelope) newOpenSections.push("envelope");
            if (hasMissingMechanical) newOpenSections.push("mechanical");

            if (newOpenSections.length > 0) {
                setOpenSections((prev) => {
                    const unique = Array.from(new Set([...prev, ...newOpenSections]));
                    return unique.length !== prev.length ? unique : prev;
                });
            }
        }
    }, [showMissingFields, hasMissingEnvelope, hasMissingMechanical]);

    return (
        <div className="space-y-3">
            <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" className="text-sm px-2" onClick={() => setOpenSections(["envelope", "mechanical"])}>
                    Expand All
                </Button>
                <Button variant="outline" size="sm" className="text-sm px-2" onClick={() => setOpenSections([])}>
                    Collapse All
                </Button>
            </div>

            <Accordion
                type="multiple"
                value={openSections}
                onValueChange={(val: string[] | string) => setOpenSections(Array.isArray(val) ? val : [])}
                className="border rounded-md"
            >
                <AccordionItem value="envelope">
                    <AccordionTrigger className={cn("px-4", showMissingFields && hasMissingEnvelope ? "bg-red-50 text-red-900" : "")}>
                        <div className="flex w-full items-center justify-between">
                            <span className="text-base flex items-center gap-2">
                                Building Envelope
                                {showMissingFields && hasMissingEnvelope && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            </span>
                            <Badge variant={showMissingFields && hasMissingEnvelope ? "destructive" : "secondary"}>
                                {envelopeCompleted} / {envelopeKeys.length} completed
                            </Badge>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pt-4">
                        <EnvelopeSection
                            selections={selections}
                            setSelections={setSelections}
                            validationErrors={validationErrors}
                            showMissingFields={showMissingFields}
                            isMissing={isMissing}
                            missingFieldClass={missingFieldClass}
                            maxUValue={maxUValue}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mechanical">
                    <AccordionTrigger className={cn("px-4", showMissingFields && hasMissingMechanical ? "bg-red-50 text-red-900" : "")}>
                        <div className="flex w-full items-center justify-between">
                            <span className="text-base flex items-center gap-2">
                                Mechanical Systems
                                {showMissingFields && hasMissingMechanical && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            </span>
                            <Badge variant={showMissingFields && hasMissingMechanical ? "destructive" : "secondary"}>
                                {mechanicalCompleted} / {mechanicalKeys.length} completed
                            </Badge>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pt-4">
                        <MechanicalSection
                            selections={selections}
                            setSelections={setSelections}
                            validationErrors={validationErrors}
                            showMissingFields={showMissingFields}
                            isMissing={isMissing}
                            missingFieldClass={missingFieldClass}
                            isF280RequiredCity={isF280RequiredCity}
                            isWaterHeaterBoiler={isWaterHeaterBoiler}
                            isSecondaryWaterHeaterBoiler={isSecondaryWaterHeaterBoiler}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}