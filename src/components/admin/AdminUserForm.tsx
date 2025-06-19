
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative">
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => onFormChange('password', e.target.value)}
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
      <Button onClick={onSubmit} className="w-full">
        {isEditing ? 'Update Admin User' : 'Add Admin'}
      </Button>
    </div>
  );
};

export default AdminUserForm;
