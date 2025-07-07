
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PenTool } from 'lucide-react';

type GenderType = 'Male' | 'Female';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  email: string;
  password: string;
}

interface AdminUserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (id: string) => void;
}

const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-gray-800">Name</TableHead>
            <TableHead className="font-bold text-gray-800">Username</TableHead>
            <TableHead className="font-bold text-gray-800">Gender</TableHead>
            <TableHead className="font-bold text-gray-800">Email</TableHead>
            <TableHead className="font-bold text-gray-800">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-medium text-gray-900">{admin.name}</TableCell>
              <TableCell className="text-gray-700">{admin.username}</TableCell>
              <TableCell className="text-gray-700">{admin.gender}</TableCell>
              <TableCell className="text-gray-700">{admin.email}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(admin)}
                    className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 shadow-sm"
                  >
                    <PenTool className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onDelete(admin.id)}
                    className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
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

export default AdminUserTable;
