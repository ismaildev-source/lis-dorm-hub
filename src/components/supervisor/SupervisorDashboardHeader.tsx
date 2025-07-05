
import React from 'react';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

interface SupervisorDashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

const SupervisorDashboardHeader: React.FC<SupervisorDashboardHeaderProps> = ({
  userName,
  onLogout
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Supervisor Dashboard</h1>
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

export default SupervisorDashboardHeader;
