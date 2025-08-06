
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
  const isFormValid = () => {
    return formData.name.trim() !== '' &&
           formData.username.trim() !== '' &&
           formData.date_of_birth.trim() !== '' &&
           formData.room.trim() !== '' &&
           formData.contact.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.password.trim() !== '';
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-gray-100 rounded-xl shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">{title}</DialogTitle>
        </DialogHeader>
        <div className="bg-white p-6 rounded-lg">
          <div className="space-y-6 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="supervisor-name" className="text-sm font-medium text-gray-700 mb-2 block">Name</Label>
              <Input
                id="supervisor-name"
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="supervisor-username" className="text-sm font-medium text-gray-700 mb-2 block">Username</Label>
              <Input
                id="supervisor-username"
                value={formData.username}
                onChange={(e) => onFormChange('username', e.target.value)}
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="supervisor-gender" className="text-sm font-medium text-gray-700 mb-2 block">Gender</Label>
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
              <Label htmlFor="supervisor-dob" className="text-sm font-medium text-gray-700 mb-2 block">Date of Birth</Label>
              <Input
                id="supervisor-dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => onFormChange('date_of_birth', e.target.value)}
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="supervisor-room" className="text-sm font-medium text-gray-700 mb-2 block">Room</Label>
              <Select value={formData.room} onValueChange={(value) => onFormChange('room', value)}>
                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg">
                  {supervisorRooms.map(room => (
                    <SelectItem key={room} value={room} className="hover:bg-blue-50">{room}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supervisor-contact" className="text-sm font-medium text-gray-700 mb-2 block">Contact</Label>
              <Input
                id="supervisor-contact"
                value={formData.contact}
                onChange={(e) => onFormChange('contact', e.target.value)}
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="supervisor-email" className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
              <Input
                id="supervisor-email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="supervisor-password" className="text-sm font-medium text-gray-700 mb-2 block">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => onFormChange('password', e.target.value)}
                  className="h-11 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button 
              onClick={onSubmit} 
              disabled={!isFormValid()}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              {submitText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorUserForm;
