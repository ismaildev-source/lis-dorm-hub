-- Fix attendance submission RLS policy for supervisors
-- The current policy is too restrictive and prevents supervisors from submitting attendance

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Supervisors can create attendance for their students" ON public.attendance;

-- Create a more permissive policy that allows supervisors to create attendance records
-- This policy checks if the user is a valid supervisor and the supervisor_id matches their ID
CREATE POLICY "Supervisors can create attendance for their students" 
ON public.attendance 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text 
    AND supervisor_users.id = attendance.supervisor_id
  )
);