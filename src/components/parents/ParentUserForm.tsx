
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type GenderType = 'Male' | 'Female';

interface ParentUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  contact: string;
  email: string;
  password?: string;
}

interface ParentUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: ParentUser;
  onFormChange: (field: string, value: any) => void;
  title: string;
  submitText: string;
}

const ParentUserForm: React.FC<ParentUserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  title,
  submitText,
}) => {
  const isFormValid = () => {
    return formData.name.trim() !== '' &&
           formData.username.trim() !== '' &&
           formData.contact.trim() !== '' &&
           formData.email.trim() !== '' &&
           (formData.password === undefined || formData.password.trim() !== '');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
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
            <Select value={formData.gender} onValueChange={(value) => onFormChange('gender', value)}>
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
          {formData.password !== undefined && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => onFormChange('password', e.target.value)}
              />
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

export default ParentUserForm;
