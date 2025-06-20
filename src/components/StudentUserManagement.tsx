import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Plus, Download, Search, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type GradeLevelType = 'Year 9' | 'Year 10' | 'Year 11' | 'Year 12' | 'Year 13';
type StreamType = 'A' | 'B' | 'C' | 'D';

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

interface StudentUserManagementProps {
  onUserCountChange: () => void;
}

const StudentUserManagement: React.FC<StudentUserManagementProps> = ({ onUserCountChange }) => {
  const { toast } = useToast();
  const [studentUsers, setStudentUsers] = useState<StudentUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<StudentUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: '', username: '', age: 16, grade_level: 'Year 9' as GradeLevelType, date_of_birth: '', 
    stream: 'A' as StreamType, room: '', shoe_rack_number: '', home_address: '', email: '', 
    password: '', supervisor_id: '', parent_name: '', parent_contact: ''
  });

  const studentRooms = ['N103', 'N104', 'N105', 'N106', 'N107', 'N108', 'N109', 'N203', 'N204', 'N205', 'N206', 'N207', 'N208'];

  useEffect(() => {
    fetchStudentUsers();
    fetchSupervisors();
  }, []);

  useEffect(() => {
    const filtered = studentUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.grade_level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.stream.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.room.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [studentUsers, searchTerm]);

  const fetchSupervisors = async () => {
    try {
      const { data, error } = await supabase.from('supervisor_users').select('id, name');
      if (error) throw error;
      setSupervisors(data || []);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const fetchStudentUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('student_users').select('*');
      if (error) throw error;
      setStudentUsers(data || []);
      setFilteredUsers(data || []);
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

  const exportToCSV = () => {
    const headers = ['Name', 'Username', 'Age', 'Grade Level', 'Date of Birth', 'Stream', 'Room', 'Shoe Rack', 'Home Address', 'Email', 'Parent Name', 'Parent Contact'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.username,
        user.age,
        user.grade_level,
        user.date_of_birth,
        user.stream,
        user.room,
        user.shoe_rack_number,
        `"${user.home_address}"`,
        user.email,
        user.parent_name,
        user.parent_contact
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

  const handleAddUser = async () => {
    try {
      const { error } = await supabase.from('student_users').insert([studentForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student added successfully",
      });

      setStudentForm({
        name: '', username: '', age: 16, grade_level: 'Year 9', date_of_birth: '', 
        stream: 'A', room: '', shoe_rack_number: '', home_address: '', email: '', 
        password: '', supervisor_id: '', parent_name: '', parent_contact: ''
      });
      setOpenDialog(false);
      fetchStudentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student? Note: This will fail if the student has attendance records.')) return;

    try {
      const { error } = await supabase.from('student_users').delete().eq('id', id);
      
      if (error) {
        // Check if it's a foreign key constraint error
        if (error.code === '23503') {
          toast({
            title: "Cannot Delete Student",
            description: "This student has attendance records and cannot be deleted. Attendance records must be preserved for historical purposes.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });

      fetchStudentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('student_users')
        .update(editingItem)
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student updated successfully",
      });

      setEditingItem(null);
      fetchStudentUsers();
      onUserCountChange();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update student",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Student Users</CardTitle>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Student</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student-name">Name</Label>
                  <Input
                    id="student-name"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="student-username">Username</Label>
                  <Input
                    id="student-username"
                    value={studentForm.username}
                    onChange={(e) => setStudentForm({...studentForm, username: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="student-age">Age</Label>
                  <Input
                    id="student-age"
                    type="number"
                    value={studentForm.age}
                    onChange={(e) => setStudentForm({...studentForm, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="student-grade">Grade Level</Label>
                  <Select value={studentForm.grade_level} onValueChange={(value: GradeLevelType) => setStudentForm({...studentForm, grade_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Year 9">Year 9</SelectItem>
                      <SelectItem value="Year 10">Year 10</SelectItem>
                      <SelectItem value="Year 11">Year 11</SelectItem>
                      <SelectItem value="Year 12">Year 12</SelectItem>
                      <SelectItem value="Year 13">Year 13</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="student-dob">Date of Birth</Label>
                  <Input
                    id="student-dob"
                    type="date"
                    value={studentForm.date_of_birth}
                    onChange={(e) => setStudentForm({...studentForm, date_of_birth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="student-stream">Stream</Label>
                  <Select value={studentForm.stream} onValueChange={(value: StreamType) => setStudentForm({...studentForm, stream: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="student-room">Room</Label>
                  <Select value={studentForm.room} onValueChange={(value) => setStudentForm({...studentForm, room: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {studentRooms.map(room => (
                        <SelectItem key={room} value={room}>{room}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="student-shoe-rack">Shoe Rack Number</Label>
                  <Input
                    id="student-shoe-rack"
                    value={studentForm.shoe_rack_number}
                    onChange={(e) => setStudentForm({...studentForm, shoe_rack_number: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="student-address">Home Address</Label>
                  <Input
                    id="student-address"
                    value={studentForm.home_address}
                    onChange={(e) => setStudentForm({...studentForm, home_address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="student-password"
                      type={showPassword ? "text" : "password"}
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="student-supervisor">Supervisor</Label>
                  <Select value={studentForm.supervisor_id} onValueChange={(value) => setStudentForm({...studentForm, supervisor_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map(supervisor => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>{supervisor.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="student-parent-name">Parent Name</Label>
                  <Input
                    id="student-parent-name"
                    value={studentForm.parent_name}
                    onChange={(e) => setStudentForm({...studentForm, parent_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="student-parent-contact">Parent Contact</Label>
                  <Input
                    id="student-parent-contact"
                    value={studentForm.parent_contact}
                    onChange={(e) => setStudentForm({...studentForm, parent_contact: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Button onClick={handleAddUser} className="w-full">
                    Add Student
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Stream</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.username}</TableCell>
                  <TableCell>{student.grade_level}</TableCell>
                  <TableCell>{student.stream}</TableCell>
                  <TableCell>{student.room}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(student)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(student.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={editingItem.age || 16}
                    onChange={(e) => setEditingItem({...editingItem, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Grade Level</Label>
                  <Select value={editingItem.grade_level} onValueChange={(value: GradeLevelType) => setEditingItem({...editingItem, grade_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Year 9">Year 9</SelectItem>
                      <SelectItem value="Year 10">Year 10</SelectItem>
                      <SelectItem value="Year 11">Year 11</SelectItem>
                      <SelectItem value="Year 12">Year 12</SelectItem>
                      <SelectItem value="Year 13">Year 13</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={editingItem.date_of_birth || ''}
                    onChange={(e) => setEditingItem({...editingItem, date_of_birth: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Stream</Label>
                  <Select value={editingItem.stream} onValueChange={(value: StreamType) => setEditingItem({...editingItem, stream: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Room</Label>
                  <Select value={editingItem.room} onValueChange={(value) => setEditingItem({...editingItem, room: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {studentRooms.map(room => (
                        <SelectItem key={room} value={room}>{room}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shoe Rack Number</Label>
                  <Input
                    value={editingItem.shoe_rack_number || ''}
                    onChange={(e) => setEditingItem({...editingItem, shoe_rack_number: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Home Address</Label>
                  <Input
                    value={editingItem.home_address || ''}
                    onChange={(e) => setEditingItem({...editingItem, home_address: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingItem.email || ''}
                    onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showEditPassword ? "text" : "password"}
                      value={editingItem.password || ''}
                      onChange={(e) => setEditingItem({...editingItem, password: e.target.value})}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label>Supervisor</Label>
                  <Select value={editingItem.supervisor_id} onValueChange={(value) => setEditingItem({...editingItem, supervisor_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map(supervisor => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>{supervisor.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Parent Name</Label>
                  <Input
                    value={editingItem.parent_name || ''}
                    onChange={(e) => setEditingItem({...editingItem, parent_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Parent Contact</Label>
                  <Input
                    value={editingItem.parent_contact || ''}
                    onChange={(e) => setEditingItem({...editingItem, parent_contact: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Button onClick={handleEditUser} className="w-full">
                    Update Student
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentUserManagement;
