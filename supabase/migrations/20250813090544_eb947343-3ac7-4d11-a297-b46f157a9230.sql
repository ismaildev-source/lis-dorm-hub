-- Fix critical security vulnerability in student_users table
-- Drop the overly permissive policy that allows public access to all student data
DROP POLICY IF EXISTS "Allow all operations on student_users" ON public.student_users;

-- Create secure RLS policies for student_users table

-- Students can only view their own profile
CREATE POLICY "Students can view their own profile" 
ON public.student_users 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Students can update their own profile (except sensitive administrative fields)
CREATE POLICY "Students can update their own profile" 
ON public.student_users 
FOR UPDATE 
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Admins can view all student users for management purposes
CREATE POLICY "Admins can view all student users" 
ON public.student_users 
FOR SELECT 
USING (public.is_admin());

-- Only admins can insert new student users
CREATE POLICY "Admins can insert student users" 
ON public.student_users 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Only admins can delete student users
CREATE POLICY "Admins can delete student users" 
ON public.student_users 
FOR DELETE 
USING (public.is_admin());

-- Supervisors can view students assigned to them
CREATE POLICY "Supervisors can view their assigned students" 
ON public.student_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.supervisor_users 
    WHERE id::text = auth.uid()::text
  ) AND supervisor_id::text = auth.uid()::text
);

-- Parents can view their child's profile (if parent_users.student_id matches)
CREATE POLICY "Parents can view their child's profile" 
ON public.student_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.parent_users 
    WHERE id::text = auth.uid()::text 
    AND student_id::text = student_users.id::text
  )
);