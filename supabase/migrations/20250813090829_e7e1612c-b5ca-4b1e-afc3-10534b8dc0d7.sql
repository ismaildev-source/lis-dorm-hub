-- Fix critical security vulnerability in supervisor_users table
-- Drop the overly permissive policy that allows public access to all supervisor data
DROP POLICY IF EXISTS "Allow all operations on supervisor_users" ON public.supervisor_users;

-- Create secure RLS policies for supervisor_users table

-- Supervisors can only view their own profile
CREATE POLICY "Supervisors can view their own profile" 
ON public.supervisor_users 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Supervisors can update their own profile
CREATE POLICY "Supervisors can update their own profile" 
ON public.supervisor_users 
FOR UPDATE 
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Admins can view all supervisor users for management purposes
CREATE POLICY "Admins can view all supervisor users" 
ON public.supervisor_users 
FOR SELECT 
USING (public.is_admin());

-- Only admins can insert new supervisor users
CREATE POLICY "Admins can insert supervisor users" 
ON public.supervisor_users 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Only admins can delete supervisor users
CREATE POLICY "Admins can delete supervisor users" 
ON public.supervisor_users 
FOR DELETE 
USING (public.is_admin());

-- Admins can update any supervisor user
CREATE POLICY "Admins can update supervisor users" 
ON public.supervisor_users 
FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());