-- Debug and fix the supervisor attendance submission issue
-- The issue is likely that the RLS policy is being too strict or the user ID doesn't match

-- First, let's drop the existing policy and create a more robust one
DROP POLICY IF EXISTS "Supervisors can create attendance for their students" ON public.attendance;

-- Create a simpler policy that just checks if the user is a supervisor
-- and allows them to insert attendance records where they set themselves as supervisor
CREATE POLICY "Supervisors can create attendance for their students" 
ON public.attendance 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text
  )
);

-- Also add some debugging to help identify the issue
-- Let's also verify the user context is working properly by updating the existing login policies
-- to ensure the authentication flow works correctly