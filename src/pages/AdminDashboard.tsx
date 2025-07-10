import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, UserPlus, Shield, GraduationCap, User, Calendar, Download, Eye, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import AdminUserManagement from '../components/AdminUserManagement';
import SupervisorUserManagement from '../components/SupervisorUserManagement';
import StudentUserManagement from '../components/StudentUserManagement';
import ParentUserManagement from '../components/ParentUserManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import LogoutConfirmation from '../components/LogoutConfirmation';
import SupervisorStudentsView from '../components/SupervisorStudentsView';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [userCounts, setUserCounts] = useState({
    admin: 0,
    supervisor: 0,
    parent: 0,
    student: 0,
  });
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const fetchUserCounts = async () => {
    try {
      const [adminResult, supervisorResult, parentResult, studentResult] = await Promise.all([
        supabase.from('admin_users').select('id', { count: 'exact' }),
        supabase.from('supervisor_users').select('id', { count: 'exact' }),
        supabase.from('parent_users').select('id', { count: 'exact' }),
        supabase.from('student_users').select('id', { count: 'exact' })
      ]);

      setUserCounts({
        admin: adminResult.count || 0,
        supervisor: supervisorResult.count || 0,
        parent: parentResult.count || 0,
        student: studentResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const { data, error } = await supabase
        .from('supervisor_users')
        .select('id, name, email');
      
      if (error) throw error;
      setSupervisors(data || []);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          student_users (name),
          supervisor_users (name)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  useEffect(() => {
    fetchUserCounts();
    fetchSupervisors();
    fetchAttendanceRecords();
  }, []);

  const exportAttendanceToCSV = () => {
    const headers = ['Date', 'Student', 'Status', 'Study Type', 'Grade', 'Supervisor', 'Absent Reason', 'Late', 'Noise', 'Left Early', 'Inactive', 'Comments'];
    const csvContent = [
      headers.join(','),
      ...attendanceRecords.map(record => [
        record.date,
        record.student_users?.name || 'N/A',
        record.attendance_status,
        record.study_type,
        record.grade_level,
        record.supervisor_users?.name || 'N/A',
        record.absent_reason || '',
        record.is_late ? 'Yes' : 'No',
        record.is_noise ? 'Yes' : 'No',
        record.is_leave_early ? 'Yes' : 'No',
        record.is_doing_nothing ? 'Yes' : 'No',
        record.comments || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_records.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printTable = (tableId: string, title: string) => {
    const printWindow = window.open('', '_blank');
    const table = document.getElementById(tableId);
    if (table && printWindow) {
      // Clone the table and remove action buttons
      const clonedTable = table.cloneNode(true) as HTMLElement;
      
      // Remove action columns and buttons
      const actionHeaders = clonedTable.querySelectorAll('th:last-child');
      actionHeaders.forEach(header => {
        if (header.textContent?.toLowerCase().includes('action')) {
          header.remove();
        }
      });
      
      const actionCells = clonedTable.querySelectorAll('td:last-child');
      actionCells.forEach(cell => {
        if (cell.querySelector('button')) {
          cell.remove();
        }
      });

      // Remove any buttons from the cloned table
      const buttons = clonedTable.querySelectorAll('button');
      buttons.forEach(button => button.remove());

      printWindow.document.write(`
        <html>
          <head>
            <title>Print ${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1e40af; margin-bottom: 20px; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            ${clonedTable.outerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'admins', label: 'Admins', icon: Shield },
    { id: 'supervisors', label: 'Supervisors', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'parents', label: 'Parents', icon: User },
    { id: 'attendance', label: 'Attendance Records', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-blue-600 truncate">LIS Dorm Karen Admin</h1>
            </div>
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 flex-shrink-0">
              <span className="text-xs sm:text-sm text-gray-700 hidden sm:block">Welcome, {user?.name}</span>
              <span className="text-xs text-gray-700 sm:hidden">Hi, {user?.name?.split(' ')[0]}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 shadow-sm text-xs sm:text-sm px-2 sm:px-3"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-4 sm:mb-8 p-1">
          <nav className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 flex-1 sm:flex-none min-w-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* User Counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{userCounts.admin}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Supervisors</p>
                    <p className="text-2xl font-bold text-gray-900">{userCounts.supervisor}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <User className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Parents</p>
                    <p className="text-2xl font-bold text-gray-900">{userCounts.parent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">{userCounts.student}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supervisors and their students */}
            <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <CardTitle className="text-xl font-bold text-gray-800">Supervisors and Their Students</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {supervisors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No supervisors found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supervisors.map((supervisor) => (
                      <div key={supervisor.id} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{supervisor.name}</h4>
                            <p className="text-sm text-gray-600">{supervisor.email}</p>
                          </div>
                          <Button
                            onClick={() => setSelectedSupervisor(supervisor)}
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 shadow-sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Students
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Admins</h2>
              <Button onClick={() => printTable('admin-table', 'Admins')} variant="outline" size="sm" className="self-start sm:self-auto">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
            <div id="admin-table" className="w-full overflow-hidden">
              <AdminUserManagement onUserCountChange={fetchUserCounts} />
            </div>
          </div>
        )}
        
        {activeTab === 'supervisors' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Supervisors</h2>
              <Button onClick={() => printTable('supervisor-table', 'Supervisors')} variant="outline" size="sm" className="self-start sm:self-auto">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
            <div id="supervisor-table" className="w-full overflow-hidden">
              <SupervisorUserManagement onUserCountChange={fetchUserCounts} />
            </div>
          </div>
        )}
        
        {activeTab === 'students' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Students</h2>
              <Button onClick={() => printTable('student-table', 'Students')} variant="outline" size="sm" className="self-start sm:self-auto">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
            <div id="student-table" className="w-full overflow-hidden">
              <StudentUserManagement onUserCountChange={fetchUserCounts} />
            </div>
          </div>
        )}
        
        {activeTab === 'parents' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Parents</h2>
              <Button onClick={() => printTable('parent-table', 'Parents')} variant="outline" size="sm" className="self-start sm:self-auto">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
            <div id="parent-table" className="w-full overflow-hidden">
              <ParentUserManagement onUserCountChange={fetchUserCounts} />
            </div>
          </div>
        )}
        
        {activeTab === 'attendance' && (
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 gap-2 sm:gap-0">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">All Attendance Records</CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => printTable('attendance-table', 'Attendance Records')} variant="outline" size="sm" className="shadow-sm text-xs sm:text-sm">
                  <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Print
                </Button>
                <Button onClick={exportAttendanceToCSV} variant="outline" size="sm" className="shadow-sm text-xs sm:text-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div id="attendance-table" className="w-full overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-gray-800 min-w-[80px] text-xs sm:text-sm">Date</TableHead>
                        <TableHead className="font-bold text-gray-800 min-w-[100px] text-xs sm:text-sm">Student</TableHead>
                        <TableHead className="font-bold text-gray-800 min-w-[80px] text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="font-bold text-gray-800 min-w-[120px] hidden sm:table-cell text-xs sm:text-sm">Study Type</TableHead>
                        <TableHead className="font-bold text-gray-800 min-w-[70px] hidden md:table-cell text-xs sm:text-sm">Grade</TableHead>
                        <TableHead className="font-bold text-gray-800 min-w-[100px] hidden lg:table-cell text-xs sm:text-sm">Supervisor</TableHead>
                        <TableHead className="font-bold text-gray-800 min-w-[80px] hidden lg:table-cell text-xs sm:text-sm">Issues</TableHead>
                        <TableHead className="font-bold text-gray-800 min-w-[150px] text-xs sm:text-sm">Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-semibold text-blue-900 text-xs sm:text-sm">
                            <div className="truncate max-w-[100px] sm:max-w-none">
                              {record.student_users?.name || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                              record.attendance_status === 'Present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.attendance_status}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                            <div className="max-w-[120px] truncate">
                              {record.study_types && record.study_types.length > 0 
                                ? record.study_types.join(', ') 
                                : record.study_type}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="bg-blue-100 text-blue-800 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">
                              {record.grade_level}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-700 hidden lg:table-cell text-xs sm:text-sm">
                            <div className="truncate max-w-[100px]">
                              {record.supervisor_users?.name || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {record.is_late && <span className="px-1 sm:px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Late</span>}
                              {record.is_noise && <span className="px-1 sm:px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Noise</span>}
                              {record.is_leave_early && <span className="px-1 sm:px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Left Early</span>}
                              {record.is_doing_nothing && <span className="px-1 sm:px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Inactive</span>}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[150px] max-w-[200px]">
                            <div className="text-xs text-gray-600 break-words whitespace-normal leading-relaxed">
                              {record.comments || 'No comments'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Logout Confirmation */}
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />

      {/* Supervisor Students View Modal */}
      {selectedSupervisor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <SupervisorStudentsView
              supervisorId={selectedSupervisor.id}
              supervisorName={selectedSupervisor.name}
              onClose={() => setSelectedSupervisor(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
