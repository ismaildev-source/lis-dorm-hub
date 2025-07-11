
import React from 'react';
import { Shield, Users, GraduationCap, User, Calendar, LucideProps } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<LucideProps>;
}

interface AdminNavigationTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const AdminNavigationTabs: React.FC<AdminNavigationTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'admins', label: 'Admins', icon: Shield },
    { id: 'supervisors', label: 'Supervisors', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'parents', label: 'Parents', icon: User },
    { id: 'attendance', label: 'Attendance Records', icon: Calendar },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg mb-4 sm:mb-8 p-1">
      <nav className="flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
  );
};

export default AdminNavigationTabs;
