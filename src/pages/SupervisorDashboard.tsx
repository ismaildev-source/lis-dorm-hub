
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Calendar, Users, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Checkbox } from '../components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LogoutConfirmation from '../components/LogoutConfirmation';
import StudentProfileModal from '../components/StudentProfileModal';

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

  const studyTypeOptions: StudyType[] = [
    'Prep1 19:10-20:00',
    'Prep2 21:10-22:00',
    'Saturday Study Time',
    'Sunday Study Time',
    'Extra/Special Study Time'
  ];

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Supervisor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
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
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar size={20} />
              <span>Take Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={20} />
              <span>My Students ({students.length})</span>
            </button>
          </nav>
        </div>

        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Attendance Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Take Attendance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <Select value={attendanceForm.student_id} onValueChange={handleStudentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.grade_level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="attendance-status">Attendance Status</Label>
                  <Select 
                    value={attendanceForm.attendance_status} 
                    onValueChange={(value: AttendanceStatus) => setAttendanceForm({...attendanceForm, attendance_status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={attendanceForm.date}
                    onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Study Type</Label>
                  <div className="flex flex-wrap gap-4">
                    {studyTypeOptions.map((studyType) => (
                      <div key={studyType} className="flex items-center space-x-2">
                        <Checkbox
                          id={studyType}
                          checked={attendanceForm.study_types.includes(studyType)}
                          onCheckedChange={(checked) => handleStudyTypeChange(studyType, !!checked)}
                        />
                        <Label htmlFor={studyType} className="whitespace-nowrap text-sm">
                          {studyType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {attendanceForm.attendance_status === 'Absent' && (
                  <div>
                    <Label htmlFor="absent-reason">Absent Reason</Label>
                    <Input
                      id="absent-reason"
                      value={attendanceForm.absent_reason}
                      onChange={(e) => setAttendanceForm({...attendanceForm, absent_reason: e.target.value})}
                      placeholder="Enter reason for absence"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Behavioral Notes</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="late"
                        checked={attendanceForm.is_late}
                        onCheckedChange={(checked) => setAttendanceForm({...attendanceForm, is_late: !!checked})}
                      />
                      <Label htmlFor="late">Late</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="noise"
                        checked={attendanceForm.is_noise}
                        onCheckedChange={(checked) => setAttendanceForm({...attendanceForm, is_noise: !!checked})}
                      />
                      <Label htmlFor="noise">Noise</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="leave-early"
                        checked={attendanceForm.is_leave_early}
                        onCheckedChange={(checked) => setAttendanceForm({...attendanceForm, is_leave_early: !!checked})}
                      />
                      <Label htmlFor="leave-early">Leave Early</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="doing-nothing"
                        checked={attendanceForm.is_doing_nothing}
                        onCheckedChange={(checked) => setAttendanceForm({...attendanceForm, is_doing_nothing: !!checked})}
                      />
                      <Label htmlFor="doing-nothing">Doing Nothing</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    value={attendanceForm.comments}
                    onChange={(e) => setAttendanceForm({...attendanceForm, comments: e.target.value})}
                    placeholder="Enter any additional comments..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSubmitAttendance} 
                  className="w-full"
                  disabled={loading || !attendanceForm.student_id || attendanceForm.study_types.length === 0}
                >
                  Submit Attendance
                </Button>
              </CardContent>
            </Card>

            {/* Recent Attendance Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Recent Attendance Records</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Student</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[150px]">Study Type</TableHead>
                        <TableHead className="min-w-[120px]">Behavioral</TableHead>
                        <TableHead className="min-w-[200px]">Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.slice(0, 10).map((record: any) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.student_users?.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                              record.attendance_status === 'Present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.attendance_status}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{record.date}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.study_type}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {record.is_late && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded whitespace-nowrap">Late</span>}
                              {record.is_noise && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded whitespace-nowrap">Noise</span>}
                              {record.is_leave_early && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded whitespace-nowrap">Left Early</span>}
                              {record.is_doing_nothing && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded whitespace-nowrap">Inactive</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs break-words" title={record.comments}>
                              {record.comments || 'No comments'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Students Under My Supervision</span>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Total: {students.length}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No students assigned to you yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Stream</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.grade_level}</TableCell>
                          <TableCell>{student.stream}</TableCell>
                          <TableCell>{student.room}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewProfile(student)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
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
