import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const getStatusInfo = (status: string | null) => {
  switch (status) {
    case 'pass':
    case 'Compliant':
      return { text: 'Compliant', className: 'bg-green-100 text-green-800' };
    case 'fail':
      return { text: 'Non-Compliant', className: 'bg-red-100 text-red-800' };
    case 'submitted':
      return { text: 'Submitted', className: 'bg-blue-100 text-blue-800' };
    case 'draft':
      return { text: 'Draft', className: 'bg-gray-100 text-gray-800' };
    case 'needs_revision':
      return { text: 'Needs Revision', className: 'bg-yellow-100 text-yellow-800' };
    default:
      return { text: 'In Progress', className: 'bg-orange-100 text-orange-800' };
  }
};

const RecentProjectsList = ({ data }: { data: any[] }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            Active Projects Status
          </CardTitle>
          <CardDescription className="text-slate-500">Your most recently updated projects.</CardDescription>
        </div>
        <Button variant="link" onClick={() => navigate('/dashboard')}>View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 5).map(project => {
            const statusInfo = getStatusInfo(project.compliance_status);
            const docCount = project.uploaded_files?.length || 0;
            const totalDocs = 3; // Mock total
            return (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="grid grid-cols-6 items-center gap-4 p-3 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="col-span-2">
                  <p className="font-semibold text-slate-800">{project.project_name}</p>
                  <p className="text-xs text-slate-500">Updated: {new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="col-span-1 text-sm text-slate-600">
                  <p>Energy Model</p>
                  <Progress value={60} className="h-2 mt-1" />
                </div>
                <div className="col-span-1 text-sm text-slate-600">
                  <p>Documents</p>
                  <Progress value={(docCount/totalDocs)*100} className="h-2 mt-1" />
                </div>
                <div className="col-span-1 text-sm text-slate-600">
                  <p>Submission</p>
                  <Progress value={statusInfo.text === 'Submitted' || statusInfo.text === 'Compliant' ? 100 : 20} className="h-2 mt-1" />
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