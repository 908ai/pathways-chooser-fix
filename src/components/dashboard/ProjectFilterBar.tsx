import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

const pathwayOptions = [
  { value: '9362', label: 'Prescriptive' },
  { value: '9368', label: 'Tiered Prescriptive' },
  { value: '9365', label: 'Performance' },
  { value: '9367', label: 'Tiered Performance' },
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'needs_revision', label: 'Needs Revision' },
  { value: 'pass', label: 'Compliant' },
  { value: 'fail', label: 'Non-Compliant' },
];

const ProjectFilterBar = ({ filters, setFilters, uniqueBuilders, uniqueLocations }: any) => {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, location, builder..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-600 text-white"
            />
          </div>
          <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white"><SelectValue placeholder="Filter by Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map((loc: string) => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.builder} onValueChange={(value) => handleFilterChange('builder', value)}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white"><SelectValue placeholder="Filter by Builder" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Builders</SelectItem>
              {uniqueBuilders.map((b: string) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectFilterBar;