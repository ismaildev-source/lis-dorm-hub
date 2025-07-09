
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PenTool } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-gray-800 min-w-[120px]">Name</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[100px]">Username</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[80px] hidden sm:table-cell">Gender</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[80px] hidden md:table-cell">Room</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[120px] hidden lg:table-cell">Contact</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[150px] hidden xl:table-cell">Email</TableHead>
              <TableHead className="font-bold text-gray-800 min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supervisorUsers.map((supervisor) => (
              <TableRow key={supervisor.id}>
                <TableCell className="font-medium text-gray-900">
                  <div className="truncate max-w-[120px] sm:max-w-none">
                    {supervisor.name}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">
                  <div className="truncate max-w-[100px] sm:max-w-none">
                    {supervisor.username}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 hidden sm:table-cell">{supervisor.gender}</TableCell>
                <TableCell className="text-gray-700 hidden md:table-cell">{supervisor.room}</TableCell>
                <TableCell className="text-gray-700 hidden lg:table-cell">
                  <div className="truncate max-w-[120px]">
                    {supervisor.contact}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 hidden xl:table-cell">
                  <div className="truncate max-w-[150px]">
                    {supervisor.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 sm:gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit(supervisor)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 shadow-sm"
                    >
                      <PenTool className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onDelete(supervisor.id)}
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

export default SupervisorUserTable;
