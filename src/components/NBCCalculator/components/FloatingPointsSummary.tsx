import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calculator, Info } from "lucide-react";

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
          <Card className="bg-gradient-to-r from-slate-900/95 to-teal-900/95 border border-slate-400/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-white">Points Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
                  <span className="font-bold text-[#fdf3b1] text-6xl">{totalPoints.toFixed(1)}</span>
                </div>
                <p className="text-sm text-slate-200 mb-2">Total Points</p>
                <Badge variant={compliance.status as "default" | "secondary" | "destructive" | "outline"} className={`text-lg px-4 py-2 ${compliance.status === "success" ? "bg-green-100 text-green-800" : compliance.status === "warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
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
              return <div key={key} className="flex justify-between items-center text-slate-200">
                       <span className="text-xs">{label}</span>
                       <span className="font-medium text-[#b7fdb1]">+{points.toFixed(1)}</span>
                     </div>;
            })}
              </div>
              
              <div className="border-t border-slate-600 pt-2">
                <p className="text-xs text-slate-300 text-center">
                  {compliance.description}
                </p>
              </div>
              
              {/* Cost Information */}
              {(selections.compliancePath === "9368" || selections.compliancePath === "9362") && <div className="border-t border-slate-600 pt-3 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="text-sm font-medium text-white">Cost Estimates</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-slate-300 hover:text-white">
                          <Info className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="left" align="start" className="w-80 bg-slate-800 border-slate-600 z-[100]">
                        <div className="space-y-3">
                          <h4 className="font-medium text-white">How Cost Estimates Are Calculated</h4>
                          <div className="text-sm text-slate-300 space-y-2">
                            <p><strong>Prescriptive Path:</strong> Based on baseline construction costs plus upgrades required to meet minimum NBC2020 requirements for each building component.</p>
                            <p><strong>Performance Path:</strong> Calculated using optimized component selections that achieve the same energy performance at potentially lower cost through strategic trade-offs.</p>
                            <p><strong>Estimates Include:</strong> Materials, labor, and installation for insulation, windows, HVAC systems, and air sealing measures.</p>
                            <p><strong>Note:</strong> Costs are estimates for a typical 2,000 sq ft home and may vary based on local pricing, specific products, and installation complexity.</p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-lg font-bold text-purple-300 text-center">
                        ${calculatePrescriptiveCost().toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-300 text-center">
                        Prescriptive Path
                      </div>
                    </div>
                    <div className="bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-300 text-center">
                        ${calculatePerformanceCost().toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-300 text-center">
                        Performance Path
                      </div>
                    </div>
                    {calculateCostSavings() > 0 && <div className="bg-gradient-to-r from-purple-600/20 to-green-600/20 p-3 rounded-lg border border-purple-400/30">
                        <div className="text-lg font-bold text-yellow-300 text-center">
                          ${calculateCostSavings().toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-300 text-center">
                          Potential Savings
                        </div>
                      </div>}
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Estimates for 2,000 sq ft home
                  </p>
                </div>}
            </CardContent>
          </Card>        
      }
    </>
  );
}
