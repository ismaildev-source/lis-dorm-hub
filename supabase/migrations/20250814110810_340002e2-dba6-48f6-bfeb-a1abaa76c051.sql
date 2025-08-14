-- Fix login authentication by allowing credential verification queries
-- The current RLS policies prevent login since they require auth.uid() which isn't available during login

-- Allow credential verification for admin_users during login
CREATE POLICY "Allow credential verification for admin login" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Allow credential verification for supervisor_users during login  
CREATE POLICY "Allow credential verification for supervisor login" 
ON public.supervisor_users 
FOR SELECT 
USING (true);

-- Allow credential verification for student_users during login
CREATE POLICY "Allow credential verification for student login" 
ON public.student_users 
FOR SELECT 
USING (true);

-- Allow credential verification for parent_users during login
CREATE POLICY "Allow credential verification for parent login" 
ON public.parent_users 
FOR SELECT 
USING (true);