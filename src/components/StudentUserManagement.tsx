
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Plus } from 'lucide-react';
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
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentUser | null>(null);

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
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const { error } = await supabase.from('student_users').delete().eq('id', id);
      
      if (error) throw error;

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
                <Input
                  id="student-password"
                  type="password"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                />
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
      </CardHeader>
      <CardContent>
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
              {studentUsers.map((student) => (
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
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
                  Update Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentUserManagement;
