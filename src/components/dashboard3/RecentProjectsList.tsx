import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getStatusInfo = (status: string | null) => {
  switch (status) {
    case 'pass':
    case 'Compliant':
      return { text: 'Compliant', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
    case 'fail':
      return { text: 'Non-Compliant', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
    case 'submitted':
      return { text: 'Submitted', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' };
    case 'draft':
      return { text: 'Draft', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300' };
    case 'needs_revision':
      return { text: 'Needs Revision', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
    default:
      return { text: 'In Progress', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' };
  }
};

const RecentProjectsList = ({ data }: { data: any[] }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Active Projects Status
          </CardTitle>
          <CardDescription>Your most recently updated projects.</CardDescription>
        </div>
        <Button variant="link" onClick={() => navigate('/dashboard')}>View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(0, 5).map(project => {
            const statusInfo = getStatusInfo(project.compliance_status);
            return (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="grid grid-cols-4 items-center gap-4 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="col-span-2">
                  <p className="font-semibold text-foreground truncate">{project.project_name}</p>
                </div>
                <div className="col-span-1 text-xs text-muted-foreground">
                  <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="col-span-1 text-right">
                  <Badge variant="outline" className={statusInfo.className}>{statusInfo.text}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentProjectsList;