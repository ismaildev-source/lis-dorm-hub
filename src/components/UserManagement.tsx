
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus, Users, UserCheck, GraduationCap, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type GenderType = 'Male' | 'Female';
type GradeLevelType = 'Year 9' | 'Year 10' | 'Year 11' | 'Year 12' | 'Year 13';
type StreamType = 'A' | 'B' | 'C' | 'D';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  email: string;
  password: string;
}

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

interface ParentUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  contact: string;
  email: string;
  password: string;
  student_id: string;
}

interface StudentUser {
  id: string;
  name: string;
  username: string;
  age: number;
  grade_level: GradeLevelType;
  date_of_birth: string;
  stream: StreamType;
  room: string;
  shoe_rack_number: string;
  home_address: string;
  email: string;
  password: string;
  supervisor_id: string;
  parent_name: string;
  parent_contact: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [supervisorUsers, setSupervisorUsers] = useState<SupervisorUser[]>([]);
  const [parentUsers, setParentUsers] = useState<ParentUser[]>([]);
  const [studentUsers, setStudentUsers] = useState<StudentUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [adminForm, setAdminForm] = useState({
    name: '', username: '', gender: 'Male' as GenderType, email: '', password: ''
  });
  
  const [supervisorForm, setSupervisorForm] = useState({
    name: '', username: '', gender: 'Male' as GenderType, date_of_birth: '', room: '', contact: '', email: '', password: ''
  });
  
  const [parentForm, setParentForm] = useState({
    name: '', username: '', gender: 'Male' as GenderType, contact: '', email: '', password: '', student_id: ''
  });
  
  const [studentForm, setStudentForm] = useState({
    name: '', username: '', age: 16, grade_level: 'Year 9' as GradeLevelType, date_of_birth: '', 
    stream: 'A' as StreamType, room: '', shoe_rack_number: '', home_address: '', email: '', 
    password: '', supervisor_id: '', parent_name: '', parent_contact: ''
  });

  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<string>('');
  const [openDialog, setOpenDialog] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const [adminResult, supervisorResult, parentResult, studentResult] = await Promise.all([
        supabase.from('admin_users').select('*'),
        supabase.from('supervisor_users').select('*'),
        supabase.from('parent_users').select('*'),
        supabase.from('student_users').select('*')
      ]);

      if (adminResult.data) setAdminUsers(adminResult.data);
      if (supervisorResult.data) setSupervisorUsers(supervisorResult.data);
      if (parentResult.data) setParentUsers(parentResult.data);
      if (studentResult.data) setStudentUsers(studentResult.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleAddUser = async (userType: string) => {
    try {
      let result;
      let successMessage = '';

      switch (userType) {
        case 'admin':
          result = await supabase.from('admin_users').insert([adminForm]);
          successMessage = 'Admin user added successfully';
          setAdminForm({ name: '', username: '', gender: 'Male', email: '', password: '' });
          break;
        case 'supervisor':
          result = await supabase.from('supervisor_users').insert([supervisorForm]);
          successMessage = 'Supervisor user added successfully';
          setSupervisorForm({ name: '', username: '', gender: 'Male', date_of_birth: '', room: '', contact: '', email: '', password: '' });
          break;
        case 'parent':
          result = await supabase.from('parent_users').insert([parentForm]);
          successMessage = 'Parent user added successfully';
          setParentForm({ name: '', username: '', gender: 'Male', contact: '', email: '', password: '', student_id: '' });
          break;
        case 'student':
          result = await supabase.from('student_users').insert([studentForm]);
          successMessage = 'Student added successfully';
          setStudentForm({
            name: '', username: '', age: 16, grade_level: 'Year 9', date_of_birth: '', 
            stream: 'A', room: '', shoe_rack_number: '', home_address: '', email: '', 
            password: '', supervisor_id: '', parent_name: '', parent_contact: ''
          });
          break;
      }

      if (result?.error) {
        throw result.error;
      }

      toast({
        title: "Success",
        description: successMessage,
      });

      setOpenDialog('');
      fetchAllUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string, userType: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase.from(`${userType}_users`).delete().eq('id', id);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      fetchAllUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    try {
      const { error } = await supabase
        .from(`${editType}_users`)
        .update(editingItem)
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setEditingItem(null);
      setEditType('');
      fetchAllUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const startEdit = (item: any, type: string) => {
    setEditingItem({ ...item });
    setEditType(type);
  };

  const supervisorRooms = ['Room S01', 'Room S02', 'Room S03', 'Room S04'];
  const studentRooms = ['N103', 'N104', 'N105', 'N106', 'N107', 'N108', 'N109', 'N203', 'N204', 'N205', 'N206', 'N207', 'N208'];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supervisors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supervisorUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parentUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Buttons */}
      <div className="flex flex-wrap gap-2">
        <Dialog open={openDialog === 'admin'} onOpenChange={(open) => setOpenDialog(open ? 'admin' : '')}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Admin User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  value={adminForm.username}
                  onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="admin-gender">Gender</Label>
                <Select value={adminForm.gender} onValueChange={(value: GenderType) => setAdminForm({...adminForm, gender: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                />
              </div>
              <Button onClick={() => handleAddUser('admin')} className="w-full">
                Add Admin
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Similar dialogs for other user types... */}
        <Dialog open={openDialog === 'supervisor'} onOpenChange={(open) => setOpenDialog(open ? 'supervisor' : '')}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Supervisor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Supervisor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="supervisor-name">Name</Label>
                <Input
                  id="supervisor-name"
                  value={supervisorForm.name}
                  onChange={(e) => setSupervisorForm({...supervisorForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supervisor-username">Username</Label>
                <Input
                  id="supervisor-username"
                  value={supervisorForm.username}
                  onChange={(e) => setSupervisorForm({...supervisorForm, username: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supervisor-gender">Gender</Label>
                <Select value={supervisorForm.gender} onValueChange={(value: GenderType) => setSupervisorForm({...supervisorForm, gender: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supervisor-dob">Date of Birth</Label>
                <Input
                  id="supervisor-dob"
                  type="date"
                  value={supervisorForm.date_of_birth}
                  onChange={(e) => setSupervisorForm({...supervisorForm, date_of_birth: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supervisor-room">Room</Label>
                <Select value={supervisorForm.room} onValueChange={(value) => setSupervisorForm({...supervisorForm, room: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisorRooms.map(room => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supervisor-contact">Contact</Label>
                <Input
                  id="supervisor-contact"
                  value={supervisorForm.contact}
                  onChange={(e) => setSupervisorForm({...supervisorForm, contact: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supervisor-email">Email</Label>
                <Input
                  id="supervisor-email"
                  type="email"
                  value={supervisorForm.email}
                  onChange={(e) => setSupervisorForm({...supervisorForm, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supervisor-password">Password</Label>
                <Input
                  id="supervisor-password"
                  type="password"
                  value={supervisorForm.password}
                  onChange={(e) => setSupervisorForm({...supervisorForm, password: e.target.value})}
                />
              </div>
              <Button onClick={() => handleAddUser('supervisor')} className="w-full">
                Add Supervisor
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add more dialogs for parent and student... */}
      </div>

      {/* User Tables */}
      <div className="space-y-6">
        {/* Admin Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Username</th>
                    <th className="border border-gray-300 p-2">Gender</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((admin) => (
                    <tr key={admin.id}>
                      <td className="border border-gray-300 p-2">{admin.name}</td>
                      <td className="border border-gray-300 p-2">{admin.username}</td>
                      <td className="border border-gray-300 p-2">{admin.gender}</td>
                      <td className="border border-gray-300 p-2">{admin.email}</td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(admin, 'admin')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(admin.id, 'admin')}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Similar tables for other user types... */}
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {editType} User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  value={editingItem.username || ''}
                  onChange={(e) => setEditingItem({...editingItem, username: e.target.value})}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editingItem.email || ''}
                  onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                />
              </div>
              <Button onClick={handleEditUser} className="w-full">
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
