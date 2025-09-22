import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, LayoutGrid, List, Plus } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectToolbarProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  view: 'kanban' | 'table';
  onViewChange: (view: 'kanban' | 'table') => void;
  onNewProjectClick: () => void;
}

const ProjectToolbar = ({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  searchTerm,
  onSearchTermChange,
  view,
  onViewChange,
  onNewProjectClick,
}: ProjectToolbarProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:w-auto md:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by project name or address..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="non-compliant">Non-Compliant</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => onSortByChange(sortBy === 'updated_at' ? 'project_name' : 'updated_at')}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by {sortBy === 'updated_at' ? 'Date' : 'Name'}
        </Button>
        <ToggleGroup type="single" value={view} onValueChange={(value) => { if (value) onViewChange(value as 'kanban' | 'table') }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="kanban" aria-label="Kanban view" className="data-[state=on]:bg-white data-[state=on]:text-primary-foreground data-[state=off]:bg-transparent data-[state=off]:text-white data-[state=off]:hover:bg-slate-700">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Kanban View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="table" aria-label="Table view" className="data-[state=on]:bg-white data-[state=on]:text-primary-foreground data-[state=off]:bg-transparent data-[state=off]:text-white data-[state=off]:hover:bg-slate-700">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Table View</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
        <Button onClick={onNewProjectClick} className="border border-white animate-glow-pulse">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectToolbar;