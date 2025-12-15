import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stepper } from './NBCCalculator/components';
import { ProjectInformationSection, CompliancePathSection, Prescriptive9362Section, Prescriptive9368Section, Prescriptive9368WithHrvSection, Performance9365Section, Performance9367Section, EnerGuidePathwaySection, FileUploadSection, HrvAdditionalInfoSection } from './NBCCalculator/sections';
import { validationSchema } from './NBCCalculator/utils/validation';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FloatingPointsSummary } from './NBCCalculator/components';
import { useNBCCalculator } from './NBCCalculator/hooks/useNBCCalculator';
import { Loader2 } from 'lucide-react';
import EditModeIndicator from './NBCCalculator/sections/EditModeIndicator';
import ContactBanner from './NBCCalculator/sections/ContactBanner';

interface NBCCalculatorProps {
  projectId?: string;
}

const NBCCalculator = ({ projectId }: NBCCalculatorProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!!projectId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      // Project Information
      project_name: '',
      building_type: 'Single Family',
      street_address: '',
      city: '',
      province: 'SK',
      postal_code: '',
      climate_zone: 'Zone 6',
      // Compliance Path
      selected_pathway: '',
      // ... other fields will be undefined initially
    },
  });

  const { watch, handleSubmit, reset } = methods;
  const selectedPathway = watch('selected_pathway');

  const { totalPoints, complianceStatus } = useNBCCalculator(watch);

  useEffect(() => {
    if (projectId) {
      const fetchProjectData = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('project_summaries')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (error) {
          toast({ title: 'Error fetching project data', description: error.message, variant: 'destructive' });
        } else if (data) {
          const transformedData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value === null) {
              // RHF expects undefined for empty fields, not null
              acc[key] = undefined;
            } else {
              acc[key] = value;
            }
            return acc;
          }, {} as any);
          reset(transformedData);
        }
        setIsLoading(false);
      };
      fetchProjectData();
    }
  }, [projectId, reset, toast]);

  const steps = [
    { id: 'Project Information', component: <ProjectInformationSection /> },
    { id: 'Compliance Path', component: <CompliancePathSection /> },
  ];

  if (selectedPathway === 'Prescriptive 9.36.2.') {
    steps.push({ id: 'Building Envelope', component: <Prescriptive9362Section /> });
  } else if (selectedPathway === 'Prescriptive 9.36.8. with HRV') {
    steps.push({ id: 'Building Envelope', component: <Prescriptive9368WithHrvSection /> });
    steps.push({ id: 'HRV Information', component: <HrvAdditionalInfoSection /> });
  } else if (selectedPathway === 'Prescriptive 9.36.8.') {
    steps.push({ id: 'Building Envelope', component: <Prescriptive9368Section /> });
  } else if (selectedPathway === 'Performance 9.36.5.') {
    steps.push({ id: 'Performance Data', component: <Performance9365Section /> });
  } else if (selectedPathway === 'Performance 9.36.7.') {
    steps.push({ id: 'Performance Data', component: <Performance9367Section /> });
  } else if (selectedPathway === 'EnerGuide Rating') {
    steps.push({ id: 'EnerGuide Data', component: <EnerGuidePathwaySection /> });
  }

  steps.push({ id: 'File Uploads', component: <FileUploadSection /> });

  const onSubmit = async (data: any) => {
    if (!user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to save a project.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const projectData = {
      ...data,
      user_id: user.id,
      total_points: totalPoints,
      compliance_status: complianceStatus,
    };

    let result;
    if (projectId) {
      // Update existing project
      result = await supabase.from('project_summaries').update(projectData).eq('id', projectId).select().single();
    } else {
      // Insert new project
      result = await supabase.from('project_summaries').insert(projectData).select().single();
    }

    setIsSubmitting(false);
    const { data: resultData, error } = result;

    if (error) {
      toast({ title: 'Error saving project', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Project Saved Successfully', description: `Project "${projectData.project_name}" has been saved.` });
      if (resultData) {
        navigate(`/projects/${resultData.id}`);
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto p-4 md:p-8">
        {projectId && <EditModeIndicator />}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Stepper steps={steps.map(s => s.id)} activeStep={activeStep} setActiveStep={setActiveStep} />
            <ContactBanner />
          </div>
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                {steps[activeStep].component}
              </div>
              <div className="mt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveStep(s => Math.max(0, s - 1))} disabled={activeStep === 0}>
                  Previous
                </Button>
                {activeStep < steps.length - 1 ? (
                  <Button type="button" onClick={() => setActiveStep(s => Math.min(steps.length - 1, s + 1))}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (projectId ? 'Update Project' : 'Save Project')}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
        <FloatingPointsSummary totalPoints={totalPoints} complianceStatus={complianceStatus} />
      </div>
    </FormProvider>
  );
};

export default NBCCalculator;