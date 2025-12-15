-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'account_manager', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create a function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE 
      WHEN role = 'admin' THEN 1
      WHEN role = 'account_manager' THEN 2 
      WHEN role = 'user' THEN 3
    END
  LIMIT 1
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Update project_summaries policies to allow account managers to access all projects
CREATE POLICY "Account managers can view all project summaries" 
ON public.project_summaries 
FOR SELECT 
USING (public.has_role(auth.uid(), 'account_manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Account managers can delete all project summaries" 
ON public.project_summaries 
FOR DELETE 
USING (public.has_role(auth.uid(), 'account_manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Account managers can update all project summaries" 
ON public.project_summaries 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'account_manager') OR public.has_role(auth.uid(), 'admin'));

-- Update companies policies to allow account managers to access all companies
CREATE POLICY "Account managers can view all company profiles" 
ON public.companies 
FOR SELECT 
USING (public.has_role(auth.uid(), 'account_manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Account managers can update all company profiles" 
ON public.companies 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'account_manager') OR public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin role (you'll need to replace this UUID with your actual user ID)
-- For now, I'll add a comment with instructions
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-id-here', 'account_manager');