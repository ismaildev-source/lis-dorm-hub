
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LogoutConfirmation from '../components/LogoutConfirmation';
import StudentProfileModal from '../components/StudentProfileModal';
import SupervisorDashboardHeader from '../components/supervisor/SupervisorDashboardHeader';
import SupervisorTabNavigation from '../components/supervisor/SupervisorTabNavigation';
import SupervisorAttendanceForm from '../components/supervisor/SupervisorAttendanceForm';
import SupervisorRecentAttendance from '../components/supervisor/SupervisorRecentAttendance';
import SupervisorStudentsList from '../components/supervisor/SupervisorStudentsList';

type AttendanceStatus = 'Present' | 'Absent';
type StudyType = 'Prep1 19:10-20:00' | 'Prep2 21:10-22:00' | 'Saturday Study Time' | 'Sunday Study Time' | 'Extra/Special Study Time';
type GradeLevelType = 'Year 9' | 'Year 10' | 'Year 11' | 'Year 12' | 'Year 13';

interface Student {
  id: string;
  name: string;
  grade_level: GradeLevelType;
  email: string;
  username: string;
  stream: string;
  room: string;
  age?: number;
  date_of_birth?: string;
  home_address?: string;
  parent_name?: string;
  parent_contact?: string;
  shoe_rack_number?: string;
}

interface AttendanceRecord {
  student_id: string;
  attendance_status: AttendanceStatus;
  date: string;
  study_types: StudyType[];
  grade_level: GradeLevelType;
  absent_reason: string;
  is_late: boolean;
  is_noise: boolean;
  is_leave_early: boolean;
  is_doing_nothing: boolean;
  comments: string;
}

const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentProfile, setShowStudentProfile] = useState(false);

  // Form state
  const [attendanceForm, setAttendanceForm] = useState({
    student_id: '',
    attendance_status: 'Present' as AttendanceStatus,
    date: new Date().toISOString().split('T')[0],
    study_types: [] as StudyType[],
    grade_level: 'Year 9' as GradeLevelType,
    absent_reason: '',
    is_late: false,
    is_noise: false,
    is_leave_early: false,
    is_doing_nothing: false,
    comments: '',
  });

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    fetchStudents();
    fetchAttendanceRecords();
  }, []);

  const fetchStudents = async () => {
    try {
      // Only fetch students assigned to this supervisor
      const { data, error } = await supabase
        .from('student_users')
        .select('*')
        .eq('supervisor_id', user?.id);
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          student_users!inner(name)
        `)
        .eq('supervisor_id', user?.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const handleStudentChange = (studentId: string) => {
    const selectedStudent = students.find(s => s.id === studentId);
    setAttendanceForm({
      ...attendanceForm,
      student_id: studentId,
      grade_level: selectedStudent?.grade_level || 'Year 9'
    });
  };

  const handleFormChange = (updates: Partial<typeof attendanceForm>) => {
    setAttendanceForm(prev => ({ ...prev, ...updates }));
  };

  const handleStudyTypeChange = (studyType: StudyType, checked: boolean) => {
    const updatedStudyTypes = checked
      ? [...attendanceForm.study_types, studyType]
      : attendanceForm.study_types.filter(type => type !== studyType);
    
    setAttendanceForm({
      ...attendanceForm,
      study_types: updatedStudyTypes
    });
  };

  const handleSubmitAttendance = async () => {
    try {
      setLoading(true);
      
      // For now, we'll store the first study type in the database
      // In a real implementation, you might want to modify the database schema
      const attendanceData = {
        student_id: attendanceForm.student_id,
        attendance_status: attendanceForm.attendance_status,
        date: attendanceForm.date,
        study_type: attendanceForm.study_types[0] || 'Prep1 19:10-20:00',
        grade_level: attendanceForm.grade_level,
        absent_reason: attendanceForm.absent_reason,
        is_late: attendanceForm.is_late,
        is_noise: attendanceForm.is_noise,
        is_leave_early: attendanceForm.is_leave_early,
        is_doing_nothing: attendanceForm.is_doing_nothing,
        comments: attendanceForm.comments,
        supervisor_id: user?.id,
      };

      const { error } = await supabase
        .from('attendance')
        .insert([attendanceData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance recorded successfully",
      });

      // Reset form
      setAttendanceForm({
        student_id: '',
        attendance_status: 'Present',
        date: new Date().toISOString().split('T')[0],
        study_types: [],
        grade_level: 'Year 9',
        absent_reason: '',
        is_late: false,
        is_noise: false,
        is_leave_early: false,
        is_doing_nothing: false,
        comments: '',
      });

      fetchAttendanceRecords();
    } catch (error: any) {
      console.error('Error submitting attendance:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record attendance",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentProfile(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SupervisorDashboardHeader 
        userName={user?.name || ''}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SupervisorTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          studentsCount={students.length}
        />

        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SupervisorAttendanceForm
              students={students}
              attendanceForm={attendanceForm}
              loading={loading}
              onStudentChange={handleStudentChange}
              onFormChange={handleFormChange}
              onStudyTypeChange={handleStudyTypeChange}
              onSubmit={handleSubmitAttendance}
            />
            <SupervisorRecentAttendance attendanceRecords={attendanceRecords} />
          </div>
        )}

        {activeTab === 'students' && (
          <SupervisorStudentsList
            students={students}
            onViewProfile={handleViewProfile}
          />
        )}
      </div>

      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />

      <StudentProfileModal
        student={selectedStudent}
        isOpen={showStudentProfile}
        onClose={() => {
          setShowStudentProfile(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};

export default SupervisorDashboard;
