
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Users } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  attendance_status: string;
  date: string;
  study_type: string;
  is_late: boolean;
  is_noise: boolean;
  is_leave_early: boolean;
  is_doing_nothing: boolean;
  comments: string;
  student_users?: {
    name: string;
  };
}

interface SupervisorRecentAttendanceProps {
  attendanceRecords: AttendanceRecord[];
}

const SupervisorRecentAttendance: React.FC<SupervisorRecentAttendanceProps> = ({
  attendanceRecords
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Recent Attendance Records</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Student</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="min-w-[100px]">Date</TableHead>
                <TableHead className="min-w-[150px]">Study Type</TableHead>
                <TableHead className="min-w-[120px]">Behavioral</TableHead>
                <TableHead className="min-w-[200px]">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.slice(0, 10).map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.student_users?.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                      record.attendance_status === 'Present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.attendance_status}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{record.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{record.study_type}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {record.is_late && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded whitespace-nowrap">Late</span>}
                      {record.is_noise && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded whitespace-nowrap">Noise</span>}
                      {record.is_leave_early && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded whitespace-nowrap">Left Early</span>}
                      {record.is_doing_nothing && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded whitespace-nowrap">Inactive</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs break-words" title={record.comments}>
                      {record.comments || 'No comments'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisorRecentAttendance;
