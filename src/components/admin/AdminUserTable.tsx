
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-gray-800 min-w-[120px]">Name</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[100px]">Username</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[80px] hidden sm:table-cell">Gender</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[150px] hidden md:table-cell">Email</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium text-gray-900">
                  <div className="truncate max-w-[120px] sm:max-w-none">
                    {admin.name}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">
                  <div className="truncate max-w-[100px] sm:max-w-none">
                    {admin.username}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 hidden sm:table-cell">{admin.gender}</TableCell>
                <TableCell className="text-gray-700 hidden md:table-cell">
                  <div className="truncate max-w-[150px]">
                    {admin.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 sm:gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit(admin)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 shadow-sm"
                    >
                      <PenTool className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onDelete(admin.id)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 shadow-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUserTable;
