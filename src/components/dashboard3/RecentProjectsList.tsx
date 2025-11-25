import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';

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

const RecentProjectsList = ({ data }: { data: any[] }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-slate-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-slate-300">Your 5 most recently updated projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 5).map(project => {
            const statusInfo = getStatusInfo(project.compliance_status);
            return (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="flex items-center justify-between p-3 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-medium">{project.project_name}</p>
                  <p className="text-xs text-slate-400">Updated: {new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className={statusInfo.className}>{statusInfo.text}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentProjectsList;