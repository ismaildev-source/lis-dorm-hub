
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit } from 'lucide-react';

type GenderType = 'Male' | 'Female';

interface SupervisorUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  date_of_birth: string;
  room: string;
  contact: string;
  email: string;
  password: string;
}

interface SupervisorUserTableProps {
  supervisorUsers: SupervisorUser[];
  onEdit: (user: SupervisorUser) => void;
  onDelete: (id: string) => void;
}

const SupervisorUserTable: React.FC<SupervisorUserTableProps> = ({
  supervisorUsers,
  onEdit,
  onDelete
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supervisorUsers.map((supervisor) => (
          <TableRow key={supervisor.id}>
            <TableCell>{supervisor.name}</TableCell>
            <TableCell>{supervisor.username}</TableCell>
            <TableCell>{supervisor.gender}</TableCell>
            <TableCell>{supervisor.room}</TableCell>
            <TableCell>{supervisor.contact}</TableCell>
            <TableCell>{supervisor.email}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(supervisor)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(supervisor.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SupervisorUserTable;
