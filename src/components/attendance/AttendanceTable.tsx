
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

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

interface AttendanceTableProps {
  records: AttendanceRecord[];
  loading: boolean;
}

const AttendanceTable = ({ records, loading }: AttendanceTableProps) => {
  const getStatusColor = (status: string) => {
    return status === 'Present' ? 'text-green-600' : 'text-red-600';
  };

  const getBadges = (record: AttendanceRecord) => {
    const badges = [];
    if (record.is_late) badges.push('Late');
    if (record.is_noise) badges.push('Noise');
    if (record.is_leave_early) badges.push('Left Early');
    if (record.is_doing_nothing) badges.push('Inactive');
    return badges;
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading attendance records...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No attendance records found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Study Type</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Supervisor</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Issues</TableHead>
          <TableHead>Comments</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
            <TableCell className="font-medium">{record.student_users.name}</TableCell>
            <TableCell className={getStatusColor(record.attendance_status)}>
              {record.attendance_status}
            </TableCell>
            <TableCell>{record.study_type}</TableCell>
            <TableCell>{record.grade_level}</TableCell>
            <TableCell>{record.supervisor_users.name}</TableCell>
            <TableCell>
              {record.absent_reason && (
                <span className="text-sm text-gray-600">{record.absent_reason}</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {getBadges(record).map((badge, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-32 truncate" title={record.comments}>
                {record.comments}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;
