import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Zap } from 'lucide-react';

interface PerformanceComplianceViewProps {
  project: any;
}

const PerformanceComplianceView = ({ project }: PerformanceComplianceViewProps) => {
  // Mock data for demonstration
  const referenceHouseConsumption = project.annual_energy_consumption ? (project.annual_energy_consumption * 1.1).toFixed(2) : '220.50';
  const proposedHouseConsumption = project.annual_energy_consumption ? project.annual_energy_consumption.toFixed(2) : '205.15';
  const isCompliant = parseFloat(proposedHouseConsumption) <= parseFloat(referenceHouseConsumption);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Energy Modeling Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div className="p-4 bg-slate-50 rounded-lg border dark:bg-slate-800/50 dark:border-slate-700">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Reference House</h3>
            <p className="text-4xl font-bold text-card-foreground mt-2">{referenceHouseConsumption}</p>
            <p className="text-xs text-muted-foreground">GJ/year</p>
          </div>
          <div className={`p-4 rounded-lg border ${isCompliant ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-500/50' : 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-500/50'}`}>
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Proposed House</h3>
            <p className={`text-4xl font-bold mt-2 ${isCompliant ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{proposedHouseConsumption}</p>
            <p className="text-xs text-muted-foreground">GJ/year</p>
          </div>
        </div>
        <Alert className="mt-6">
          <AlertTitle>Note on Performance Path</AlertTitle>
          <AlertDescription>
            The proposed house's annual energy consumption must be equal to or less than the reference house to be compliant. This comparison demonstrates the overall energy performance based on the submitted design.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default PerformanceComplianceView;