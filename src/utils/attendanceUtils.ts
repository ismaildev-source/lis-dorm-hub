
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  role: string;
  name?: string;
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
      console.log('Fetching attendance for parent:', user.id);
      
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
      
      console.log('Parent data found:', parentData);
      
      if (parentData?.student_id) {
        console.log('Filtering attendance by student_id:', parentData.student_id);
        query = query.eq('student_id', parentData.student_id);
      } else {
        // Parent not linked to a student
        console.log('Parent not linked to any student');
        
        // Try to find student by parent name matching
        const { data: studentData, error: studentError } = await supabase
          .from('student_users')
          .select('id, parent_name')
          .ilike('parent_name', `%${user.name || ''}%`)
          .maybeSingle();

        if (studentError) {
          console.error('Error finding student by parent name:', studentError);
          return [];
        }

        if (studentData) {
          console.log('Found student by parent name match:', studentData);
          query = query.eq('student_id', studentData.id);
        } else {
          console.log('No student found for parent');
          return [];
        }
      }
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
    
    console.log('Attendance records found:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return [];
  }
};
