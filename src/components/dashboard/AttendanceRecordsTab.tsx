
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  student_users?: { name: string };
  attendance_status: string;
  study_type: string;
  study_types?: string[];
  grade_level: string;
  supervisor_users?: { name: string };
  absent_reason?: string;
  is_late?: boolean;
  is_noise?: boolean;
  is_leave_early?: boolean;
  is_doing_nothing?: boolean;
  comments?: string;
}

interface AttendanceRecordsTabProps {
  attendanceRecords: AttendanceRecord[];
  onExportCSV: () => void;
  onPrint: () => void;
}

const AttendanceRecordsTab: React.FC<AttendanceRecordsTabProps> = ({
  attendanceRecords,
  onExportCSV,
  onPrint
}) => {
  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 gap-2 sm:gap-0">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">All Attendance Records</CardTitle>
        <div className="flex gap-2">
          <Button onClick={onExportCSV} variant="outline" size="sm" className="shadow-sm text-xs sm:text-sm">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Export CSV
          </Button>
          <Button onClick={onPrint} variant="outline" size="sm" className="shadow-sm text-xs sm:text-sm">
            <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Print
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
  );
};

export default AttendanceRecordsTab;
