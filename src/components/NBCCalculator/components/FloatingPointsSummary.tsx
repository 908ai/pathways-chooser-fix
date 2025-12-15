import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import InfoButton from "@/components/InfoButton";

type Props = {
  selections: any;
  totalPoints: number;
  compliance: any;
  getPoints: (category: string, value: string) => number;
  calculatePrescriptiveCost: () => number;
  calculatePerformanceCost: () => number;
  calculateCostSavings: () => number;
};

export default function FloatingPointsSummary({
  selections,
  totalPoints,
  compliance,
  getPoints,
  calculatePrescriptiveCost,
  calculatePerformanceCost,
  calculateCostSavings,
}: Props) {
  return (
    <>
      {
          <Card className="bg-card/80 backdrop-blur-sm border shadow-lg rounded-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-card-foreground">Points Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                  <span className="font-bold text-primary text-3xl">{totalPoints.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Total Points</p>
                <Badge variant={compliance.status as "default" | "secondary" | "destructive" | "outline"} className={`text-sm px-3 py-1 ${compliance.status === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : compliance.status === "warning" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"}`}>
                  {compliance.tier}
                </Badge>
              </div>
              
              {/* Points breakdown by category */}
              <div className="space-y-2 text-sm">
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
            }].map(({
              key,
              label
            }) => {
              const value = selections[key as keyof typeof selections];
              if (!value || typeof value === 'boolean') return null;
              const points = Array.isArray(value) ? value.reduce((total, item) => total + getPoints(key, item), 0) : getPoints(key, value as string);
              if (points === 0) return null;
              return <div key={key} className="flex justify-between items-center text-muted-foreground">
                       <span className="text-xs">{label}</span>
                       <span className="font-medium text-green-600 dark:text-green-400">+{points.toFixed(1)}</span>
                     </div>;
            })}
              </div>
              
              <div className="border-t border-border pt-2">
                <p className="text-xs text-muted-foreground text-center">
                  {compliance.description}
                </p>
              </div>
              
              {/* Cost Information */}
              {(selections.compliancePath === "9368" || selections.compliancePath === "9362") && <div className="border-t border-border pt-3 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="text-sm font-medium text-card-foreground">Cost Estimates</h4>
                    <InfoButton title="How Cost Estimates Are Calculated" dialogClassName="z-[100]">
                        <div className="space-y-3">
                          <div className="text-base text-muted-foreground space-y-2">
                            <p><strong>Prescriptive Path:</strong> Based on baseline construction costs plus upgrades required to meet minimum NBC2020 requirements for each building component.</p>
                            <p><strong>Performance Path:</strong> Calculated using optimized component selections that achieve the same energy performance at potentially lower cost through strategic trade-offs.</p>
                            <p><strong>Estimates Include:</strong> Materials, labor, and installation for insulation, windows, HVAC systems, and air sealing measures.</p>
                            <p><strong>Note:</strong> Costs are estimates for a typical 2,000 sq ft home and may vary based on local pricing, specific products, and installation complexity.</p>
                          </div>
                        </div>
                    </InfoButton>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted/50 p-3 rounded-lg border">
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-300 text-center">
                        ${calculatePrescriptiveCost().toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        Prescriptive Path
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg border">
                      <div className="text-lg font-bold text-green-700 dark:text-green-300 text-center">
                        ${calculatePerformanceCost().toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        Performance Path
                      </div>
                    </div>
                    {calculateCostSavings() > 0 && <div className="bg-gradient-to-r from-purple-50 to-green-50 dark:from-purple-900/30 dark:to-green-900/30 p-3 rounded-lg border border-border">
                        <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300 text-center">
                          ${calculateCostSavings().toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          Potential Savings
                        </div>
                      </div>}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Estimates for 2,000 sq ft home
                  </p>
                </div>}
            </CardContent>
          </Card>
      }
    </>
  );
}