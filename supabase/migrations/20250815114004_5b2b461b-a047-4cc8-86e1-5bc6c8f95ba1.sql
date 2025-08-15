-- SECURITY FIX: Remove dangerous public credential access policies
-- These policies expose sensitive user data including passwords to anyone

-- Remove all "Allow credential verification" policies that expose user data publicly
DROP POLICY IF EXISTS "Allow credential verification for admin login" ON public.admin_users;
DROP POLICY IF EXISTS "Allow credential verification for supervisor login" ON public.supervisor_users;
DROP POLICY IF EXISTS "Allow credential verification for student login" ON public.student_users;
DROP POLICY IF EXISTS "Allow credential verification for parent login" ON public.parent_users;

-- Create a secure server-side authentication function
-- This function will securely verify credentials without exposing user data
CREATE OR REPLACE FUNCTION public.authenticate_user(
  p_username TEXT,
  p_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
  result JSON;
BEGIN
  -- Check admin_users table
  SELECT id, name, username, email, 'admin'::text as role 
  INTO user_record
  FROM public.admin_users 
  WHERE username = p_username AND password = p_password;
  
  IF FOUND THEN
    result := json_build_object(
      'success', true,
      'user', json_build_object(
        'id', user_record.id,
        'name', user_record.name,
        'username', user_record.username,
        'email', user_record.email,
        'role', user_record.role
      )
    );
    RETURN result;
  END IF;

  -- Check supervisor_users table
  SELECT id, name, username, email, 'supervisor'::text as role 
  INTO user_record
  FROM public.supervisor_users 
  WHERE username = p_username AND password = p_password;
  
  IF FOUND THEN
    result := json_build_object(
      'success', true,
      'user', json_build_object(
        'id', user_record.id,
        'name', user_record.name,
        'username', user_record.username,
        'email', user_record.email,
        'role', user_record.role
      )
    );
    RETURN result;
  END IF;

  -- Check parent_users table
  SELECT id, name, username, email, 'parent'::text as role 
  INTO user_record
  FROM public.parent_users 
  WHERE username = p_username AND password = p_password;
  
  IF FOUND THEN
    result := json_build_object(
      'success', true,
      'user', json_build_object(
        'id', user_record.id,
        'name', user_record.name,
        'username', user_record.username,
        'email', user_record.email,
        'role', user_record.role
      )
    );
    RETURN result;
  END IF;

  -- Check student_users table
  SELECT id, name, username, email, 'student'::text as role 
  INTO user_record
  FROM public.student_users 
  WHERE username = p_username AND password = p_password;
  
  IF FOUND THEN
    result := json_build_object(
      'success', true,
      'user', json_build_object(
        'id', user_record.id,
        'name', user_record.name,
        'username', user_record.username,
        'email', user_record.email,
        'role', user_record.role
      )
    );
    RETURN result;
  END IF;

  -- No user found with matching credentials
  result := json_build_object(
    'success', false,
    'error', 'Invalid username or password'
  );
  RETURN result;
END;
$$;