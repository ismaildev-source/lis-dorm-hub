-- Fix critical security vulnerability in attendance table
-- Drop the overly permissive policy that allows all operations to everyone
DROP POLICY IF EXISTS "Allow all operations on attendance" ON public.attendance;

-- Create secure RLS policies for attendance table based on user roles and relationships

-- Students can view their own attendance records only
CREATE POLICY "Students can view their own attendance" 
ON public.attendance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.student_users 
    WHERE student_users.id::text = auth.uid()::text 
    AND student_users.id = attendance.student_id
  )
);

-- Parents can view their child's attendance records
CREATE POLICY "Parents can view their child's attendance" 
ON public.attendance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.parent_users 
    WHERE parent_users.id::text = auth.uid()::text 
    AND parent_users.student_id = attendance.student_id
  )
);

-- Supervisors can view attendance records for students they supervise
CREATE POLICY "Supervisors can view their students' attendance" 
ON public.attendance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text 
    AND supervisor_users.id = attendance.supervisor_id
  )
);

-- Admins can view all attendance records
CREATE POLICY "Admins can view all attendance" 
ON public.attendance 
FOR SELECT 
USING (public.is_admin());

-- Only supervisors can create attendance records for students they supervise
CREATE POLICY "Supervisors can create attendance for their students" 
ON public.attendance 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text 
    AND supervisor_users.id = attendance.supervisor_id
  )
);

-- Admins can create any attendance record
CREATE POLICY "Admins can create any attendance record" 
ON public.attendance 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Only supervisors can update attendance records for students they supervise
CREATE POLICY "Supervisors can update their students' attendance" 
ON public.attendance 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text 
    AND supervisor_users.id = attendance.supervisor_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.supervisor_users 
    WHERE supervisor_users.id::text = auth.uid()::text 
    AND supervisor_users.id = attendance.supervisor_id
  )
);

-- Admins can update any attendance record
CREATE POLICY "Admins can update any attendance record" 
ON public.attendance 
FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Only admins can delete attendance records
CREATE POLICY "Admins can delete attendance records" 
ON public.attendance 
FOR DELETE 
USING (public.is_admin());