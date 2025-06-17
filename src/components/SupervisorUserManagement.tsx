
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
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<SupervisorUser | null>(null);

  const [supervisorForm, setSupervisorForm] = useState({
    name: '', username: '', gender: 'Male' as GenderType, date_of_birth: '', room: '', contact: '', email: '', password: ''
  });

  const supervisorRooms = ['Room S01', 'Room S02', 'Room S03', 'Room S04'];

  useEffect(() => {
    fetchSupervisorUsers();
  }, []);

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Supervisor Users</CardTitle>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Supervisor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
              <Button onClick={handleAddUser} className="w-full">
                Add Supervisor
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
              <TableHead>Room</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supervisorUsers.map((supervisor) => (
              <TableRow key={supervisor.id}>
                <TableCell>{supervisor.name}</TableCell>
                <TableCell>{supervisor.username}</TableCell>
                <TableCell>{supervisor.gender}</TableCell>
                <TableCell>{supervisor.room}</TableCell>
                <TableCell>{supervisor.contact}</TableCell>
                <TableCell>{supervisor.email}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingItem(supervisor)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(supervisor.id)}>
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
                <DialogTitle>Edit Supervisor User</DialogTitle>
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
                  Update Supervisor User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisorUserManagement;
