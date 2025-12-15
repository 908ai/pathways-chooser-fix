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

const getAirtightnessIcon = (score: number | null) => {
  let color = '#808080'; // Grey for unknown
  if (score !== null) {
    if (score <= 1.5) color = '#22c55e'; // Green
    else if (score <= 2.5) color = '#f97316'; // Orange
    else color = '#ef4444'; // Red
  }

  const iconHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>`;

  return new L.DivIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const fetchAllProjectsWithCoords = async () => {
  const { data, error } = await supabase
    .from('project_summaries')
    .select('id, project_name, location, latitude, longitude, compliance_status, airtightness_al, city');
  
  if (error) throw error;

  // Simulate coordinates for projects that don't have them, for demonstration
  const projectsWithCoords = data.map(p => {
    if (p.latitude && p.longitude) {
      return p;
    }
    
    let latitude = p.latitude;
    let longitude = p.longitude;
    switch (p.city?.toLowerCase()) {
      case 'calgary':
        latitude = 51.0447 + (Math.random() - 0.5) * 0.2;
        longitude = -114.0719 + (Math.random() - 0.5) * 0.2;
        break;
      case 'edmonton':
        latitude = 53.5461 + (Math.random() - 0.5) * 0.2;
        longitude = -113.4938 + (Math.random() - 0.5) * 0.2;
        break;
      case 'saskatoon':
        latitude = 52.1332 + (Math.random() - 0.5) * 0.1;
        longitude = -106.6700 + (Math.random() - 0.5) * 0.1;
        break;
      case 'regina':
        latitude = 50.4452 + (Math.random() - 0.5) * 0.1;
        longitude = -104.6189 + (Math.random() - 0.5) * 0.1;
        break;
      default:
        break;
    }
    return { ...p, latitude, longitude };
  }).filter(p => p.latitude && p.longitude);

  return projectsWithCoords;
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

  const center: LatLngExpression = [52.9399, -106.4509];

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Project Airtightness Map
        </CardTitle>
        <CardDescription>
          Geographic distribution of project airtightness scores (ACH₅₀). Green is best, red is worst.
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
                <Marker key={project.id} position={[project.latitude!, project.longitude!]} icon={getAirtightnessIcon(project.airtightness_al)}>
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