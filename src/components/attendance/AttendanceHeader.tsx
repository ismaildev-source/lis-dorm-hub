
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';

interface AttendanceHeaderProps {
  userRole: string;
  userName: string;
  onLogout: () => void;
}

const AttendanceHeader = ({ userRole, userName, onLogout }: AttendanceHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-purple-600">
              LIS Dorm Karen {userRole === 'parent' ? 'Parent' : 'Student'} Portal
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {userName}</span>
            <Button
              onClick={onLogout}
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
  );
};

export default AttendanceHeader;
