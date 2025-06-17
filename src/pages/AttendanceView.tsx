
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Eye, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

interface AttendanceRecord {
  id: string;
  date: string;
  attendance_status: string;
  study_type: string;
  grade_level: string;
  absent_reason?: string;
  is_late: boolean;
  is_noise: boolean;
  is_leave_early: boolean;
  is_doing_nothing: boolean;
  student_users: {
    name: string;
  };
  supervisor_users: {
    name: string;
  };
}

const AttendanceView = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [user]);

  const fetchAttendanceRecords = async () => {
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
      if (user?.role === 'student') {
        query = query.eq('student_id', user.id);
      }
      // If user is a parent, filter by their child's records
      else if (user?.role === 'parent') {
        // First get the parent's student_id
        const { data: parentData } = await supabase
          .from('parent_users')
          .select('student_id')
          .eq('id', user.id)
          .single();
        
        if (parentData?.student_id) {
          query = query.eq('student_id', parentData.student_id);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    return status === 'Present' ? 'text-green-600' : 'text-red-600';
  };

  const getBadges = (record: AttendanceRecord) => {
    const badges = [];
    if (record.is_late) badges.push('Late');
    if (record.is_noise) badges.push('Noise');
    if (record.is_leave_early) badges.push('Left Early');
    if (record.is_doing_nothing) badges.push('Inactive');
    return badges;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-purple-600">
                DormHub {user?.role === 'parent' ? 'Parent' : 'Student'} Portal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home size={16} />
                <span>Home</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Attendance Records</h2>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading attendance records...</p>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No attendance records found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Study Type</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{record.student_users.name}</TableCell>
                    <TableCell className={getStatusColor(record.attendance_status)}>
                      {record.attendance_status}
                    </TableCell>
                    <TableCell>{record.study_type}</TableCell>
                    <TableCell>{record.grade_level}</TableCell>
                    <TableCell>{record.supervisor_users.name}</TableCell>
                    <TableCell>
                      {record.absent_reason && (
                        <span className="text-sm text-gray-600">{record.absent_reason}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getBadges(record).map((badge, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
