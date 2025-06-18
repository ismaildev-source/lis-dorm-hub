
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Users, Eye, X } from 'lucide-react';
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Students under {supervisorName}</span>
        </CardTitle>
        <Button onClick={onClose} variant="outline" size="sm">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No students assigned to this supervisor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.grade_level}</TableCell>
                    <TableCell>{student.stream}</TableCell>
                    <TableCell>{student.room}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>{student.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisorStudentsView;
