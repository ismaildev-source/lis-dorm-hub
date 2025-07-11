
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

type GenderType = 'Male' | 'Female';

interface ParentUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  contact: string;
  email: string;
  password?: string;
}

interface ParentUserTableProps {
  parentUsers: ParentUser[];
  onEdit: (user: ParentUser) => void;
  onDelete: (id: string) => void;
}

const ParentUserTable: React.FC<ParentUserTableProps> = ({
  parentUsers,
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
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.contact}</TableCell>
              <TableCell>{user.email}</TableCell>
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

export default ParentUserTable;
