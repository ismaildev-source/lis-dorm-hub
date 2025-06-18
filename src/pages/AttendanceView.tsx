
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmation from '../components/LogoutConfirmation';
import AttendanceHeader from '../components/attendance/AttendanceHeader';
import AttendanceTable from '../components/attendance/AttendanceTable';
import { fetchAttendanceRecords } from '../utils/attendanceUtils';

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
  comments?: string;
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    loadAttendanceRecords();
  }, [user]);

  const loadAttendanceRecords = async () => {
    setLoading(true);
    const records = await fetchAttendanceRecords(user);
    setAttendanceRecords(records);
    setLoading(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AttendanceHeader
        userRole={user?.role || ''}
        userName={user?.name || ''}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Attendance Records</h2>
            </div>
          </div>

          <AttendanceTable records={attendanceRecords} loading={loading} />
        </div>
      </div>

      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default AttendanceView;
