import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getPendingItems } from '@/lib/projectUtils';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const getStatusInfo = (status: string | null) => {
  switch (status) {
    case 'pass':
    case 'Compliant':
      return { text: 'Compliant', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-500/30' };
    case 'fail':
      return { text: 'Non-Compliant', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-500/30' };
    case 'submitted':
      return { text: 'Submitted', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-500/30' };
    case 'draft':
      return { text: 'Draft', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border-gray-200 dark:border-gray-500/30' };
    case 'needs_revision':
      return { text: 'Needs Revision', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30' };
    default:
      return { text: 'In Progress', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-500/30' };
  }
};

const pathwayMapping: { [key: string]: string } = {
  '9362': 'Prescriptive',
  '9368': 'Tiered Prescriptive',
  '9365': 'Performance',
  '9367': 'Tiered Performance',
};

const formatBuildingType = (type: string) => {
  if (!type) return 'N/A';
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flags</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('project_name')}>
                  Project / Location {renderSortIcon('project_name')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('company_name')}>
                  Builder {renderSortIcon('company_name')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('building_type')}>
                  Building Type {renderSortIcon('building_type')}
                </Button>
              </TableHead>
              <TableHead>Pathway</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('compliance_status')}>
                  Status {renderSortIcon('compliance_status')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('updated_at')}>
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
                <TableRow key={p.id} onClick={() => navigate(`/project/${p.id}`)} className="cursor-pointer">
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
                    <div className="font-medium text-foreground">{p.project_name}</div>
                    <div className="text-sm text-muted-foreground">{p.location}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.company_name}</TableCell>
                  <TableCell className="text-muted-foreground">{formatBuildingType(p.building_type)}</TableCell>
                  <TableCell className="text-muted-foreground">{pathwayMapping[p.selected_pathway] || 'N/A'}</TableCell>
                  <TableCell><Badge variant="outline" className={statusInfo.className}>{statusInfo.text}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProjectDataTable;