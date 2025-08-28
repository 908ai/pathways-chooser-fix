import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getPoints } from '@/lib/utils';
import {
  validateRSI,
  validateRSI_9362,
  NBCOption,
  atticRSIOptions,
  wallRSIOptions,
  wallRSIOptions_7B,
  belowGradeRSIOptions,
  belowGradeRSIOptions_7B,
  windowUValueOptions,
  windowUValueOptions_7B,
  waterHeaterOptions,
  waterHeaterOptions_7B,
  hrvOptions,
  hrvOptions_7B,
  airtightnessOptions,
  airtightnessOptions_7B,
  buildingVolumeOptions,
} from '@/lib/nbc-calculator-data';

export const useNbcCalculator = (onPathwayChange: (info: string) => void) => {
  const [searchParams] = useSearchParams();
  const editingProjectId = searchParams.get('edit');

  const [formData, setFormData] = useState<any>({
    compliancePath: '9362',
    province: 'alberta',
    buildingType: 'single-detached',
    uploadedFiles: [],
    interestedCertifications: [],
  });
  const [points, setPoints] = useState<any>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [complianceStatus, setComplianceStatus] = useState('');
  const [warnings, setWarnings] = useState<any>({});
  const [expandedWarnings, setExpandedWarnings] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((files: File[]) => {
    setFormData((prev: any) => ({ ...prev, uploadedFiles: [...(prev.uploadedFiles || []), ...files] }));
  }, []);

  const removeFile = useCallback((fileToRemove: File) => {
    setFormData((prev: any) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((file: File) => file !== fileToRemove),
    }));
  }, []);

  const toggleWarning = (warningId: string) => {
    setExpandedWarnings(prev => ({ ...prev, [warningId]: !prev[warningId] }));
  };

  useEffect(() => {
    if (editingProjectId) {
      const fetchProjectData = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('project_summaries')
          .select('*')
          .eq('id', editingProjectId)
          .single();

        if (error) {
          console.error('Error fetching project data:', error);
        } else if (data) {
          setFormData(data);
        }
        setIsLoading(false);
      };
      fetchProjectData();
    }
  }, [editingProjectId]);

  useEffect(() => {
    const newPoints: any = {};
    const zone = formData.province === 'saskatchewan' ? '7B' : '7A';

    newPoints.attic = getPoints(formData.atticRSI, atticRSIOptions);
    newPoints.wall = getPoints(formData.wallRSI, zone === '7B' ? wallRSIOptions_7B : wallRSIOptions);
    newPoints.belowGrade = getPoints(formData.belowGradeRSI, zone === '7B' ? belowGradeRSIOptions_7B : belowGradeRSIOptions);
    newPoints.window = getPoints(formData.windowUValue, zone === '7B' ? windowUValueOptions_7B : windowUValueOptions);
    newPoints.waterHeater = getPoints(formData.waterHeater, zone === '7B' ? waterHeaterOptions_7B : waterHeaterOptions);
    newPoints.hrv = getPoints(formData.hrv, zone === '7B' ? hrvOptions_7B : hrvOptions);
    newPoints.airtightness = getPoints(formData.airtightness, zone === '7B' ? airtightnessOptions_7B : airtightnessOptions);
    newPoints.buildingVolume = getPoints(formData.buildingVolume, buildingVolumeOptions);

    setPoints(newPoints);

    const total = Object.values(newPoints).reduce((sum: any, p) => sum + (p || 0), 0) as number;
    setTotalPoints(total);

    if (total >= 0) {
      setComplianceStatus('Pass');
    } else {
      setComplianceStatus('Fail');
    }
  }, [formData]);

  useEffect(() => {
    const newWarnings: any = {};
    if (formData.compliancePath === '9362') {
      const minWallRSI = formData.province === 'saskatchewan' ? 3.69 : 2.97;
      newWarnings.wallRSI = validateRSI_9362(formData.wallRSI, minWallRSI, 'Above-Grade Walls').warning;
    } else {
      const minWallRSI = 2.97;
      newWarnings.wallRSI = validateRSI(formData.wallRSI, minWallRSI, 'Above-Grade Walls').warning;
    }
    setWarnings(newWarnings);
  }, [formData.wallRSI, formData.compliancePath, formData.province]);
  
  useEffect(() => {
    let pathwayInfo = '';
    if (formData.compliancePath === '9362' || formData.compliancePath === '9368') {
      pathwayInfo = 'Prescriptive Path';
    } else if (formData.compliancePath === '9365' || formData.compliancePath === '9367') {
      pathwayInfo = 'Performance Path';
    }
    onPathwayChange(pathwayInfo);
  }, [formData.compliancePath, onPathwayChange]);

  return {
    formData,
    points,
    totalPoints,
    complianceStatus,
    warnings,
    expandedWarnings,
    isLoading,
    editingProjectId,
    handleInputChange,
    handleFileChange,
    removeFile,
    toggleWarning,
    setFormData,
  };
};