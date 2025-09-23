import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, LayoutGrid, List, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
        
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onViewChange('kanban')}
                className={cn(
                  "rounded-r-none",
                  view === 'kanban'
                    ? 'bg-white text-primary hover:bg-white/90'
                    : 'bg-transparent text-white hover:bg-yellow-300'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Card View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onViewChange('table')}
                className={cn(
                  "rounded-l-none -ml-px",
                  view === 'table'
                    ? 'bg-white text-primary hover:bg-white/90'
                    : 'bg-transparent text-white hover:bg-yellow-300'
                )}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Table View</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Button onClick={onNewProjectClick} className="border border-white animate-glow-pulse">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectToolbar;