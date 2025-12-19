import { File, MessageSquare, AlertTriangle, CheckCircle, XCircle, Edit, PlusCircle, Trash2, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

const getEventIcon = (eventType: string) => {
  const commonClasses = "h-5 w-5";
  switch (eventType) {
    case 'project_created':
      return <PlusCircle className={`${commonClasses} text-blue-500`} />;
    case 'project_submitted':
      return <Send className={`${commonClasses} text-blue-500`} />;
    case 'project_resubmitted':
      return <Send className={`${commonClasses} text-blue-500`} />;
    case 'revision_request':
      return <AlertTriangle className={`${commonClasses} text-yellow-500`} />;
    case 'update_requested':
      return <RefreshCw className={`${commonClasses} text-blue-500`} />;
    case 'update_allowed':
      return <CheckCircle2 className={`${commonClasses} text-green-500`} />;
    case 'user_comment':
      return <MessageSquare className={`${commonClasses} text-gray-500`} />;
    case 'project_approved':
      return <CheckCircle className={`${commonClasses} text-green-500`} />;
    case 'project_rejected':
      return <XCircle className={`${commonClasses} text-red-500`} />;
    case 'project_edited':
      return <Edit className={`${commonClasses} text-purple-500`} />;
    case 'file_uploaded':
      return <File className={`${commonClasses} text-indigo-500`} />;
    case 'file_deleted':
      return <Trash2 className={`${commonClasses} text-red-500`} />;
    default:
      return <File className={`${commonClasses} text-gray-400`} />;
  }
};

const getEventContent = (event: any) => {
  const { event_type, payload, user_email, user_role } = event;
  const userIdentifier = user_role === 'admin' ? 'Admin' : user_email;

  switch (event_type) {
    case 'project_created':
      return <><span className="font-semibold">{userIdentifier}</span> created the project.</>;
    case 'project_submitted':
      return <><span className="font-semibold">{userIdentifier}</span> submitted the project for review.</>;
    case 'project_resubmitted':
      return <><span className="font-semibold">{userIdentifier}</span> re-submitted the project for review.</>;
    case 'revision_request':
      return (
        <div>
          <p><span className="font-semibold">{userIdentifier}</span> requested a revision.</p>
          {payload?.comment && (
            <p className="mt-2 text-sm text-muted-foreground pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              "{payload.comment}"
            </p>
          )}
        </div>
      );
    case 'update_requested':
      return (
        <div>
          <p><span className="font-semibold">{userIdentifier}</span> requested to edit the project.</p>
          {payload?.comment && (
            <p className="mt-2 text-sm text-muted-foreground pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              "{payload.comment}"
            </p>
          )}
        </div>
      );
    case 'update_allowed':
      return (
        <div>
          <p><span className="font-semibold">{userIdentifier}</span> allowed the project to be edited.</p>
          {payload?.comment && (
            <p className="mt-2 text-sm text-muted-foreground pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              "{payload.comment}"
            </p>
          )}
        </div>
      );
    case 'user_comment':
      return (
        <div>
          <p><span className="font-semibold">{userIdentifier}</span> left a comment.</p>
          {payload?.comment && (
            <p className="mt-2 text-sm text-muted-foreground pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              "{payload.comment}"
            </p>
          )}
        </div>
      );
    case 'project_approved':
      return (
        <div>
          <p><span className="font-semibold">{userIdentifier}</span> approved the project.</p>
          {payload?.comment && payload.comment.trim() !== '' && (
            <p className="mt-2 text-sm text-muted-foreground pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              "{payload.comment}"
            </p>
          )}
        </div>
      );
    case 'project_rejected':
      return (
        <div>
          <p><span className="font-semibold">{userIdentifier}</span> rejected the project.</p>
          {payload?.comment && payload.comment.trim() !== '' && (
            <p className="mt-2 text-sm text-muted-foreground pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              "{payload.comment}"
            </p>
          )}
        </div>
      );
    case 'project_edited':
      return <><span className="font-semibold">{userIdentifier}</span> edited the project details.</>;
    case 'file_uploaded':
      return <><span className="font-semibold">{userIdentifier}</span> uploaded a file: <span className="font-medium">{payload?.fileName}</span>.</>;
    case 'file_deleted':
      return <><span className="font-semibold">{userIdentifier}</span> deleted a file: <span className="font-medium">{payload?.fileName}</span>.</>;
    default:
      return `Event: ${event_type}`;
  }
};

const ProjectHistory = ({ events }: { events: any[] }) => {
  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Project History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>No history recorded for this project yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Project History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {getEventIcon(event.event_type)}
              </div>
              <div className="flex-1 pt-1">
                <div className="text-sm text-foreground">
                  {getEventContent(event)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectHistory;