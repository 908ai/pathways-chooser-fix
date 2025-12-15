import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import DropboxTestUpload from "@/components/DropboxTestUpload";
import { Activity, Database, Cloud, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function TestUpload() {
  const { user } = useAuth();
  const [dbStatus, setDbStatus] = useState<{ projects: number; fileRequests: number }>({ projects: 0, fileRequests: 0 });
  const [edgeFunctionLogs, setEdgeFunctionLogs] = useState<any[]>([]);
  const [dropboxStatus, setDropboxStatus] = useState<'checking' | 'active' | 'error'>('checking');
  const [testProject, setTestProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Get project count
      const { count: projectCount } = await supabase
        .from('project_summaries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Get file requests count
      const { count: fileRequestCount } = await supabase
        .from('file_requests')
        .select('*', { count: 'exact', head: true });

      setDbStatus({
        projects: projectCount || 0,
        fileRequests: fileRequestCount || 0
      });

      // Get recent file requests for logs
      const { data: recentRequests } = await supabase
        .from('file_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setEdgeFunctionLogs(recentRequests || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const createTestProject = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const testProjectName = `Test Project - ${new Date().toISOString()}`;
      
      const { data, error } = await supabase
        .from('project_summaries')
        .insert({
          user_id: user.id,
          project_name: testProjectName,
          building_type: 'Residential',
          location: 'Test Location',
          floor_area: 2000,
          selected_pathway: 'Performance'
        })
        .select()
        .single();

      if (error) throw error;

      setTestProject(data);
      toast.success('Test project created successfully!');
      
      // Immediately trigger Dropbox folder creation
      try {
        toast.info('Creating Dropbox folder...');
        const { data: dropboxData, error: dropboxError } = await supabase.functions.invoke('create-dropbox-folder', {
          body: {
            project_id: data.id,
            project_name: data.project_name,
            user_id: user.id
          }
        });

        if (dropboxError) {
          console.error('Dropbox function error:', dropboxError);
          toast.error('Project created but Dropbox folder creation failed: ' + dropboxError.message);
        } else {
          console.log('Dropbox function success:', dropboxData);
          toast.success('Project created and Dropbox folder setup complete!');
        }
      } catch (dropboxErr: any) {
        console.error('Error calling Dropbox function:', dropboxErr);
        toast.error('Project created but Dropbox integration failed: ' + dropboxErr.message);
      }
      
      // Refresh dashboard data
      setTimeout(fetchDashboardData, 3000);
    } catch (error: any) {
      console.error('Error creating test project:', error);
      toast.error('Failed to create test project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testDropboxFunction = async () => {
    if (!user || !testProject) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-dropbox-folder', {
        body: {
          project_id: testProject.id,
          project_name: testProject.project_name,
          user_id: user.id
        }
      });

      if (error) throw error;

      toast.success('Dropbox function called successfully!');
      console.log('Dropbox function response:', data);
      
      // Refresh dashboard data
      setTimeout(fetchDashboardData, 2000);
    } catch (error: any) {
      console.error('Error calling Dropbox function:', error);
      toast.error('Failed to call Dropbox function: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateDropboxToken = async () => {
    setDropboxStatus('checking');
    try {
      const { data, error } = await supabase.functions.invoke('create-dropbox-folder', {
        body: {
          project_id: 'test-validation',
          project_name: 'Token Validation Test',
          user_id: user?.id || 'test'
        }
      });

      if (error) {
        setDropboxStatus('error');
        toast.error('Dropbox token validation failed');
      } else {
        setDropboxStatus('active');
        toast.success('Dropbox token is valid');
      }
    } catch (error) {
      setDropboxStatus('error');
      toast.error('Dropbox validation error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Dropbox Integration Test</h1>
          <p className="text-muted-foreground">Test and debug Dropbox integration with real file uploads</p>
        </div>
        <Button onClick={fetchDashboardData}>Refresh Status</Button>
      </div>

      {/* Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStatus.projects}</div>
            <p className="text-xs text-muted-foreground">Projects created</p>
            <div className="text-sm text-muted-foreground mt-1">
              {dbStatus.fileRequests} file requests
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dropbox API</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {dropboxStatus === 'checking' && <Clock className="h-4 w-4 text-yellow-500" />}
              {dropboxStatus === 'active' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {dropboxStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              <Badge variant={dropboxStatus === 'active' ? 'default' : 'secondary'}>
                {dropboxStatus}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={validateDropboxToken}
              disabled={dropboxStatus === 'checking'}
            >
              Test Token
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edge Functions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edgeFunctionLogs.length}</div>
            <p className="text-xs text-muted-foreground">Recent executions</p>
            <div className="text-sm text-muted-foreground mt-1">
              Last: {edgeFunctionLogs[0] ? new Date(edgeFunctionLogs[0].created_at).toLocaleTimeString() : 'None'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testing Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Testing Controls</CardTitle>
          <CardDescription>Create test projects and trigger Dropbox integration manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={createTestProject} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Test Project'}
            </Button>
            <Button 
              onClick={testDropboxFunction} 
              disabled={loading || !testProject}
              variant="outline"
              className="flex-1"
            >
              Test Dropbox Function
            </Button>
          </div>
          
          {testProject && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Test project created: <strong>{testProject.project_name}</strong>
                <br />
                Project ID: {testProject.id}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* File Upload and Logs */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">File Upload Test</TabsTrigger>
          <TabsTrigger value="logs">Edge Function Logs</TabsTrigger>
          <TabsTrigger value="requests">File Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <DropboxTestUpload 
            testProject={testProject}
            onUploadComplete={fetchDashboardData}
          />
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Edge Function Activity</CardTitle>
              <CardDescription>Monitor create-dropbox-folder function executions</CardDescription>
            </CardHeader>
            <CardContent>
              {edgeFunctionLogs.length === 0 ? (
                <p className="text-muted-foreground">No recent executions found</p>
              ) : (
                <div className="space-y-2">
                  {edgeFunctionLogs.map((log, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.folder_name}</p>
                          <p className="text-sm text-muted-foreground">{log.folder_path}</p>
                        </div>
                        <Badge variant="outline">
                          {new Date(log.created_at).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File Request Links</CardTitle>
              <CardDescription>View and test generated Dropbox file request URLs</CardDescription>
            </CardHeader>
            <CardContent>
              {edgeFunctionLogs.length === 0 ? (
                <p className="text-muted-foreground">No file requests found</p>
              ) : (
                <div className="space-y-3">
                  {edgeFunctionLogs.map((request, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{request.folder_name}</p>
                          <p className="text-sm text-muted-foreground">{request.folder_path}</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(request.file_request_url, '_blank')}
                        >
                          Open Dropbox Link
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(request.file_request_url)}
                        >
                          Copy URL
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}