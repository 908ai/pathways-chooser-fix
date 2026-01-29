import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import EnvelopeSection from "./components/EnvelopeSection";
import MechanicalSection from "./components/MechanicalSection";

import { missingFieldClass } from "./constants";
import { isSet, getIsF280RequiredCity, getEnvelopeKeys, getMechanicalKeys } from "./helpers";

export default function Performance9367Section({
    selections,
    setSelections,
    handleFileUploadRequest,
    uploadedFiles,
    removeFile,
    showMissingFields = false,
}: {
    selections: any;
    setSelections: any;
    handleFileUploadRequest: (file: File) => Promise<void>;
    uploadedFiles: File[];
    removeFile: (file: File) => void;
    showMissingFields?: boolean;
}) {
    // Local state for collapsible warnings
    const [expandedWarnings, setExpandedWarnings] = useState<{
        [key: string]: boolean;
    }>({});

    const [openSections, setOpenSections] = useState<string[]>([]);

    const toggleWarning = (warningId: string) => {
        setExpandedWarnings((prev) => ({
            ...prev,
            [warningId]: !prev[warningId],
        }));
    };

    const isHeatedFloorsChecked = selections.floorsSlabsSelected.includes("heatedFloors");
    const isUnheatedFloorChecked =
        selections.floorsSlabsSelected.includes("unheatedBelowFrost") ||
        selections.floorsSlabsSelected.includes("unheatedAboveFrost");
    const isSlabOnGradeChecked = selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting");

    const isMissing = (key: string) => {
        return showMissingFields && !isSet(selections[key]);
    };

    const isF280RequiredCity = getIsF280RequiredCity(selections?.city);

    useEffect(() => {
        if (!isF280RequiredCity && selections.hasF280Calculation) {
            setSelections((prev: any) => ({ ...prev, hasF280Calculation: "" }));
        }
    }, [isF280RequiredCity, selections.hasF280Calculation, setSelections]);

    const envelopeKeys = getEnvelopeKeys(selections);
    const mechanicalKeys = getMechanicalKeys(selections, isF280RequiredCity);

    // Count uploaded files as one completed item for envelope if any exist
    const envelopeCompleted =
        envelopeKeys.filter((key) => isSet(selections[key])).length + (uploadedFiles.length > 0 ? 1 : 0);
    const envelopeTotal = envelopeKeys.length + 1; // +1 for the file upload requirement

    const mechanicalCompleted = mechanicalKeys.filter((key) => isSet(selections[key])).length;

    const hasMissingEnvelope = envelopeKeys.some((key) => !isSet(selections[key])) || uploadedFiles.length === 0;
    const hasMissingMechanical = mechanicalKeys.some((key) => !isSet(selections[key]));

    useEffect(() => {
        if (showMissingFields) {
            const newOpenSections = [];
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
                <Button
                    variant="outline"
                    size="sm"
                    className="text-sm px-2"
                    onClick={() => setOpenSections(["envelope", "mechanical"])}
                >
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
                    <AccordionTrigger
                        className={cn("px-4", showMissingFields && hasMissingEnvelope ? "bg-red-50 text-red-900" : "")}
                    >
                        <div className="flex w-full items-center justify-between">
                            <span className="text-base flex items-center gap-2">
                                Building Envelope
                                {showMissingFields && hasMissingEnvelope && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            </span>
                            <Badge variant={showMissingFields && hasMissingEnvelope ? "destructive" : "secondary"}>
                                {envelopeCompleted} / {envelopeTotal} completed
                            </Badge>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pt-4">
                        <EnvelopeSection
                            selections={selections}
                            setSelections={setSelections}
                            handleFileUploadRequest={handleFileUploadRequest}
                            uploadedFiles={uploadedFiles}
                            removeFile={removeFile}
                            showMissingFields={showMissingFields}
                            isMissing={isMissing}
                            missingFieldClass={missingFieldClass}
                            isHeatedFloorsChecked={isHeatedFloorsChecked}
                            isUnheatedFloorChecked={isUnheatedFloorChecked}
                            isSlabOnGradeChecked={isSlabOnGradeChecked}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mechanical">
                    <AccordionTrigger
                        className={cn("px-4", showMissingFields && hasMissingMechanical ? "bg-red-50 text-red-900" : "")}
                    >
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
                            showMissingFields={showMissingFields}
                            isMissing={isMissing}
                            missingFieldClass={missingFieldClass}
                            mechanicalCompleted={mechanicalCompleted}
                            mechanicalKeys={mechanicalKeys}
                            isF280RequiredCity={isF280RequiredCity}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}