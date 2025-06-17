
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, Calendar, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface Student {
  id: string;
  name: string;
  grade_level: string;
}

const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState({
    student_id: '',
    attendance_status: 'Present' as const,
    date: new Date().toISOString().split('T')[0],
    study_type: 'Prep1 19:10-20:00' as const,
    grade_level: 'Year 9' as const,
    absent_reason: '',
    is_late: false,
    is_noise: false,
    is_leave_early: false,
    is_doing_nothing: false
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('student_users')
        .select('id, name, grade_level');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('attendance')
        .insert([{
          ...attendanceData,
          supervisor_id: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance recorded successfully",
      });

      // Reset form
      setAttendanceData({
        student_id: '',
        attendance_status: 'Present',
        date: new Date().toISOString().split('T')[0],
        study_type: 'Prep1 19:10-20:00',
        grade_level: 'Year 9',
        absent_reason: '',
        is_late: false,
        is_noise: false,
        is_leave_early: false,
        is_doing_nothing: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record attendance",
        variant: "destructive",
      });
    }
  };

  const selectedStudent = students.find(s => s.id === attendanceData.student_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">DormHub Supervisor</h1>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Take Attendance</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="student">Student</Label>
                <select
                  id="student"
                  value={attendanceData.student_id}
                  onChange={(e) => {
                    const selectedStudent = students.find(s => s.id === e.target.value);
                    setAttendanceData({
                      ...attendanceData,
                      student_id: e.target.value,
                      grade_level: selectedStudent?.grade_level as any || 'Year 9'
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.grade_level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="attendance_status">Attendance Status</Label>
                <select
                  id="attendance_status"
                  value={attendanceData.attendance_status}
                  onChange={(e) => setAttendanceData({
                    ...attendanceData,
                    attendance_status: e.target.value as 'Present' | 'Absent'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={attendanceData.date}
                  onChange={(e) => setAttendanceData({...attendanceData, date: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="study_type">Study Type</Label>
                <select
                  id="study_type"
                  value={attendanceData.study_type}
                  onChange={(e) => setAttendanceData({
                    ...attendanceData,
                    study_type: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Prep1 19:10-20:00">Prep1 19:10-20:00</option>
                  <option value="Prep2 21:10-22:00">Prep2 21:10-22:00</option>
                  <option value="Saturday Study Time">Saturday Study Time</option>
                  <option value="Sunday Study Time">Sunday Study Time</option>
                  <option value="Extra/Special Study Time">Extra/Special Study Time</option>
                </select>
              </div>

              <div>
                <Label htmlFor="grade_level">Grade Level</Label>
                <select
                  id="grade_level"
                  value={attendanceData.grade_level}
                  onChange={(e) => setAttendanceData({
                    ...attendanceData,
                    grade_level: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={!!selectedStudent}
                >
                  <option value="Year 9">Year 9</option>
                  <option value="Year 10">Year 10</option>
                  <option value="Year 11">Year 11</option>
                  <option value="Year 12">Year 12</option>
                  <option value="Year 13">Year 13</option>
                </select>
              </div>

              {attendanceData.attendance_status === 'Absent' && (
                <div className="md:col-span-2">
                  <Label htmlFor="absent_reason">Absent Reason</Label>
                  <Input
                    id="absent_reason"
                    value={attendanceData.absent_reason}
                    onChange={(e) => setAttendanceData({...attendanceData, absent_reason: e.target.value})}
                    placeholder="Enter reason for absence"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={attendanceData.is_late}
                  onChange={(e) => setAttendanceData({...attendanceData, is_late: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">Late</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={attendanceData.is_noise}
                  onChange={(e) => setAttendanceData({...attendanceData, is_noise: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">Noise</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={attendanceData.is_leave_early}
                  onChange={(e) => setAttendanceData({...attendanceData, is_leave_early: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">Leave Early</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={attendanceData.is_doing_nothing}
                  onChange={(e) => setAttendanceData({...attendanceData, is_doing_nothing: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">Doing Nothing</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Submit Attendance
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
