
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, UserPlus, Shield, GraduationCap, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import AdminUserManagement from '../components/AdminUserManagement';
import SupervisorUserManagement from '../components/SupervisorUserManagement';
import StudentUserManagement from '../components/StudentUserManagement';
import ParentUserManagement from '../components/ParentUserManagement';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userCounts, setUserCounts] = useState({
    admin: 0,
    supervisor: 0,
    parent: 0,
    student: 0,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
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

  useEffect(() => {
    fetchUserCounts();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'admins', label: 'Admin Users', icon: Shield },
    { id: 'supervisors', label: 'Supervisors', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'parents', label: 'Parents', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">DormHub Admin</h1>
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
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{userCounts.admin}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Supervisors</p>
                  <p className="text-2xl font-bold text-gray-900">{userCounts.supervisor}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <User className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Parents</p>
                  <p className="text-2xl font-bold text-gray-900">{userCounts.parent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-gray-900">{userCounts.student}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admins' && <AdminUserManagement onUserCountChange={fetchUserCounts} />}
        {activeTab === 'supervisors' && <SupervisorUserManagement onUserCountChange={fetchUserCounts} />}
        {activeTab === 'students' && <StudentUserManagement onUserCountChange={fetchUserCounts} />}
        {activeTab === 'parents' && <ParentUserManagement onUserCountChange={fetchUserCounts} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
