
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  role: string;
}

export const fetchAttendanceRecords = async (user: User | null) => {
  if (!user) return [];

  try {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        student_users (name),
        supervisor_users (name)
      `)
      .order('date', { ascending: false });

    // If user is a student, filter by their records
    if (user.role === 'student') {
      query = query.eq('student_id', user.id);
    }
    // If user is a parent, filter by their child's records
    else if (user.role === 'parent') {
      // First get the parent's linked student_id
      const { data: parentData, error: parentError } = await supabase
        .from('parent_users')
        .select('student_id')
        .eq('id', user.id)
        .maybeSingle();

      if (parentError) {
        console.error('Error fetching parent data:', parentError);
        return [];
      }
      
      if (parentData?.student_id) {
        query = query.eq('student_id', parentData.student_id);
      } else {
        // Parent not linked to a student -> no records should be visible
        return [];
      }
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return [];
  }
};
