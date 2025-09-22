import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface CreateProjectCardProps {
  handleNewProject: () => void;
}

const CreateProjectCard = ({ handleNewProject }: CreateProjectCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Plus className="h-5 w-5" />
          Start New Project
        </CardTitle>
        <CardDescription className="text-slate-200">
          Begin a new NBC 9.36 compliance assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleNewProject} size="lg" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateProjectCard;