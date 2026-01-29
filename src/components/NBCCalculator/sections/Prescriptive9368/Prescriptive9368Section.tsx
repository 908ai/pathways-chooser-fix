import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, ChevronDown, Search, AlertTriangle } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

import { validateRSI, validateRSI_9362 } from "../../utils/validation";
import { EffectiveRSIWarning } from "@/components/NBCCalculator/components/EffectiveRSIWarning";

import {
    wallRSIOptions,
    windowUValueOptions,
    belowGradeRSIOptions,
    airtightnessOptions,
    hrvOptions,
    waterHeaterOptions,
    airtightnessOptions_7B
} from "../../../NBCCalculator/constants/options";

import EnvelopeSection from "./components/EnvelopeSection";
import MechanicalSection from "./components/MechanicalSection";

interface Props {
    selections: any;
    setSelections: React.Dispatch<React.SetStateAction<any>>;
    validationErrors: Record<string, boolean>;
    handleFileUploadRequest: (file: File) => Promise<void>;
    uploadedFiles: File[];
    removeFile: (file: File) => void;
    showMissingFields?: boolean;
}

export default function Prescriptive9368Section({
    selections,
    setSelections,
    validationErrors,
    handleFileUploadRequest,
    uploadedFiles,
    removeFile,
    showMissingFields = false,
}: Props) {

    const InfoCollapsible = ({
        title,
        children,
        variant = "warning",
        defaultOpen = false,
    }: {
        title: React.ReactNode;
        children: React.ReactNode;
        variant?: "warning" | "destructive";
        defaultOpen?: boolean;
    }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);

        return (
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className={cn(
                    "p-2 border rounded-lg",
                    variant === "warning"
                        ? "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-500/50"
                        : "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-500/50"
                )}
            >
                <CollapsibleTrigger className="flex items-center justify-between gap-3 w-full text-left group">
                    <span
                        className={cn(
                            "text-xs font-bold",
                            variant === "warning"
                                ? "text-orange-800 dark:text-orange-300"
                                : "text-red-800 dark:text-red-300"
                        )}
                    >
                        {title}
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            isOpen ? "rotate-180" : "",
                            variant === "warning"
                                ? "text-orange-700 dark:text-orange-400"
                                : "text-red-700 dark:text-red-400"
                        )}
                    />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                    <div
                        className={cn(
                            "text-xs",
                            variant === "warning"
                                ? "text-orange-700 dark:text-orange-300"
                                : "text-red-700 dark:text-red-300"
                        )}
                    >
                        {children}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        );
    };

    // --------------------------------------------------
    // 9368 requires HRV/ERV
    // --------------------------------------------------
    useEffect(() => {
        if (selections.compliancePath === "9368" && selections.hasHrv !== "with_hrv") {
            setSelections((prev: any) => ({
                ...prev,
                hasHrv: "with_hrv"
            }));
        }
    }, [selections.compliancePath]);

    const isF280RequiredCity =
        ["red deer", "innisfail"].includes((selections?.city || "").toLowerCase().trim());

    useEffect(() => {
        if (!isF280RequiredCity && selections.hasF280Calculation) {
            setSelections((prev: any) => ({
                ...prev,
                hasF280Calculation: ""
            }));
        }
    }, [isF280RequiredCity]);

    const getFilteredAirtightnessOptions = () => {
        const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
        const isSingleDetached =
            selections.buildingType === "single-detached" ||
            selections.buildingType === "single-detached-secondary";

        const baseOptions = isZone7B ? airtightnessOptions_7B : airtightnessOptions;

        if (isSingleDetached) {
            return baseOptions.filter(option => option.value.includes("B"));
        }

        return baseOptions;
    };

    const [openSections, setOpenSections] = useState<string[]>([]);

    const isSet = (value: any) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "string") return value.trim() !== "";
        if (typeof value === "boolean") return true;
        return value !== null && value !== undefined;
    };

    const isMissing = (key: string) => {
        return showMissingFields && !isSet(selections[key]);
    };

    const missingFieldClass = "border-red-400 bg-red-50 focus-visible:ring-red-500";

    const isComplete = (key: string) => {
        const val = selections[key];
        return isSet(val) && !validationErrors[key];
    };

    const getEnvelopeKeys = () => {
        const keys: string[] = [
            "ceilingsAtticRSI",
            "wallRSI",
            "belowGradeRSI",
            "windowUValue",
            "airtightness",
            "hasCathedralOrFlatRoof",
            "floorsUnheatedRSI",
            "floorsGarageRSI",
            "hasSlabOnGrade",
            "hasInFloorHeat",
            "hasSkylights",
        ];

        if (selections.hasCathedralOrFlatRoof === "yes") keys.push("cathedralFlatRSI");
        if (selections.hasSlabOnGrade === "yes") keys.push("slabOnGradeRSI");

        if (selections.hasInFloorHeat === "yes") {
            keys.push("heatedFloorsRSI");
            keys.push("floorsSlabsSelected");
            if (selections.floorsSlabsSelected?.includes("above-frost"))
                keys.push("unheatedFloorAboveFrostRSI");
            if (selections.floorsSlabsSelected?.includes("below-frost"))
                keys.push("unheatedFloorBelowFrostRSI");
        } else {
            keys.push("unheatedFloorAboveFrostRSI");
        }

        if (selections.hasSkylights === "yes") keys.push("skylightUValue");

        return keys;
    };

    const getMechanicalKeys = () => {
        const keys: string[] = [
            "hrvEfficiency",
            "waterHeater",
        ];

        if (isF280RequiredCity) keys.push("hasF280Calculation");

        if (
            selections.buildingType === "single-detached-secondary" ||
            selections.buildingType === "multi-unit"
        ) {
            keys.push("hasSecondaryHrv");
            if (selections.hasSecondaryHrv === "separate")
                keys.push("secondaryHrvEfficiency");
        }

        if (selections.buildingType === "multi-unit") {
            keys.push("hasMurbMultipleHeating");
            if (selections.hasMurbMultipleHeating === "yes") {
                keys.push("murbSecondHeatingType");
                keys.push("murbSecondHeatingEfficiency");
                if (selections.murbSecondHeatingType === "boiler") {
                    keys.push("murbSecondIndirectTank");
                    if (selections.murbSecondIndirectTank === "yes")
                        keys.push("murbSecondIndirectTankSize");
                }
            }

            keys.push("hasMurbMultipleWaterHeaters");
            if (selections.hasMurbMultipleWaterHeaters === "yes") {
                keys.push("murbSecondWaterHeaterType");
                keys.push("murbSecondWaterHeater");
            }
        }

        return keys;
    };

    const envelopeKeys = getEnvelopeKeys();
    const mechanicalKeys = getMechanicalKeys();

    const envelopeCompleted = envelopeKeys.filter(isComplete).length;
    const mechanicalCompleted = mechanicalKeys.filter(isComplete).length;

    const hasMissingEnvelope = envelopeKeys.some(key => !isComplete(key));
    const hasMissingMechanical = mechanicalKeys.some(key => !isComplete(key));

    useEffect(() => {
        if (showMissingFields) {
            const newOpenSections = [];
            if (hasMissingEnvelope) newOpenSections.push("envelope");
            if (hasMissingMechanical) newOpenSections.push("mechanical");

            if (newOpenSections.length > 0) {
                setOpenSections(prev => {
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
                <Button
                    variant="outline"
                    size="sm"
                    className="text-sm px-2"
                    onClick={() => setOpenSections([])}
                >
                    Collapse All
                </Button>
            </div>

            <Accordion
                type="multiple"
                value={openSections}
                onValueChange={(val: string[] | string) =>
                    setOpenSections(Array.isArray(val) ? val : [])
                }
                className="border rounded-md"
            >
                <AccordionItem value="envelope">
                    <AccordionTrigger
                        className={cn(
                            "px-4",
                            showMissingFields && hasMissingEnvelope
                                ? "bg-red-50 text-red-900"
                                : ""
                        )}
                    >
                        <div className="flex w-full items-center justify-between">
                            <span className="text-base flex items-center gap-2">
                                Building Envelope
                                {showMissingFields && hasMissingEnvelope && (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                )}
                            </span>
                            <Badge
                                variant={
                                    showMissingFields && hasMissingEnvelope
                                        ? "destructive"
                                        : "secondary"
                                }
                            >
                                {envelopeCompleted} / {envelopeKeys.length} completed
                            </Badge>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 py-4">
                        <EnvelopeSection
                            selections={selections}
                            setSelections={setSelections}
                            validationErrors={validationErrors}
                            showMissingFields={showMissingFields}
                            hasMissingEnvelope={hasMissingEnvelope}
                            envelopeCompleted={envelopeCompleted}
                            envelopeKeys={envelopeKeys}
                            isMissing={isMissing}
                            missingFieldClass={missingFieldClass}
                            InfoCollapsible={InfoCollapsible}
                            getFilteredAirtightnessOptions={getFilteredAirtightnessOptions}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mechanical">
                    <AccordionTrigger
                        className={cn(
                            "px-4",
                            showMissingFields && hasMissingMechanical
                                ? "bg-red-50 text-red-900"
                                : ""
                        )}
                    >
                        <div className="flex w-full items-center justify-between">
                            <span className="text-base flex items-center gap-2">
                                Mechanical Systems
                                {showMissingFields && hasMissingMechanical && (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                )}
                            </span>
                            <Badge
                                variant={
                                    showMissingFields && hasMissingMechanical
                                        ? "destructive"
                                        : "secondary"
                                }
                            >
                                {mechanicalCompleted} / {mechanicalKeys.length} completed
                            </Badge>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 py-4">
                        <MechanicalSection
                            selections={selections}
                            setSelections={setSelections}
                            validationErrors={validationErrors}
                            showMissingFields={showMissingFields}
                            hasMissingMechanical={hasMissingMechanical}
                            mechanicalCompleted={mechanicalCompleted}
                            mechanicalKeys={mechanicalKeys}
                            isMissing={isMissing}
                            missingFieldClass={missingFieldClass}
                            isF280RequiredCity={isF280RequiredCity}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}