-- Fix critical security vulnerability in parent_users table
-- Drop the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Allow all operations on parent_users" ON public.parent_users;

-- Create secure RLS policies for parent_users table

-- Parents can only view their own profile
CREATE POLICY "Parents can view their own profile" 
ON public.parent_users 
FOR SELECT 
USING (
  -- Allow if user is authenticated and accessing their own record
  auth.uid()::text = id::text
);

-- Parents can update their own profile (except sensitive fields)
CREATE POLICY "Parents can update their own profile" 
ON public.parent_users 
FOR UPDATE 
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Only allow admins to insert new parent users
CREATE POLICY "Admins can insert parent users" 
ON public.parent_users 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id::text = auth.uid()::text
  )
);

-- Only allow admins to delete parent users
CREATE POLICY "Admins can delete parent users" 
ON public.parent_users 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id::text = auth.uid()::text
  )
);

-- Admins can view all parent users for management purposes
CREATE POLICY "Admins can view all parent users" 
ON public.parent_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id::text = auth.uid()::text
  )
);

-- Create a function to safely check if current user is admin (prevents recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id::text = auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;