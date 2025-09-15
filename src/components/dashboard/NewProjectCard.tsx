import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface NewProjectCardProps {
  handleNewProject: () => void;
}

const NewProjectCard = ({ handleNewProject }: NewProjectCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Start New Project
        </CardTitle>
        <CardDescription>
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

export default NewProjectCard;