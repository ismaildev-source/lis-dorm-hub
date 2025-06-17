
-- Create enum types
CREATE TYPE public.gender_type AS ENUM ('Male', 'Female');
CREATE TYPE public.grade_level AS ENUM ('Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13');
CREATE TYPE public.stream_type AS ENUM ('A', 'B', 'C', 'D');
CREATE TYPE public.attendance_status AS ENUM ('Present', 'Absent');
CREATE TYPE public.study_type AS ENUM ('Prep1 19:10-20:00', 'Prep2 21:10-22:00', 'Saturday Study Time', 'Sunday Study Time', 'Extra/Special Study Time');

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  gender gender_type NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student users table
CREATE TABLE public.student_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  age INTEGER,
  grade_level grade_level NOT NULL,
  date_of_birth DATE,
  stream stream_type NOT NULL,
  room VARCHAR(50) NOT NULL,
  shoe_rack_number VARCHAR(50),
  home_address TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  parent_name VARCHAR(255),
  parent_contact VARCHAR(50),
  supervisor_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supervisor users table
CREATE TABLE public.supervisor_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  gender gender_type NOT NULL,
  date_of_birth DATE,
  room VARCHAR(50) NOT NULL,
  contact VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent users table
CREATE TABLE public.parent_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  gender gender_type NOT NULL,
  contact VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  student_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_users(id) ON DELETE CASCADE,
  supervisor_id UUID NOT NULL REFERENCES public.supervisor_users(id) ON DELETE CASCADE,
  attendance_status attendance_status NOT NULL,
  date DATE NOT NULL,
  study_type study_type NOT NULL,
  grade_level grade_level NOT NULL,
  absent_reason TEXT,
  is_late BOOLEAN DEFAULT FALSE,
  is_noise BOOLEAN DEFAULT FALSE,
  is_leave_early BOOLEAN DEFAULT FALSE,
  is_doing_nothing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE public.student_users 
ADD CONSTRAINT fk_student_supervisor 
FOREIGN KEY (supervisor_id) REFERENCES public.supervisor_users(id);

ALTER TABLE public.parent_users 
ADD CONSTRAINT fk_parent_student 
FOREIGN KEY (student_id) REFERENCES public.student_users(id);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now, can be refined later)
CREATE POLICY "Allow all operations on admin_users" ON public.admin_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on student_users" ON public.student_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on supervisor_users" ON public.supervisor_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on parent_users" ON public.parent_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on attendance" ON public.attendance FOR ALL USING (true);

-- Insert a default admin user
INSERT INTO public.admin_users (name, username, gender, email, password)
VALUES ('Super Admin', 'admin', 'Male', 'admin@dormhub.com', 'admin123');
