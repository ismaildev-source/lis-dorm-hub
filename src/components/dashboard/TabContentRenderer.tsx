
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import AdminUserManagement from '../AdminUserManagement';
import SupervisorUserManagement from '../SupervisorUserManagement';
import StudentUserManagement from '../StudentUserManagement';
import ParentUserManagement from '../ParentUserManagement';
import AttendanceRecordsTab from './AttendanceRecordsTab';

interface TabContentRendererProps {
  activeTab: string;
  onUserCountChange: () => void;
  onPrintTable: (tableId: string, title: string) => void;
  attendanceRecords: any[];
  onExportAttendanceCSV: () => void;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({
  activeTab,
  onUserCountChange,
  onPrintTable,
  attendanceRecords,
  onExportAttendanceCSV
}) => {
  const renderTabHeader = (title: string, tableId: string, onExportCSV?: () => void) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      <div className="flex gap-2">
        <Button onClick={() => onPrintTable(tableId, title)} variant="outline" size="sm" className="self-start sm:self-auto">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        {onExportCSV && (
          <Button onClick={onExportCSV} variant="outline" size="sm" className="self-start sm:self-auto">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>
    </div>
  );

  if (activeTab === 'admins') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div id="admin-table" className="w-full overflow-hidden">
          <AdminUserManagement 
            onUserCountChange={onUserCountChange}
            showHeaderControls={false}
            renderCustomHeader={(onExportCSV) => renderTabHeader('Admins', 'admin-table', onExportCSV)}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'supervisors') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div id="supervisor-table" className="w-full overflow-hidden">
          <SupervisorUserManagement 
            onUserCountChange={onUserCountChange}
            showHeaderControls={false}
            renderCustomHeader={(onExportCSV) => renderTabHeader('Supervisors', 'supervisor-table', onExportCSV)}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'students') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div id="student-table" className="w-full overflow-hidden">
          <StudentUserManagement 
            onUserCountChange={onUserCountChange}
            showHeaderControls={false}
            renderCustomHeader={(onExportCSV) => renderTabHeader('Students', 'student-table', onExportCSV)}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'parents') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div id="parent-table" className="w-full overflow-hidden">
          <ParentUserManagement 
            onUserCountChange={onUserCountChange}
            showHeaderControls={false}
            renderCustomHeader={(onExportCSV) => renderTabHeader('Parents', 'parent-table', onExportCSV)}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'attendance') {
    return (
      <AttendanceRecordsTab
        attendanceRecords={attendanceRecords}
        onExportCSV={onExportAttendanceCSV}
        onPrint={() => onPrintTable('attendance-table', 'Attendance Records')}
      />
    );
  }

  return null;
};

export default TabContentRenderer;
