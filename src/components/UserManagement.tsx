
import React, { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, Shield, Users, User, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'supervisor' | 'parent' | 'student';
  createdAt: string;
}

interface UserManagementProps {
  onUsersChange?: (users: User[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onUsersChange }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<'admin' | 'supervisor' | 'parent' | 'student'>('admin');
  const [loading, setLoading] = useState(false);

  const [adminForm, setAdminForm] = useState({
    name: '', username: '', gender: 'Male', email: '', password: ''
  });

  const [supervisorForm, setSupervisorForm] = useState({
    name: '', username: '', gender: 'Male', date_of_birth: '', room: 'Room S01', 
    contact: '', email: '', password: ''
  });

  const [parentForm, setParentForm] = useState({
    name: '', username: '', gender: 'Male', contact: '', email: '', 
    password: '', student_id: ''
  });

  const [studentForm, setStudentForm] = useState({
    name: '', username: '', age: '', grade_level: 'Year 9', date_of_birth: '',
    stream: 'A', room: 'N103', shoe_rack_number: '', home_address: '',
    email: '', password: '', supervisor_id: '', parent_name: '', parent_contact: ''
  });

  useEffect(() => {
    fetchAllUsers();
    fetchStudents();
    fetchSupervisors();
  }, []);

  const fetchAllUsers = async () => {
    try {
      // Fetch from all user tables
      const [adminRes, supervisorRes, parentRes, studentRes] = await Promise.all([
        supabase.from('admin_users').select('*'),
        supabase.from('supervisor_users').select('*'),
        supabase.from('parent_users').select('*'),
        supabase.from('student_users').select('*')
      ]);

      const allUsers = [
        ...(adminRes.data || []).map(u => ({ ...u, role: 'admin' as const, createdAt: u.created_at })),
        ...(supervisorRes.data || []).map(u => ({ ...u, role: 'supervisor' as const, createdAt: u.created_at })),
        ...(parentRes.data || []).map(u => ({ ...u, role: 'parent' as const, createdAt: u.created_at })),
        ...(studentRes.data || []).map(u => ({ ...u, role: 'student' as const, createdAt: u.created_at }))
      ];

      setUsers(allUsers);
      if (onUsersChange) {
        onUsersChange(allUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStudents = async () => {
    const { data } = await supabase.from('student_users').select('*');
    setStudents(data || []);
  };

  const fetchSupervisors = async () => {
    const { data } = await supabase.from('supervisor_users').select('*');
    setSupervisors(data || []);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      switch (selectedUserType) {
        case 'admin':
          result = await supabase.from('admin_users').insert([adminForm]);
          break;
        case 'supervisor':
          result = await supabase.from('supervisor_users').insert([supervisorForm]);
          break;
        case 'parent':
          result = await supabase.from('parent_users').insert([parentForm]);
          break;
        case 'student':
          result = await supabase.from('student_users').insert([{
            ...studentForm,
            age: studentForm.age ? parseInt(studentForm.age) : null
          }]);
          break;
      }

      if (result?.error) throw result.error;

      toast({
        title: "Success",
        description: `${selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1)} added successfully`,
      });

      // Reset forms
      setAdminForm({ name: '', username: '', gender: 'Male', email: '', password: '' });
      setSupervisorForm({ name: '', username: '', gender: 'Male', date_of_birth: '', room: 'Room S01', contact: '', email: '', password: '' });
      setParentForm({ name: '', username: '', gender: 'Male', contact: '', email: '', password: '', student_id: '' });
      setStudentForm({ name: '', username: '', age: '', grade_level: 'Year 9', date_of_birth: '', stream: 'A', room: 'N103', shoe_rack_number: '', home_address: '', email: '', password: '', supervisor_id: '', parent_name: '', parent_contact: '' });
      
      setIsAddDialogOpen(false);
      fetchAllUsers();
      fetchStudents();
      fetchSupervisors();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add ${selectedUserType}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, role: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const tableMap = {
        admin: 'admin_users',
        supervisor: 'supervisor_users',
        parent: 'parent_users',
        student: 'student_users'
      };

      const { error } = await supabase
        .from(tableMap[role as keyof typeof tableMap])
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      fetchAllUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'supervisor': return <Users className="w-4 h-4 text-green-600" />;
      case 'parent': return <User className="w-4 h-4 text-yellow-600" />;
      case 'student': return <GraduationCap className="w-4 h-4 text-purple-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'supervisor': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-yellow-100 text-yellow-800';
      case 'student': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUserForm = () => {
    switch (selectedUserType) {
      case 'admin':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={adminForm.name}
                onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={adminForm.username}
                onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={adminForm.gender}
                onChange={(e) => setAdminForm({...adminForm, gender: e.target.value as 'Male' | 'Female'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                required
              />
            </div>
          </div>
        );

      case 'supervisor':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={supervisorForm.name}
                onChange={(e) => setSupervisorForm({...supervisorForm, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={supervisorForm.username}
                onChange={(e) => setSupervisorForm({...supervisorForm, username: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={supervisorForm.gender}
                onChange={(e) => setSupervisorForm({...supervisorForm, gender: e.target.value as 'Male' | 'Female'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={supervisorForm.date_of_birth}
                onChange={(e) => setSupervisorForm({...supervisorForm, date_of_birth: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <select
                id="room"
                value={supervisorForm.room}
                onChange={(e) => setSupervisorForm({...supervisorForm, room: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Room S01">Room S01</option>
                <option value="Room S02">Room S02</option>
                <option value="Room S03">Room S03</option>
                <option value="Room S04">Room S04</option>
              </select>
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={supervisorForm.contact}
                onChange={(e) => setSupervisorForm({...supervisorForm, contact: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={supervisorForm.email}
                onChange={(e) => setSupervisorForm({...supervisorForm, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={supervisorForm.password}
                onChange={(e) => setSupervisorForm({...supervisorForm, password: e.target.value})}
                required
              />
            </div>
          </div>
        );

      case 'parent':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="student_id">Student</Label>
              <select
                id="student_id"
                value={parentForm.student_id}
                onChange={(e) => {
                  const student = students.find(s => s.id === e.target.value);
                  setParentForm({...parentForm, student_id: e.target.value, name: student?.name || ''});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={parentForm.name}
                onChange={(e) => setParentForm({...parentForm, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={parentForm.username}
                onChange={(e) => setParentForm({...parentForm, username: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={parentForm.gender}
                onChange={(e) => setParentForm({...parentForm, gender: e.target.value as 'Male' | 'Female'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={parentForm.contact}
                onChange={(e) => setParentForm({...parentForm, contact: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={parentForm.email}
                onChange={(e) => setParentForm({...parentForm, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={parentForm.password}
                onChange={(e) => setParentForm({...parentForm, password: e.target.value})}
                required
              />
            </div>
          </div>
        );

      case 'student':
        return (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={studentForm.name}
                onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={studentForm.username}
                onChange={(e) => setStudentForm({...studentForm, username: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={studentForm.age}
                  onChange={(e) => setStudentForm({...studentForm, age: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="grade_level">Grade Level</Label>
                <select
                  id="grade_level"
                  value={studentForm.grade_level}
                  onChange={(e) => setStudentForm({...studentForm, grade_level: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Year 9">Year 9</option>
                  <option value="Year 10">Year 10</option>
                  <option value="Year 11">Year 11</option>
                  <option value="Year 12">Year 12</option>
                  <option value="Year 13">Year 13</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={studentForm.date_of_birth}
                onChange={(e) => setStudentForm({...studentForm, date_of_birth: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stream">Stream</Label>
                <select
                  id="stream"
                  value={studentForm.stream}
                  onChange={(e) => setStudentForm({...studentForm, stream: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <Label htmlFor="room">Room</Label>
                <select
                  id="room"
                  value={studentForm.room}
                  onChange={(e) => setStudentForm({...studentForm, room: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {['N103', 'N104', 'N105', 'N106', 'N107', 'N108', 'N109', 'N203', 'N204', 'N205', 'N206', 'N207', 'N208'].map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="shoe_rack_number">Shoe Rack Number</Label>
              <Input
                id="shoe_rack_number"
                value={studentForm.shoe_rack_number}
                onChange={(e) => setStudentForm({...studentForm, shoe_rack_number: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="home_address">Home Address</Label>
              <Input
                id="home_address"
                value={studentForm.home_address}
                onChange={(e) => setStudentForm({...studentForm, home_address: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={studentForm.email}
                onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={studentForm.password}
                onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="supervisor_id">Supervisor</Label>
              <select
                id="supervisor_id"
                value={studentForm.supervisor_id}
                onChange={(e) => setStudentForm({...studentForm, supervisor_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Supervisor</option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_name">Parent Name</Label>
                <Input
                  id="parent_name"
                  value={studentForm.parent_name}
                  onChange={(e) => setStudentForm({...studentForm, parent_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="parent_contact">Parent Contact</Label>
                <Input
                  id="parent_contact"
                  value={studentForm.parent_contact}
                  onChange={(e) => setStudentForm({...studentForm, parent_contact: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <UserPlus size={16} />
              <span>Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            
            <div className="mb-4">
              <Label htmlFor="userType">User Type</Label>
              <select
                id="userType"
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
              </select>
            </div>

            <form onSubmit={handleAddUser}>
              {renderUserForm()}
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : `Add ${selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1)}`}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center space-x-3">
                  {getRoleIcon(user.role)}
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id, user.role)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
