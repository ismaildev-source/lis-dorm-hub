-- Fix the supervisor attendance submission with proper student verification
-- The issue is that the policy needs to verify the supervisor can create attendance for the specific student

-- Drop the too-simple policy
DROP POLICY IF EXISTS "Supervisors can create attendance for their students" ON public.attendance;

-- Create a proper policy that ensures:
-- 1. The user is a supervisor 
-- 2. The supervisor_id in the attendance record matches the authenticated user
-- 3. The student being marked for attendance is actually assigned to this supervisor
CREATE POLICY "Supervisors can create attendance for their students" 
ON public.attendance 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Check if user is a supervisor and supervisor_id matches their ID
  EXISTS (
    SELECT 1 
    FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text 
    AND supervisor_users.id = attendance.supervisor_id
  )
  AND
  -- Check if the student is assigned to this supervisor
  EXISTS (
    SELECT 1 
    FROM public.student_users 
    WHERE student_users.id = attendance.student_id 
    AND student_users.supervisor_id = attendance.supervisor_id
  )
);