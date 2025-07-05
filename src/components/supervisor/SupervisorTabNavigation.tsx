
import React from 'react';
import { Calendar, Users } from 'lucide-react';

interface SupervisorTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  studentsCount: number;
}

const SupervisorTabNavigation: React.FC<SupervisorTabNavigationProps> = ({
  activeTab,
  onTabChange,
  studentsCount
}) => {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange('attendance')}
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
          onClick={() => onTabChange('students')}
          className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'students'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Users size={20} />
          <span>My Students ({studentsCount})</span>
        </button>
      </nav>
    </div>
  );
};

export default SupervisorTabNavigation;
