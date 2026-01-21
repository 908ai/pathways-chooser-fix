import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Clock, ExternalLink, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  logo_url: string | null;
  position: number;
}

const ResourceItem = ({ resource }: { resource: Resource }) => (
  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-muted/50 border rounded-lg hover:bg-accent hover:shadow-md transition-all">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 flex-shrink-0 bg-background border rounded-md flex items-center justify-center p-1 bg-white overflow-hidden">
        {resource.logo_url ? (
          <img src={resource.logo_url} alt={resource.title} className="max-w-full max-h-full object-contain" />
        ) : (
          <Image className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 font-medium text-foreground mb-1">
          <span>{resource.title}</span>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{resource.description}</p>
      </div>
    </div>
  </a>
);

const ResourcesPage = () => {
  const { signOut } = useAuth();

  const { data: resources, isLoading } = useQuery({
    queryKey: ['public-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('position', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      return data as Resource[];
    },
  });

  const getResourcesByCategory = (category: string) => {
    return resources?.filter(r => r.category === category) || [];
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Guides, timelines, and technical services for NBC 9.36 compliance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    File Processing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <div className="p-4 bg-muted/50 border rounded-lg">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <div className="font-semibold text-blue-800 dark:text-blue-300">Day 1-2</div>
                        <div className="text-sm text-blue-700 dark:text-blue-400">Project review & initial assessment</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                        <div className="font-semibold text-orange-800 dark:text-orange-300">Day 3-5</div>
                        <div className="text-sm text-orange-700 dark:text-orange-400">Initial modeling & recommendations</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <div className="font-semibold text-green-800 dark:text-green-300">Upon Compliance</div>
                        <div className="text-sm text-green-700 dark:text-green-400">Invoice → Payment → Report Release</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      * Timelines reset if files are sent back for corrections.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-card-foreground">Energy Code Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://solinvictusenergyservices.com/energy-hack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted/50 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                      <span>Energy Code Hack</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground">Learn which compliance pathway saves you the most money.</div>
                  </a>
                  <a
                    href="https://solinvictusenergyservices.com/airtightness"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted/50 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                      <span>Airtightness Requirements</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground">Regional requirements for air-tightness testing.</div>
                  </a>
                  <a
                    href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted/50 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                      <span>Blower Door Checklist (PDF)</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground">A complete checklist for blower door testing.</div>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-card-foreground">Technical Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://solinvictusenergyservices.com/cancsa-f28012"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted/50 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                      <span>CAN/CSA F280-12 Heat Loss/Gain</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground">Room-by-room calculations for sizing HVAC systems.</div>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">External Resources</CardTitle>
                <CardDescription className="text-muted-foreground">
                  A collection of useful links from industry organizations and government bodies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <Tabs defaultValue="alberta" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="alberta">Alberta</TabsTrigger>
                      <TabsTrigger value="national">National</TabsTrigger>
                      <TabsTrigger value="saskatchewan">Saskatchewan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="alberta" className="mt-4 space-y-4">
                      {getResourcesByCategory('alberta').map(resource => (
                        <ResourceItem key={resource.id} resource={resource} />
                      ))}
                    </TabsContent>
                    <TabsContent value="national" className="mt-4 space-y-4">
                      {getResourcesByCategory('national').map(resource => (
                        <ResourceItem key={resource.id} resource={resource} />
                      ))}
                    </TabsContent>
                    <TabsContent value="saskatchewan" className="mt-4 space-y-4">
                      {getResourcesByCategory('saskatchewan').map(resource => (
                        <ResourceItem key={resource.id} resource={resource} />
                      ))}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;