
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';

type GenderType = 'Male' | 'Female';
type GradeLevel = 'Year 9' | 'Year 10' | 'Year 11' | 'Year 12' | 'Year 13';

interface StudentUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  date_of_birth: string;
  grade_level: GradeLevel;
  contact: string;
  email: string;
  address: string;
  parent_name: string;
  password?: string;
}

interface StudentUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: StudentUser;
  onFormChange: (field: string, value: string | GenderType | GradeLevel) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  title: string;
  submitText: string;
  gradeLevels: GradeLevel[];
}

const StudentUserForm: React.FC<StudentUserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  showPassword,
  onTogglePassword,
  title,
  submitText,
  gradeLevels,
}) => {
  const isFormValid = () => {
    return formData.name.trim() !== '' &&
           formData.username.trim() !== '' &&
           formData.date_of_birth.trim() !== '' &&
           formData.grade_level.trim() !== '' &&
           formData.contact.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.address.trim() !== '' &&
           formData.parent_name.trim() !== '' &&
           (formData.password === undefined || formData.password.trim() !== '');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => onFormChange('username', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => onFormChange('gender', value as GenderType)}>
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
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => onFormChange('date_of_birth', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="grade_level">Grade Level</Label>
            <Select value={formData.grade_level} onValueChange={(value) => onFormChange('grade_level', value as GradeLevel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gradeLevels.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => onFormChange('contact', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange('email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onFormChange('address', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="parent_name">Parent Name</Label>
            <Input
              id="parent_name"
              value={formData.parent_name}
              onChange={(e) => onFormChange('parent_name', e.target.value)}
            />
          </div>
          {formData.password !== undefined && (
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => onFormChange('password', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={onTogglePassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={onSubmit}
              disabled={!isFormValid()}
              className="disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentUserForm;
