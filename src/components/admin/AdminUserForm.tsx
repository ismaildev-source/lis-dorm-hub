
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="space-y-6">
        <div>
          <Label htmlFor="admin-name" className="text-sm font-medium text-gray-700 mb-2 block">Name</Label>
          <Input
            id="admin-name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="admin-username" className="text-sm font-medium text-gray-700 mb-2 block">Username</Label>
          <Input
            id="admin-username"
            value={formData.username}
            onChange={(e) => onFormChange('username', e.target.value)}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="admin-gender" className="text-sm font-medium text-gray-700 mb-2 block">Gender</Label>
          <Select value={formData.gender} onValueChange={(value: GenderType) => onFormChange('gender', value)}>
            <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="Male" className="hover:bg-blue-50">Male</SelectItem>
              <SelectItem value="Female" className="hover:bg-blue-50">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="admin-email" className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
          <Input
            id="admin-email"
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700 mb-2 block">Password</Label>
          <div className="relative">
            <Input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onFormChange('password', e.target.value)}
              className="h-11 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <Button 
          onClick={onSubmit} 
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
        >
          {isEditing ? 'Update Admin User' : 'Add Admin'}
        </Button>
      </div>
    </div>
  );
};

export default AdminUserForm;
