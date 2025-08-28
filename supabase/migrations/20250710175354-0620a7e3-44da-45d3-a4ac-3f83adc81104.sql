-- Grant account manager role to the current user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('30b6dc76-3a42-412a-b076-fc0117d16164', 'account_manager')
ON CONFLICT (user_id, role) DO NOTHING;