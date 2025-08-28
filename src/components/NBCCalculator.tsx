import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface NBCCalculatorProps {
  onPathwayChange?: (info: string) => void;
}

const NBCCalculator: React.FC<NBCCalculatorProps> = ({ onPathwayChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selections, setSelections] = useState<any>({
    company: "",
    compliancePath: "",
    // ...add other fields as needed
  });

  // Example: update pathway info
  useEffect(() => {
    if (onPathwayChange) {
      onPathwayChange(selections.compliancePath || "");
    }
  }, [selections.compliancePath, onPathwayChange]);

  // Load project data if editing
  useEffect(() => {
    const editProjectId = searchParams.get("edit");
    if (editProjectId && user) {
      loadProjectForEditing(editProjectId);
    }
    // eslint-disable-next-line
  }, [searchParams, user]);

  const loadProjectForEditing = async (projectId: string) => {
    setIsLoading(true);
    try {
      // Load project data using Supabase client
      const { data: project, error: projectError } = await supabase
        .from("project_summaries")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();
      if (projectError) throw projectError;
      if (!project) throw new Error("Project not found");

      // Load user company information
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();
      if (companyError && companyError.code !== "PGRST116") {
        console.error("Error loading company data:", companyError);
      }
      // ...populate selections as needed
    } catch (error) {
      // ...handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitApplication = async (
    pathType: "performance" | "prescriptive"
  ) => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found. Please sign in again.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Get company information using supabase client
      const session = await supabase.auth.getSession();
      let finalCompanyName = selections.company || "Your Company";
      if (session.data.session) {
        try {
          const { data } = await supabase
            .from("companies")
            .select("company_name")
            .eq("user_id", user.id);
          if (data && data.length > 0 && data[0].company_name) {
            finalCompanyName = data[0].company_name;
          }
        } catch (companyError) {
          console.warn("Could not fetch company data:", companyError);
        }
      }

      // Send confirmation email (unchanged)
      const { data, error } = await supabase.functions.invoke(
        "send-confirmation-email",
        {
          body: {
            userEmail: user.email,
            companyName: finalCompanyName,
            compliancePath: selections.compliancePath,
            selections: selections,
          },
        }
      );
      if (error) {
        console.warn("Email sending failed:", error);
      }

      // ... (rest unchanged)
    } catch (error: any) {
      // ... (unchanged)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Minimal JSX for demonstration
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">NBC Calculator</h2>
      {/* ...rest of your calculator UI */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => handleSubmitApplication("performance")}
        disabled={isSubmitting}
      >
        Submit Performance Path
      </button>
    </div>
  );
};

export default NBCCalculator;