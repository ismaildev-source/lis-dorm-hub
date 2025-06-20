
-- First, let's update the foreign key constraints to handle deletions properly
-- We need to modify the parent_users foreign key to SET NULL when student is deleted
-- And modify the attendance foreign key to RESTRICT deletion if attendance records exist

-- Drop existing foreign key constraints
ALTER TABLE public.parent_users DROP CONSTRAINT IF EXISTS fk_parent_student;
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS attendance_student_id_fkey;

-- Recreate the parent_users foreign key to SET NULL on delete
ALTER TABLE public.parent_users 
ADD CONSTRAINT fk_parent_student 
FOREIGN KEY (student_id) REFERENCES public.student_users(id) ON DELETE SET NULL;

-- Recreate the attendance foreign key to RESTRICT delete (preserve attendance records)
ALTER TABLE public.attendance 
ADD CONSTRAINT attendance_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.student_users(id) ON DELETE RESTRICT;
