
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Users, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  grade_level: string;
  stream: string;
  room: string;
  email: string;
  age: number;
}

interface SupervisorStudentsViewProps {
  supervisorId: string;
  supervisorName: string;
  onClose: () => void;
}

const SupervisorStudentsView = ({ supervisorId, supervisorName, onClose }: SupervisorStudentsViewProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupervisorStudents();
  }, [supervisorId]);

  const fetchSupervisorStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('student_users')
        .select('id, name, grade_level, stream, room, email, age')
        .eq('supervisor_id', supervisorId);
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching supervisor students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-xl rounded-xl overflow-hidden max-w-7xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-6 gap-2 sm:gap-0">
        <CardTitle className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <span className="text-base sm:text-xl font-bold text-gray-800 truncate">Students under {supervisorName}</span>
        </CardTitle>
        <Button 
          onClick={onClose} 
          variant="outline" 
          size="sm"
          className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 shadow-sm h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2 self-end sm:self-auto"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 sm:p-12 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 sm:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Users className="mx-auto h-8 w-8 sm:h-12 sm:w-12" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No students assigned</h3>
            <p className="text-sm sm:text-base text-gray-500">This supervisor has no students assigned yet.</p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-gray-800 min-w-[120px] text-xs sm:text-sm">Name</TableHead>
                    <TableHead className="font-bold text-gray-800 min-w-[80px] hidden sm:table-cell text-xs sm:text-sm">Grade</TableHead>
                    <TableHead className="font-bold text-gray-800 min-w-[80px] hidden md:table-cell text-xs sm:text-sm">Stream</TableHead>
                    <TableHead className="font-bold text-gray-800 min-w-[80px] hidden lg:table-cell text-xs sm:text-sm">Room</TableHead>
                    <TableHead className="font-bold text-gray-800 min-w-[60px] hidden xl:table-cell text-xs sm:text-sm">Age</TableHead>
                    <TableHead className="font-bold text-gray-800 min-w-[150px] hidden xl:table-cell text-xs sm:text-sm">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-semibold text-blue-900 text-xs sm:text-sm">
                        <div className="truncate max-w-[120px] sm:max-w-none">
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="bg-blue-100 text-blue-800 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">
                          {student.grade_level}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">
                          {student.stream}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700 hidden lg:table-cell text-xs sm:text-sm">{student.room}</TableCell>
                      <TableCell className="text-gray-700 hidden xl:table-cell text-xs sm:text-sm">{student.age}</TableCell>
                      <TableCell className="text-gray-700 hidden xl:table-cell text-xs sm:text-sm">
                        <div className="truncate max-w-[150px]">
                          {student.email}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisorStudentsView;
