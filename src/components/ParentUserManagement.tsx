
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

type GenderType = 'Male' | 'Female';

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

interface ParentUserManagementProps {
  onUserCountChange: () => void;
}

const ParentUserManagement: React.FC<ParentUserManagementProps> = ({ onUserCountChange }) => {
  const { toast } = useToast();
  const [parentUsers, setParentUsers] = useState<ParentUser[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ParentUser | null>(null);

  const [parentForm, setParentForm] = useState({
    name: '', username: '', gender: 'Male' as GenderType, contact: '', email: '', password: '', student_id: ''
  });

  useEffect(() => {
    fetchParentUsers();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from('student_users').select('id, name');
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchParentUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('parent_users').select('*');
      if (error) throw error;
      setParentUsers(data || []);
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
      const { error } = await supabase.from('parent_users').insert([parentForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Parent user added successfully",
      });

      setParentForm({ name: '', username: '', gender: 'Male', contact: '', email: '', password: '', student_id: '' });
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
        .update(editingItem)
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parent Users</CardTitle>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Parent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Parent User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="parent-name">Name</Label>
                <Input
                  id="parent-name"
                  value={parentForm.name}
                  onChange={(e) => setParentForm({...parentForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="parent-username">Username</Label>
                <Input
                  id="parent-username"
                  value={parentForm.username}
                  onChange={(e) => setParentForm({...parentForm, username: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="parent-gender">Gender</Label>
                <Select value={parentForm.gender} onValueChange={(value: GenderType) => setParentForm({...parentForm, gender: value})}>
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
                <Label htmlFor="parent-student">Student</Label>
                <Select value={parentForm.student_id} onValueChange={(value) => setParentForm({...parentForm, student_id: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parent-contact">Contact</Label>
                <Input
                  id="parent-contact"
                  value={parentForm.contact}
                  onChange={(e) => setParentForm({...parentForm, contact: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="parent-email">Email</Label>
                <Input
                  id="parent-email"
                  type="email"
                  value={parentForm.email}
                  onChange={(e) => setParentForm({...parentForm, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="parent-password">Password</Label>
                <Input
                  id="parent-password"
                  type="password"
                  value={parentForm.password}
                  onChange={(e) => setParentForm({...parentForm, password: e.target.value})}
                />
              </div>
              <Button onClick={handleAddUser} className="w-full">
                Add Parent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parentUsers.map((parent) => (
              <TableRow key={parent.id}>
                <TableCell>{parent.name}</TableCell>
                <TableCell>{parent.username}</TableCell>
                <TableCell>{parent.gender}</TableCell>
                <TableCell>{parent.contact}</TableCell>
                <TableCell>{parent.email}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingItem(parent)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(parent.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Parent User</DialogTitle>
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
                  Update Parent User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default ParentUserManagement;
