
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LogoutConfirmation from '../components/LogoutConfirmation';
import SupervisorStudentsView from '../components/SupervisorStudentsView';
import AdminHeader from '../components/dashboard/AdminHeader';
import AdminNavigationTabs from '../components/dashboard/AdminNavigationTabs';
import AdminOverview from '../components/dashboard/AdminOverview';
import TabContentRenderer from '../components/dashboard/TabContentRenderer';

interface Supervisor {
  id: string;
  name: string;
  email: string;
}

interface UserCounts {
  admin: number;
  supervisor: number;
  parent: number;
  student: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [userCounts, setUserCounts] = useState<UserCounts>({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminHeader userName={user?.name} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <AdminNavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <AdminOverview
            userCounts={userCounts}
            supervisors={supervisors}
            onViewSupervisorStudents={setSelectedSupervisor}
          />
        ) : (
          <TabContentRenderer
            activeTab={activeTab}
            onUserCountChange={fetchUserCounts}
            onPrintTable={printTable}
            attendanceRecords={attendanceRecords}
            onExportAttendanceCSV={exportAttendanceToCSV}
          />
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
