
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
      
      const attendanceData = {
        student_id: attendanceForm.student_id,
        attendance_status: attendanceForm.attendance_status,
        date: attendanceForm.date,
        study_type: attendanceForm.study_types[0] || 'Prep1 19:10-20:00',
        study_types: attendanceForm.study_types,
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

  const getStudyTypesDisplay = (record: any) => {
    if (record.study_types && record.study_types.length > 0) {
      return record.study_types.join(', ');
    }
    return record.study_type || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Supervisor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Welcome, {user?.name}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-white hover:bg-gray-50"
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
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center space-x-2 py-4 px-2 font-medium text-sm transition-colors ${
                activeTab === 'attendance'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={20} />
              <span>Take Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center space-x-2 py-4 px-2 font-medium text-sm transition-colors ${
                activeTab === 'students'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
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
            <Card className="bg-white shadow-sm">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Calendar className="w-5 h-5" />
                  <span>Take Attendance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="student" className="text-gray-700 font-medium">Student</Label>
                  <Select value={attendanceForm.student_id} onValueChange={handleStudentChange}>
                    <SelectTrigger className="mt-2 bg-white">
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
                  <Label htmlFor="attendance-status" className="text-gray-700 font-medium">Attendance Status</Label>
                  <Select 
                    value={attendanceForm.attendance_status} 
                    onValueChange={(value: AttendanceStatus) => setAttendanceForm({...attendanceForm, attendance_status: value})}
                  >
                    <SelectTrigger className="mt-2 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date" className="text-gray-700 font-medium">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={attendanceForm.date}
                    onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                    className="mt-2 bg-white"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700 font-medium">Study Types (Select one or more)</Label>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    {studyTypeOptions.map((studyType) => (
                      <div key={studyType} className="flex items-center space-x-3">
                        <Checkbox
                          id={studyType}
                          checked={attendanceForm.study_types.includes(studyType)}
                          onCheckedChange={(checked) => handleStudyTypeChange(studyType, !!checked)}
                        />
                        <Label htmlFor={studyType} className="text-sm font-medium text-gray-700">
                          {studyType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {attendanceForm.attendance_status === 'Absent' && (
                  <div>
                    <Label htmlFor="absent-reason" className="text-gray-700 font-medium">Absent Reason</Label>
                    <Input
                      id="absent-reason"
                      value={attendanceForm.absent_reason}
                      onChange={(e) => setAttendanceForm({...attendanceForm, absent_reason: e.target.value})}
                      placeholder="Enter reason for absence"
                      className="mt-2 bg-white"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-gray-700 font-medium">Behavioral Notes</Label>
                  <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="late"
                        checked={attendanceForm.is_late}
                        onCheckedChange={(checked) => setAttendanceForm({...attendanceForm, is_late: !!checked})}
                      />
                      <Label htmlFor="late" className="text-sm font-medium text-gray-700">Late</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="noise"
                        checked={attendanceForm.is_noise}
                        onCheckedChange={(checked) => setAttendanceForm({...attendanceForm, is_noise: !!checked})}
                      />
                      <Label htmlFor="noise" className="text-sm font-medium text-gray-700">Noise</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="leave-early"
                        checked={attendanceForm.is_leave_early}
                        onCheckedChange={(checked) => setAttendanceForm({...attendanceForm, is_leave_early: !!checked})}
                      />
                      <Label htmlFor="leave-early" className="text-sm font-medium text-gray-700">Leave Early</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="doing-nothing"
                        checked={attendanceForm.is_doing_nothing}
                        onCheckedChange={(checked) => setAttendanceForm({...attendanceForm, is_doing_nothing: !!checked})}
                      />
                      <Label htmlFor="doing-nothing" className="text-sm font-medium text-gray-700">Doing Nothing</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments" className="text-gray-700 font-medium">Comments</Label>
                  <Textarea
                    id="comments"
                    value={attendanceForm.comments}
                    onChange={(e) => setAttendanceForm({...attendanceForm, comments: e.target.value})}
                    placeholder="Enter any additional comments..."
                    rows={3}
                    className="mt-2 bg-white"
                  />
                </div>

                <Button 
                  onClick={handleSubmitAttendance} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
                  disabled={loading || !attendanceForm.student_id || attendanceForm.study_types.length === 0}
                >
                  {loading ? 'Recording...' : 'Submit Attendance'}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Attendance Records */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Users className="w-5 h-5" />
                  <span>Recent Attendance Records</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Study Types</TableHead>
                        <TableHead>Issues</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.slice(0, 10).map((record: any) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-semibold text-blue-900">
                            {record.student_users?.name}
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              record.attendance_status === 'Present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.attendance_status}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(record.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {getStudyTypesDisplay(record)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {record.is_late && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Late</span>}
                              {record.is_noise && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Noise</span>}
                              {record.is_leave_early && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Left Early</span>}
                              {record.is_doing_nothing && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Inactive</span>}
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
          <Card className="bg-white shadow-sm">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-purple-800">
                  <Users className="w-5 h-5" />
                  <span>Students Under My Supervision</span>
                </div>
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                  Total: {students.length}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {students.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Users className="mx-auto h-16 w-16" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Students Assigned</h3>
                  <p className="text-gray-500">No students have been assigned to your supervision yet.</p>
                </div>
              ) : (
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
                        <TableCell className="font-semibold text-blue-900">{student.name}</TableCell>
                        <TableCell>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {student.grade_level}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                            Stream {student.stream}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">{student.room}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewProfile(student)}
                            className="bg-white hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
