import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProjectSummaryForm from "@/components/ProjectSummaryForm";

type Props = {
  setShowProjectSummary: (v: boolean) => void;
  selections: any;
  totalPoints: number;
  searchParams: URLSearchParams;
  getPoints: (category: string, value: string) => number;
  uploadedFiles: any[]; // <- adicionado
  autoSave?: boolean;
  projectId: string | null;
};

export default function ProjectSummaryModal({
  setShowProjectSummary,
  selections,
  totalPoints,
  getPoints,
  uploadedFiles, // <- desestrutura com o MESMO nome
  autoSave = false,
  projectId,
}: Props) {
  return (
    <>
      {
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? 'Prescriptive Path Compliance Report' : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? 'Performance Path Energy Model Report' : 'Project Summary'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowProjectSummary(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <ProjectSummaryForm calculatorData={{
            // Original user input data
            firstName: selections.firstName,
            lastName: selections.lastName,
            company: selections.company,
            phoneNumber: selections.phoneNumber,
            streetAddress: selections.streetAddress,
            unitNumber: selections.unitNumber,
            city: selections.city,
            postalCode: selections.postalCode,
            province: selections.province,
            occupancyClass: selections.occupancyClass,
            climateZone: selections.climateZone,
            frontDoorOrientation: selections.compliancePath === "9365" || selections.compliancePath === "9367" ? selections.frontDoorOrientation : "",
            energuidePathway: selections.energuidePathway,
            // Original envelope values as strings (not parsed)
            ceilingsAtticRSI: selections.ceilingsAtticRSI,
            wallRSI: selections.wallRSI,
            floorsUnheatedRSI: selections.floorsUnheatedRSI,
            floorsGarageRSI: selections.floorsGarageRSI,
            heatedFloorsRSI: selections.heatedFloorsRSI,
            slabOnGradeRSI: selections.slabOnGradeRSI,
            slabOnGradeIntegralFootingRSI: selections.slabOnGradeIntegralFootingRSI,
            floorsOverUnheatedSpacesRSI: selections.floorsOverUnheatedSpacesRSI,
            belowGradeRSI: selections.belowGradeRSI || selections.foundationWallsRSI,
            windowUValue: selections.windowUValue,
            skylightUValue: selections.skylightUValue,
            // Processed data for calculations
            projectName: `${selections.firstName} ${selections.lastName} - ${selections.streetAddress}, ${selections.city}`,
            buildingType: selections.buildingType,
            location: [selections.streetAddress, selections.city, selections.province].filter(Boolean).join(', '),
            floorArea: parseFloat(selections.buildingVolume) || 0,
            selectedPathway: selections.compliancePath === '9362' ? 'prescriptive' : selections.compliancePath === '9368' ? 'prescriptive' : 'performance',
            // Building Envelope Data - works for all pathways
            atticPoints: getPoints("atticRSI", selections.atticRSI || selections.ceilingsAtticRSI),
            wallRsi: parseFloat(selections.wallRSI) || 0,
            wallPoints: getPoints("wallRSI", selections.wallRSI),
            belowGradeRsi: parseFloat(selections.belowGradeRSI || selections.foundationWallsRSI) || 0,
            belowGradePoints: getPoints("belowGradeRSI", selections.belowGradeRSI || selections.foundationWallsRSI),
            floorRsi: parseFloat(selections.floorsUnheatedRSI || selections.floorsOverUnheatedSpacesRSI) || 0,
            floorPoints: getPoints("floorsUnheatedRSI", selections.floorsUnheatedRSI || selections.floorsOverUnheatedSpacesRSI),
            windowPoints: getPoints("windowUValue", selections.windowUValue),
            // Mechanical Systems - works for all pathways
            heatingSystemType: selections.heatingType || '',
            heatingEfficiency: selections.compliancePath === '9367' ? '' : selections.heatingEfficiency || '',
            // For 9367, we use make/model instead
            heatingPoints: getPoints("heatingType", selections.heatingType),
            coolingSystemType: selections.coolingApplicable === 'yes' ? 'Central AC' : 'None',
            coolingEfficiency: parseFloat(selections.coolingEfficiency) || 0,
            coolingPoints: getPoints("coolingEfficiency", selections.coolingEfficiency),
            waterHeatingType: selections.waterHeater || selections.waterHeaterType || '',
            waterHeatingEfficiency: 0,
            // Would need calculation based on type
            waterHeatingPoints: getPoints("waterHeater", selections.waterHeater),
            hrvErvType: selections.hasHrv === 'with_hrv' ? selections.hrv || 'HRV' : 'None',
            hrvErvEfficiency: parseFloat(selections.hrvEfficiency) || 0,
            hrvErvPoints: getPoints("hrv", selections.hrv),
            hrvMakeModel: selections.hrvMakeModel || selections.hrvEfficiency || '',
            heatingMakeModel: selections.compliancePath as string === '9367' ? selections.heatingMakeModel || selections.heatingEfficiency || '' : '',
            // For 9367, check both make/model and efficiency fields
            waterHeatingMakeModel: selections.compliancePath as string === '9367' ? selections.waterHeaterMakeModel || selections.waterHeater || '' : '',
            // For 9367, use make/model field or water heater selection
            coolingMakeModel: selections.coolingMakeModel,
            // Additional requirements/features
            midConstructionBlowerDoorPlanned: selections.midConstructionBlowerDoorPlanned,
            hasDWHR: selections.hasDWHR,
            // Fix #6: Summary Capture Fix - Push File URLs to Summary  
            uploadedFiles: uploadedFiles.map(file => ({
              name: file.name,
              size: file.size,
              type: file.type,
              url: (file as any).url || '',
              path: (file as any).path || ''
            })),
            indirectTank: selections.indirectTank,
            indirectTankSize: selections.indirectTankSize,
            additionalInfo: selections.additionalInfo,
            interestedCertifications: selections.interestedCertifications,
            hasHrvErv9365: selections.hasHrvErv9365,
            hasInFloorHeat9365: selections.hasInFloorHeat9365,
            floorsSlabsSelected: selections.floorsSlabsSelected,
            // Building Performance - works for all pathways
            airtightnessAl: parseFloat(selections.airtightness || selections.customAirtightness) || 0,
            airtightnessPoints: getPoints("airtightness", selections.airtightness || selections.customAirtightness),
            buildingVolume: parseFloat(selections.buildingVolume) || 0,
            volumePoints: getPoints("buildingVolume", selections.buildingVolume),
            // Performance Path Specific Data
            annualEnergyConsumption: undefined,
            // Not captured in current form
            performanceComplianceResult: selections.compliancePath as string === '9367' ? 'Compliance determined by energy modeling' : undefined,
            // Compliance Results
            totalPoints: totalPoints,
            complianceStatus: 'submitted',
            // Changed to keep projects in progress until admin review
            upgradeCosts: 0 // This would need to be calculated based on selected upgrades
          }} editingProjectId={projectId || undefined} onSave={() => setShowProjectSummary(false)} autoSave={autoSave} />
            </div>
          </div>
        </div>        
      }
    </>
  );
}