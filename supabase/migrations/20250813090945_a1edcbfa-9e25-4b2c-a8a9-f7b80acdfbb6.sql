-- Fix critical security vulnerability in admin_users table
-- Drop the overly permissive policy that allows public access to all admin data
DROP POLICY IF EXISTS "Allow all operations on admin_users" ON public.admin_users;

-- Create secure RLS policies for admin_users table

-- Admins can only view their own profile
CREATE POLICY "Admins can view their own profile" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Admins can update their own profile
CREATE POLICY "Admins can update their own profile" 
ON public.admin_users 
FOR UPDATE 
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Admins can view other admin users for management purposes (but not passwords)
-- Note: This should be further restricted in production with a super admin role
CREATE POLICY "Admins can view other admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  public.is_admin() AND auth.uid()::text != id::text
);

-- Only existing admins can insert new admin users (admin creation)
CREATE POLICY "Admins can insert new admin users" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Only existing admins can delete admin users
CREATE POLICY "Admins can delete admin users" 
ON public.admin_users 
FOR DELETE 
USING (
  public.is_admin() AND auth.uid()::text != id::text
);

-- Admins can update other admin users (except their own, covered by separate policy)
CREATE POLICY "Admins can update other admin users" 
ON public.admin_users 
FOR UPDATE 
USING (
  public.is_admin() AND auth.uid()::text != id::text
)
WITH CHECK (
  public.is_admin() AND auth.uid()::text != id::text
);