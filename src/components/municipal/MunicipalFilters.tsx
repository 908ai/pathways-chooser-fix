import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';

const formatBuildingType = (type: string) => {
  if (!type) return 'Unknown';
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const MunicipalFilters = ({ filters, setFilters, uniqueLocations, uniqueBuildingTypes }: any) => {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
            <SelectTrigger className="items-center"><SelectValue placeholder="Filter by Date Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year-to-date</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.compliancePath} onValueChange={(value) => handleFilterChange('compliancePath', value)}>
            <SelectTrigger className="items-center"><SelectValue placeholder="Filter by Compliance Path" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Paths</SelectItem>
              <SelectItem value="prescriptive">Prescriptive</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.mechanicalSystem} onValueChange={(value) => handleFilterChange('mechanicalSystem', value)}>
            <SelectTrigger className="items-center"><SelectValue placeholder="Filter by Mechanical System" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              <SelectItem value="gas">Natural Gas</SelectItem>
              <SelectItem value="electric">Electric / Heat Pump</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.buildingType} onValueChange={(value) => handleFilterChange('buildingType', value)}>
            <SelectTrigger className="items-center"><SelectValue placeholder="Filter by Building Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Building Types</SelectItem>
              {uniqueBuildingTypes.map((type: string) => (
                <SelectItem key={type} value={type}>{formatBuildingType(type)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
            <SelectTrigger className="items-center"><SelectValue placeholder="Filter by City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {uniqueLocations.map((loc: string) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MunicipalFilters;