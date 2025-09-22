import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";

interface ProjectToolbarProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

const ProjectToolbar = ({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  searchTerm,
  onSearchTermChange,
}: ProjectToolbarProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by project name or address..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="inProgress">In Progress</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="non-compliant">Non-Compliant</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => onSortByChange(sortBy === 'updated_at' ? 'project_name' : 'updated_at')}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by {sortBy === 'updated_at' ? 'Date' : 'Name'}
        </Button>
      </div>
    </div>
  );
};

export default ProjectToolbar;