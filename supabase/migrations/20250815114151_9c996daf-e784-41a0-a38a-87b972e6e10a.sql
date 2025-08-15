-- Fix remaining attendance security issues
-- These were created during the previous attendance submission fix

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow attendance insertion for authenticated users" ON public.attendance;
DROP POLICY IF EXISTS "Supervisors can view their students' attendance" ON public.attendance;

-- Recreate proper attendance policies with correct restrictions

-- Only supervisors can create attendance records for their assigned students
CREATE POLICY "Supervisors can create attendance for assigned students" 
ON public.attendance 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- User must be a supervisor
  EXISTS (
    SELECT 1 
    FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text
  )
  AND
  -- The supervisor_id in the record must match the authenticated user
  attendance.supervisor_id::text = auth.uid()::text
  AND
  -- The student must be assigned to this supervisor
  EXISTS (
    SELECT 1 
    FROM public.student_users 
    WHERE student_users.id = attendance.student_id 
    AND student_users.supervisor_id::text = auth.uid()::text
  )
);

-- Supervisors can only view attendance for their assigned students
CREATE POLICY "Supervisors can view assigned students attendance" 
ON public.attendance 
FOR SELECT 
TO authenticated
USING (
  -- User must be a supervisor and can only see their own supervised attendance
  EXISTS (
    SELECT 1 
    FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text
    AND supervisor_users.id = attendance.supervisor_id
  )
);