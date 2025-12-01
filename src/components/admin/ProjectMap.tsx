import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Loader2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

// Fix for default icon issue with bundlers like Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const fetchAllProjectsWithCoords = async () => {
  const { data, error } = await supabase
    .from('project_summaries')
    .select('id, project_name, location, latitude, longitude, compliance_status, airtightness_al')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);
  
  if (error) throw error;
  return data;
};

const ProjectMap = () => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['allProjectsWithCoords'],
    queryFn: fetchAllProjectsWithCoords,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
        <p className="ml-4 text-muted-foreground">Loading map data...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Failed to load project data for the map: {error.message}</AlertDescription>
    </Alert>;
  }

  const center: LatLngExpression = [52.9399, -106.4509]; // Center of Saskatchewan/Alberta

  return (
    <Card className="h-[70vh] w-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Project Map
        </CardTitle>
        <CardDescription>
          Geographic distribution of projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {projects && projects.length > 0 ? (
          <div className="h-full w-full rounded-md overflow-hidden border">
            <MapContainer center={center} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {projects.map(project => (
                <Marker key={project.id} position={[project.latitude!, project.longitude!]}>
                  <Popup>
                    <div className="font-semibold">{project.project_name}</div>
                    <div className="text-xs text-muted-foreground">{project.location}</div>
                    <div className="text-xs mt-1">Airtightness: <span className="font-medium">{project.airtightness_al?.toFixed(2) || 'N/A'} ACH₅₀</span></div>
                    <Link to={`/project/${project.id}`} className="text-xs text-primary hover:underline mt-2 block">
                      View Details
                    </Link>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertTitle>No Projects to Display</AlertTitle>
            <AlertDescription>
              There are currently no projects with geographic coordinates.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMap;