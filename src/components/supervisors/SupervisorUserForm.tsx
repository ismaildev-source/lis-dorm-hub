
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, EyeOff } from 'lucide-react';

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

interface SupervisorUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    name: string;
    username: string;
    gender: GenderType;
    date_of_birth: string;
    room: string;
    contact: string;
    email: string;
    password: string;
  };
  onFormChange: (field: string, value: string | GenderType) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  title: string;
  submitText: string;
  supervisorRooms: string[];
}

const SupervisorUserForm: React.FC<SupervisorUserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  showPassword,
  onTogglePassword,
  title,
  submitText,
  supervisorRooms
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <Label htmlFor="supervisor-name">Name</Label>
            <Input
              id="supervisor-name"
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supervisor-username">Username</Label>
            <Input
              id="supervisor-username"
              value={formData.username}
              onChange={(e) => onFormChange('username', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supervisor-gender">Gender</Label>
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
            <Label htmlFor="supervisor-dob">Date of Birth</Label>
            <Input
              id="supervisor-dob"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => onFormChange('date_of_birth', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supervisor-room">Room</Label>
            <Select value={formData.room} onValueChange={(value) => onFormChange('room', value)}>
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
              value={formData.contact}
              onChange={(e) => onFormChange('contact', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supervisor-email">Email</Label>
            <Input
              id="supervisor-email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange('email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supervisor-password">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => onFormChange('password', e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button onClick={onSubmit} className="w-full">
            {submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorUserForm;
