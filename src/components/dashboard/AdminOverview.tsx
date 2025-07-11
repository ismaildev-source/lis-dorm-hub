
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, User, GraduationCap, Eye } from 'lucide-react';

interface UserCounts {
  admin: number;
  supervisor: number;
  parent: number;
  student: number;
}

interface Supervisor {
  id: string;
  name: string;
  email: string;
}

interface AdminOverviewProps {
  userCounts: UserCounts;
  supervisors: Supervisor[];
  onViewSupervisorStudents: (supervisor: Supervisor) => void;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({
  userCounts,
  supervisors,
  onViewSupervisorStudents
}) => {
  return (
    <div className="space-y-8">
      {/* User Counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{userCounts.admin}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Supervisors</p>
              <p className="text-2xl font-bold text-gray-900">{userCounts.supervisor}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parents</p>
              <p className="text-2xl font-bold text-gray-900">{userCounts.parent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{userCounts.student}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supervisors and their students */}
      <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <CardTitle className="text-xl font-bold text-gray-800">Supervisors and Their Students</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {supervisors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No supervisors found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supervisors.map((supervisor) => (
                <div key={supervisor.id} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{supervisor.name}</h4>
                      <p className="text-sm text-gray-600">{supervisor.email}</p>
                    </div>
                    <Button
                      onClick={() => onViewSupervisorStudents(supervisor)}
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 shadow-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Students
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
