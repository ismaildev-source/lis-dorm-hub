
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
  study_types?: string[];
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
    return status === 'Present' 
      ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium' 
      : 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium';
  };

  const getBadges = (record: AttendanceRecord) => {
    const badges = [];
    if (record.is_late) badges.push('Late');
    if (record.is_noise) badges.push('Noise');
    if (record.is_leave_early) badges.push('Left Early');
    if (record.is_doing_nothing) badges.push('Inactive');
    return badges;
  };

  const getStudyTypes = (record: AttendanceRecord) => {
    return record.study_types && record.study_types.length > 0 
      ? record.study_types.join(', ') 
      : record.study_type;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
        <p className="text-gray-500">Start taking attendance to see records here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-gray-800">Date</TableHead>
            <TableHead className="font-bold text-gray-800">Student</TableHead>
            <TableHead className="font-bold text-gray-800">Status</TableHead>
            <TableHead className="font-bold text-gray-800">Study Type</TableHead>
            <TableHead className="font-bold text-gray-800">Grade</TableHead>
            <TableHead className="font-bold text-gray-800">Supervisor</TableHead>
            <TableHead className="font-bold text-gray-800">Notes</TableHead>
            <TableHead className="font-bold text-gray-800">Issues</TableHead>
            <TableHead className="font-bold text-gray-800">Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
              <TableCell className="font-medium">
                {new Date(record.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-semibold text-blue-900">
                {record.student_users.name}
              </TableCell>
              <TableCell>
                <span className={getStatusColor(record.attendance_status)}>
                  {record.attendance_status}
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {getStudyTypes(record)}
                </div>
              </TableCell>
              <TableCell>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {record.grade_level}
                </span>
              </TableCell>
              <TableCell className="text-gray-600">
                {record.supervisor_users.name}
              </TableCell>
              <TableCell>
                {record.absent_reason && (
                  <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                    {record.absent_reason}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {getBadges(record).map((badge, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-32 text-sm text-gray-600" title={record.comments}>
                  {record.comments || '-'}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
