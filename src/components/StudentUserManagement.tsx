
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import StudentUserForm from './students/StudentUserForm';
import StudentUserTable from './students/StudentUserTable';
import StudentUserSearch from './students/StudentUserSearch';

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

interface StudentUserManagementProps {
  onUserCountChange: () => void;
  showHeaderControls?: boolean;
  renderCustomHeader?: (onExportCSV: () => void) => React.ReactNode;
}

const StudentUserManagement: React.FC<StudentUserManagementProps> = ({ 
  onUserCountChange,
  showHeaderControls = true,
  renderCustomHeader 
}) => {
  const { toast } = useToast();
  const [studentUsers, setStudentUsers] = useState<StudentUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<StudentUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: '', 
    username: '', 
    gender: 'Male' as GenderType, 
    date_of_birth: '', 
    grade_level: 'Year 9' as GradeLevel, 
    contact: '', 
    email: '', 
    address: '', 
    parent_name: '', 
    password: ''
  });

  const gradeLevels: GradeLevel[] = ['Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'];

  useEffect(() => {
    fetchStudentUsers();
  }, []);

  useEffect(() => {
    const filtered = studentUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.parent_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [studentUsers, searchTerm]);

  const fetchStudentUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('student_users').select('*');
      if (error) throw error;
      
      // Transform database data to match interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        username: item.username,
        gender: 'Male' as GenderType, // Default since not in database
        date_of_birth: item.date_of_birth || '',
        grade_level: item.grade_level,
        contact: item.parent_contact || '',
        email: item.email,
        address: item.home_address || '',
        parent_name: item.parent_name || '',
        password: item.password
      }));
      
      setStudentUsers(transformedData);
    } catch (error) {
      console.error('Error fetching student users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch student users",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    try {
      const { error } = await supabase.from('student_users').insert([{
        name: studentForm.name,
        username: studentForm.username,
        date_of_birth: studentForm.date_of_birth,
        grade_level: studentForm.grade_level,
        parent_contact: studentForm.contact,
        email: studentForm.email,
        home_address: studentForm.address,
        parent_name: studentForm.parent_name,
        password: studentForm.password,
        room: 'TBD', // Required field
        stream: 'A' // Required field
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student user added successfully",
      });

      setStudentForm({
        name: '', 
        username: '', 
        gender: 'Male', 
        date_of_birth: '', 
        grade_level: 'Year 9', 
        contact: '', 
        email: '', 
        address: '', 
        parent_name: '', 
        password: ''
      });
      setOpenDialog(false);
      fetchStudentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error adding student user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add student user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student user?')) return;

    try {
      const { error } = await supabase.from('student_users').delete().eq('id', id);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Student user deleted successfully",
      });

      fetchStudentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error deleting student user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete student user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('student_users')
        .update({
          name: editingItem.name,
          username: editingItem.username,
          date_of_birth: editingItem.date_of_birth,
          grade_level: editingItem.grade_level,
          parent_contact: editingItem.contact,
          email: editingItem.email,
          home_address: editingItem.address,
          parent_name: editingItem.parent_name,
          password: editingItem.password
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student user updated successfully",
      });

      setEditingItem(null);
      fetchStudentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error updating student user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update student user",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Username', 'Gender', 'Date of Birth', 'Grade Level', 'Contact', 'Email', 'Address', 'Parent Name'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.username,
        user.gender,
        user.date_of_birth,
        user.grade_level,
        user.contact,
        user.email,
        user.address,
        user.parent_name
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFormChange = (field: string, value: string | GenderType | GradeLevel) => {
    setStudentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditFormChange = (field: string, value: string | GenderType | GradeLevel) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  return (
    <Card className="bg-white border-gray-100 rounded-xl shadow-sm">
      {showHeaderControls && (
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <CardTitle className="text-xl font-semibold text-gray-800">Students</CardTitle>
          <div className="flex gap-3">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Student
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardHeader>
      )}

      {renderCustomHeader && renderCustomHeader(exportToCSV)}

      <CardContent className="p-6">
        <div className="mb-6 flex justify-between items-center gap-4">
          <StudentUserSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          {!showHeaderControls && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Student
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>

        <StudentUserTable 
          studentUsers={filteredUsers}
          onEdit={setEditingItem}
          onDelete={handleDeleteUser}
        />

        {/* Add Form */}
        <StudentUserForm
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleAddUser}
          formData={studentForm}
          onFormChange={handleFormChange}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          title="Add Student"
          submitText="Add Student"
          gradeLevels={gradeLevels}
        />

        {/* Edit Form */}
        {editingItem && (
          <StudentUserForm
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            onSubmit={handleEditUser}
            formData={editingItem}
            onFormChange={handleEditFormChange}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            title="Edit Student User"
            submitText="Update Student User"
            gradeLevels={gradeLevels}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StudentUserManagement;
