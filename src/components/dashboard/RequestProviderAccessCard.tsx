import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RequestProviderAccessCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-slate-800/60 border-slate-400/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5" />
          Find a Service Provider
        </CardTitle>
        <CardDescription className="text-slate-200">
          Access our directory of trusted professionals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => navigate('/request-provider-access')} size="lg" className="w-full sm:w-auto">
          Request Access
        </Button>
      </CardContent>
    </Card>
  );
};

export default RequestProviderAccessCard;