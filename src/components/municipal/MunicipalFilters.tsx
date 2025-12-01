import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';

const MunicipalFilters = ({ filters, setFilters }: any) => {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
            <SelectTrigger><SelectValue placeholder="Filter by Date Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year-to-date</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.compliancePath} onValueChange={(value) => handleFilterChange('compliancePath', value)}>
            <SelectTrigger><SelectValue placeholder="Filter by Compliance Path" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Paths</SelectItem>
              <SelectItem value="prescriptive">Prescriptive</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.mechanicalSystem} onValueChange={(value) => handleFilterChange('mechanicalSystem', value)}>
            <SelectTrigger><SelectValue placeholder="Filter by Mechanical System" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              <SelectItem value="gas">Natural Gas</SelectItem>
              <SelectItem value="electric">Electric / Heat Pump</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MunicipalFilters;