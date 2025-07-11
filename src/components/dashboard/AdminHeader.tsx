
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  userName?: string;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ userName, onLogout }) => {
  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-blue-600 truncate">LIS Dorm Karen Admin</h1>
          </div>
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 flex-shrink-0">
            <span className="text-xs sm:text-sm text-gray-700 hidden sm:block">Welcome, {userName}</span>
            <span className="text-xs text-gray-700 sm:hidden">Hi, {userName?.split(' ')[0]}</span>
            <Button
              onClick={onLogout}
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
  );
};

export default AdminHeader;
