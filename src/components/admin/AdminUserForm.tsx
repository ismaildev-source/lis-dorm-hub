
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type GenderType = 'Male' | 'Female';

interface AdminFormData {
  name: string;
  username: string;
  gender: GenderType;
  email: string;
  password: string;
}

interface AdminUserFormProps {
  formData: AdminFormData;
  onFormChange: (field: keyof AdminFormData, value: string | GenderType) => void;
  onSubmit: () => void;
  isEditing?: boolean;
}

const AdminUserForm: React.FC<AdminUserFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isEditing = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="admin-name">Name</Label>
        <Input
          id="admin-name"
          value={formData.name}
          onChange={(e) => onFormChange('name', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="admin-username">Username</Label>
        <Input
          id="admin-username"
          value={formData.username}
          onChange={(e) => onFormChange('username', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="admin-gender">Gender</Label>
        <Select value={formData.gender} onValueChange={(value: GenderType) => onFormChange('gender', value)}>
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
          value={formData.email}
          onChange={(e) => onFormChange('email', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          type="password"
          value={formData.password}
          onChange={(e) => onFormChange('password', e.target.value)}
        />
      </div>
      <Button onClick={onSubmit} className="w-full">
        {isEditing ? 'Update Admin User' : 'Add Admin'}
      </Button>
    </div>
  );
};

export default AdminUserForm;
