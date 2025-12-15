-- Create file_requests table to store Dropbox file request links
CREATE TABLE public.file_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.project_summaries(id) ON DELETE CASCADE,
  folder_name TEXT NOT NULL,
  file_request_url TEXT NOT NULL,
  folder_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.file_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for file_requests
CREATE POLICY "Users can view their own file requests" 
ON public.file_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.project_summaries ps 
    WHERE ps.id = file_requests.project_id 
    AND ps.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create file requests for their projects" 
ON public.file_requests 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_summaries ps 
    WHERE ps.id = file_requests.project_id 
    AND ps.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own file requests" 
ON public.file_requests 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.project_summaries ps 
    WHERE ps.id = file_requests.project_id 
    AND ps.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own file requests" 
ON public.file_requests 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.project_summaries ps 
    WHERE ps.id = file_requests.project_id 
    AND ps.user_id = auth.uid()
  )
);

-- Account managers can view all file requests
CREATE POLICY "Account managers can view all file requests" 
ON public.file_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Account managers can update all file requests
CREATE POLICY "Account managers can update all file requests" 
ON public.file_requests 
FOR UPDATE 
USING (has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Account managers can delete all file requests
CREATE POLICY "Account managers can delete all file requests" 
ON public.file_requests 
FOR DELETE 
USING (has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_file_requests_updated_at
BEFORE UPDATE ON public.file_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();