
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

type GenderType = 'Male' | 'Female';
type GradeLevel = 'Year 9' | 'Year 10' | 'Year 11' | 'Year 12' | 'Year 13';

interface StudentUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  date_of_birth: string;
  grade_level: GradeLevel;
  contact: string;
  email: string;
  address: string;
  parent_name: string;
  password?: string;
}

interface StudentUserTableProps {
  studentUsers: StudentUser[];
  onEdit: (user: StudentUser) => void;
  onDelete: (id: string) => void;
}

const StudentUserTable: React.FC<StudentUserTableProps> = ({
  studentUsers,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Grade Level</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Parent Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.date_of_birth}</TableCell>
              <TableCell>{user.grade_level}</TableCell>
              <TableCell>{user.contact}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.parent_name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentUserTable;
