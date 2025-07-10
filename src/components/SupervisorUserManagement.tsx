import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SupervisorUserForm from './supervisors/SupervisorUserForm';
import SupervisorUserTable from './supervisors/SupervisorUserTable';
import SupervisorUserSearch from './supervisors/SupervisorUserSearch';

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

interface SupervisorUserManagementProps {
  onUserCountChange: () => void;
}

const SupervisorUserManagement: React.FC<SupervisorUserManagementProps> = ({ onUserCountChange }) => {
  const { toast } = useToast();
  const [supervisorUsers, setSupervisorUsers] = useState<SupervisorUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<SupervisorUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<SupervisorUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [supervisorForm, setSupervisorForm] = useState({
    name: '', username: '', gender: 'Male' as GenderType, date_of_birth: '', room: '', contact: '', email: '', password: ''
  });

  const supervisorRooms = ['Room S01', 'Room S02', 'Room S03', 'Room S04'];

  useEffect(() => {
    fetchSupervisorUsers();
  }, []);

  useEffect(() => {
    const filtered = supervisorUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.room.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [supervisorUsers, searchTerm]);

  const fetchSupervisorUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('supervisor_users').select('*');
      if (error) throw error;
      setSupervisorUsers(data || []);
    } catch (error) {
      console.error('Error fetching supervisor users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch supervisor users",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    try {
      const { error } = await supabase.from('supervisor_users').insert([supervisorForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Supervisor user added successfully",
      });

      setSupervisorForm({ name: '', username: '', gender: 'Male', date_of_birth: '', room: '', contact: '', email: '', password: '' });
      setOpenDialog(false);
      fetchSupervisorUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error adding supervisor user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add supervisor user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supervisor user?')) return;

    try {
      const { error } = await supabase.from('supervisor_users').delete().eq('id', id);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Supervisor user deleted successfully",
      });

      fetchSupervisorUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error deleting supervisor user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete supervisor user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('supervisor_users')
        .update(editingItem)
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Supervisor user updated successfully",
      });

      setEditingItem(null);
      fetchSupervisorUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error updating supervisor user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update supervisor user",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Username', 'Gender', 'Date of Birth', 'Room', 'Contact', 'Email'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.username,
        user.gender,
        user.date_of_birth,
        user.room,
        user.contact,
        user.email
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supervisor_users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFormChange = (field: string, value: string | GenderType) => {
    setSupervisorForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditFormChange = (field: string, value: string | GenderType) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  return (
    <Card className="bg-white border-gray-100 rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
        <CardTitle className="text-xl font-semibold text-gray-800">Supervisors</CardTitle>
        <div className="flex gap-3">
          <Button 
            onClick={exportToCSV} 
            variant="outline" 
            size="sm"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Supervisor
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <SupervisorUserSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <SupervisorUserTable 
          supervisorUsers={filteredUsers}
          onEdit={setEditingItem}
          onDelete={handleDeleteUser}
        />

        {/* Add Form */}
        <SupervisorUserForm 
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleAddUser}
          formData={supervisorForm}
          onFormChange={handleFormChange}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          title="Add Supervisor"
          submitText="Add Supervisor"
          supervisorRooms={supervisorRooms}
        />

        {/* Edit Form */}
        {editingItem && (
          <SupervisorUserForm 
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            onSubmit={handleEditUser}
            formData={editingItem}
            onFormChange={handleEditFormChange}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            title="Edit Supervisor User"
            submitText="Update Supervisor User"
            supervisorRooms={supervisorRooms}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisorUserManagement;
