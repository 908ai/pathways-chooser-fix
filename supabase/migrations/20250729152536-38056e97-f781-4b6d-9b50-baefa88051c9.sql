-- Create the app_role enum type that's missing
CREATE TYPE public.app_role AS ENUM ('admin', 'account_manager', 'user');

-- Update the user_roles table to use the proper app_role type
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE public.app_role USING role::text::public.app_role;