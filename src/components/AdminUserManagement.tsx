
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import AdminUserForm from '@/components/admin/AdminUserForm';
import AdminUserTable from '@/components/admin/AdminUserTable';
import AdminUserSearch from '@/components/admin/AdminUserSearch';

type GenderType = 'Male' | 'Female';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  email: string;
  password: string;
}

interface AdminUserManagementProps {
  onUserCountChange: () => void;
  showHeaderControls?: boolean;
  renderCustomHeader?: (onExportCSV: () => void) => React.ReactNode;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ 
  onUserCountChange, 
  showHeaderControls = true,
  renderCustomHeader 
}) => {
  const { adminUsers, addUser, updateUser, deleteUser } = useAdminUsers(onUserCountChange);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminUser | null>(null);

  const [adminForm, setAdminForm] = useState({
    name: '', username: '', gender: 'Male' as GenderType, email: '', password: ''
  });

  useEffect(() => {
    const filtered = adminUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [adminUsers, searchTerm]);

  const handleFormChange = (field: keyof typeof adminForm, value: string | GenderType) => {
    setAdminForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditFormChange = (field: keyof AdminUser, value: string | GenderType) => {
    if (editingItem) {
      setEditingItem(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleAddUser = async () => {
    const success = await addUser(adminForm);
    if (success) {
      setAdminForm({ name: '', username: '', gender: 'Male', email: '', password: '' });
      setOpenDialog(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingItem) return;
    const success = await updateUser(editingItem);
    if (success) {
      setEditingItem(null);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingItem(user);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Username', 'Gender', 'Email'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.username,
        user.gender,
        user.email
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin_users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-white border-gray-100 rounded-xl shadow-sm">
      {showHeaderControls && (
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 rounded-t-xl">
          <CardTitle className="text-xl font-semibold text-gray-800">Admins</CardTitle>
          <div className="flex gap-3">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white border-gray-100 rounded-xl shadow-lg">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold text-gray-800">Add Admin User</DialogTitle>
                </DialogHeader>
                <AdminUserForm
                  formData={adminForm}
                  onFormChange={handleFormChange}
                  onSubmit={handleAddUser}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      )}
      
      {renderCustomHeader && renderCustomHeader(exportToCSV)}
      
      <CardContent className="p-6">
        <div className="mb-6 flex justify-between items-center gap-4">
          <AdminUserSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          {!showHeaderControls && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white border-gray-100 rounded-xl shadow-lg">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold text-gray-800">Add Admin User</DialogTitle>
                </DialogHeader>
                <AdminUserForm
                  formData={adminForm}
                  onFormChange={handleFormChange}
                  onSubmit={handleAddUser}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <AdminUserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Edit Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="max-w-md bg-white border-gray-100 rounded-xl shadow-lg">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-semibold text-gray-800">Edit Admin User</DialogTitle>
              </DialogHeader>
              <AdminUserForm
                formData={editingItem}
                onFormChange={handleEditFormChange}
                onSubmit={handleEditUser}
                isEditing
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;
