import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getPendingItems } from '@/lib/projectUtils';
import { useNavigate } from 'react-router-dom';

const getStatusInfo = (status: string | null) => {
  switch (status) {
    case 'pass':
    case 'Compliant':
      return { text: 'Compliant', className: 'bg-green-500/20 text-green-300 border-green-500/30' };
    case 'fail':
      return { text: 'Non-Compliant', className: 'bg-red-500/20 text-red-300 border-red-500/30' };
    case 'submitted':
      return { text: 'Submitted', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    case 'draft':
      return { text: 'Draft', className: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
    case 'needs_revision':
      return { text: 'Needs Revision', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    default:
      return { text: 'In Progress', className: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
  }
};

const pathwayMapping: { [key: string]: string } = {
  '9362': 'Prescriptive',
  '9368': 'Tiered Prescriptive',
  '9365': 'Performance',
  '9367': 'Tiered Performance',
};

const ProjectDataTable = ({ projects, sortBy, setSortBy }: any) => {
  const navigate = useNavigate();
  const handleSort = (field: string) => {
    const direction = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
    setSortBy({ field, direction });
  };

  const renderSortIcon = (field: string) => {
    if (sortBy.field !== field) return <ArrowUpDown className="h-4 w-4 ml-2 opacity-30" />;
    return sortBy.direction === 'asc' ? <ArrowUpDown className="h-4 w-4 ml-2" /> : <ArrowUpDown className="h-4 w-4 ml-2 transform rotate-180" />;
  };

  return (
    <div className="bg-slate-700/40 border border-slate-400/50 backdrop-blur-[100px] rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-400/50 hover:bg-transparent">
            <TableHead className="text-white">Flags</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('project_name')} className="text-white hover:bg-slate-600/50">
                Project / Location {renderSortIcon('project_name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('company_name')} className="text-white hover:bg-slate-600/50">
                Builder {renderSortIcon('company_name')}
              </Button>
            </TableHead>
            <TableHead className="text-white">Pathway</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('compliance_status')} className="text-white hover:bg-slate-600/50">
                Status {renderSortIcon('compliance_status')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('updated_at')} className="text-white hover:bg-slate-600/50">
                Last Updated {renderSortIcon('updated_at')}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((p: any) => {
            const statusInfo = getStatusInfo(p.compliance_status);
            const { required } = getPendingItems(p, p.uploaded_files || []);
            const isOverdue = p.compliance_status === 'submitted' && (new Date().getTime() - new Date(p.updated_at).getTime()) > 7 * 24 * 60 * 60 * 1000;

            return (
              <TableRow key={p.id} onClick={() => navigate(`/project/${p.id}`)} className="cursor-pointer border-b border-slate-400/50 hover:bg-slate-600/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    {required.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{required.length} required item(s) pending.</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {isOverdue && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pending review for over 7 days.</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-white">{p.project_name}</div>
                  <div className="text-sm text-slate-300">{p.location}</div>
                </TableCell>
                <TableCell className="text-slate-300">{p.company_name}</TableCell>
                <TableCell className="text-slate-300">{pathwayMapping[p.selected_pathway] || 'N/A'}</TableCell>
                <TableCell><Badge variant="outline" className={statusInfo.className}>{statusInfo.text}</Badge></TableCell>
                <TableCell className="text-slate-300">{new Date(p.updated_at).toLocaleDateString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectDataTable;