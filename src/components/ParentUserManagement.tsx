
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ParentUserForm from './parents/ParentUserForm';
import ParentUserTable from './parents/ParentUserTable';
import ParentUserSearch from './parents/ParentUserSearch';

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

interface ParentUserManagementProps {
  onUserCountChange: () => void;
  showHeaderControls?: boolean;
  renderCustomHeader?: (onExportCSV: () => void) => React.ReactNode;
}

const ParentUserManagement: React.FC<ParentUserManagementProps> = ({ 
  onUserCountChange,
  showHeaderControls = true,
  renderCustomHeader 
}) => {
  const { toast } = useToast();
  const [parentUsers, setParentUsers] = useState<ParentUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ParentUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ParentUser | null>(null);

  const [parentForm, setParentForm] = useState({
    name: '', 
    username: '', 
    gender: 'Male' as GenderType, 
    contact: '', 
    email: '', 
    password: ''
  });

  useEffect(() => {
    fetchParentUsers();
  }, []);

  useEffect(() => {
    const filtered = parentUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [parentUsers, searchTerm]);

  const fetchParentUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('parent_users').select('*');
      if (error) throw error;
      
      // Transform database data to match interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        username: item.username,
        gender: item.gender,
        contact: item.contact || '',
        email: item.email,
        password: item.password
      }));
      
      setParentUsers(transformedData);
    } catch (error) {
      console.error('Error fetching parent users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch parent users",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    try {
      const { error } = await supabase.from('parent_users').insert([{
        name: parentForm.name,
        username: parentForm.username,
        gender: parentForm.gender,
        contact: parentForm.contact,
        email: parentForm.email,
        password: parentForm.password
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Parent user added successfully",
      });

      setParentForm({ name: '', username: '', gender: 'Male', contact: '', email: '', password: '' });
      setOpenDialog(false);
      fetchParentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error adding parent user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add parent user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this parent user?')) return;

    try {
      const { error } = await supabase.from('parent_users').delete().eq('id', id);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Parent user deleted successfully",
      });

      fetchParentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error deleting parent user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete parent user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('parent_users')
        .update({
          name: editingItem.name,
          username: editingItem.username,
          gender: editingItem.gender,
          contact: editingItem.contact,
          email: editingItem.email,
          password: editingItem.password
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Parent user updated successfully",
      });

      setEditingItem(null);
      fetchParentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error updating parent user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update parent user",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Username', 'Gender', 'Contact', 'Email'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.username,
        user.gender,
        user.contact,
        user.email
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parent_users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFormChange = (field: string, value: any) => {
    setParentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditFormChange = (field: string, value: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  return (
    <Card className="bg-white border-gray-100 rounded-xl shadow-sm">
      {showHeaderControls && (
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <CardTitle className="text-xl font-semibold text-gray-800">Parents</CardTitle>
          <div className="flex gap-3">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Parent
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardHeader>
      )}

      {renderCustomHeader && renderCustomHeader(exportToCSV)}

      <CardContent className="p-6">
        <div className="mb-6 flex justify-between items-center gap-4">
          <ParentUserSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          {!showHeaderControls && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Parent
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>

        <ParentUserTable 
          parentUsers={filteredUsers}
          onEdit={setEditingItem}
          onDelete={handleDeleteUser}
        />

        {/* Add Form */}
        <ParentUserForm 
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleAddUser}
          formData={parentForm}
          onFormChange={handleFormChange}
          title="Add Parent"
          submitText="Add Parent"
        />

        {/* Edit Form */}
        {editingItem && (
          <ParentUserForm 
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            onSubmit={handleEditUser}
            formData={editingItem}
            onFormChange={handleEditFormChange}
            title="Edit Parent User"
            submitText="Update Parent User"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ParentUserManagement;
