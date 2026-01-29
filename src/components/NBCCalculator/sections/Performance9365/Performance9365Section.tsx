import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Accordion } from "@/components/ui/accordion";

import { missingFieldClass } from "./constants";
import { isSet, getEnvelopeKeys, getMechanicalKeys } from "./helpers";

import EnvelopeSection from "./components/EnvelopeSection";
import MechanicalSection from "./components/MechanicalSection";

export default function Performance9365Section({
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

  // Helper functions for progress tracking
  const isMissing = (key: string) => {
    return showMissingFields && !isSet(selections[key]);
  };

  const envelopeKeys = getEnvelopeKeys(selections);
  const mechanicalKeys = getMechanicalKeys(selections);

  // Count uploaded files as one completed item for envelope if any exist
  const envelopeCompleted = envelopeKeys.filter(key => isSet(selections[key])).length + (uploadedFiles.length > 0 ? 1 : 0);
  const envelopeTotal = envelopeKeys.length + 1; // +1 for the file upload requirement

  const mechanicalCompleted = mechanicalKeys.filter(key => isSet(selections[key])).length;

  const hasMissingEnvelope = envelopeKeys.some(key => !isSet(selections[key])) || uploadedFiles.length === 0;
  const hasMissingMechanical = mechanicalKeys.some(key => !isSet(selections[key]));

  useEffect(() => {
    if (showMissingFields) {
      const newOpenSections = [];
      if (hasMissingEnvelope) newOpenSections.push("envelope");
      if (hasMissingMechanical) newOpenSections.push("mechanical");

      // Only update if there's a difference to avoid infinite loops or unnecessary renders
      if (newOpenSections.length > 0) {
        // Use functional update and check if it already contains the values to avoid overriding user interaction too aggressively
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
        <Button variant="outline" size="sm" className="text-sm px-2" onClick={() => setOpenSections(["envelope", "mechanical"])}>
          Expand All
        </Button>
        <Button variant="outline" size="sm" className="text-sm px-2" onClick={() => setOpenSections([])}>
          Collapse All
        </Button>
      </div>

      <Accordion type="multiple" value={openSections} onValueChange={(val: string[] | string) => setOpenSections(Array.isArray(val) ? val : [])} className="border rounded-md">
        <EnvelopeSection
          selections={selections}
          setSelections={setSelections}
          handleFileUploadRequest={handleFileUploadRequest}
          uploadedFiles={uploadedFiles}
          removeFile={removeFile}
          showMissingFields={showMissingFields}
          hasMissingEnvelope={hasMissingEnvelope}
          envelopeCompleted={envelopeCompleted}
          envelopeTotal={envelopeTotal}
          isMissing={isMissing}
          missingFieldClass={missingFieldClass}
        />

        <MechanicalSection
          selections={selections}
          setSelections={setSelections}
          showMissingFields={showMissingFields}
          hasMissingMechanical={hasMissingMechanical}
          mechanicalCompleted={mechanicalCompleted}
          mechanicalKeysLength={mechanicalKeys.length}
          isMissing={isMissing}
          missingFieldClass={missingFieldClass}
        />
      </Accordion>
    </div>
  );
}