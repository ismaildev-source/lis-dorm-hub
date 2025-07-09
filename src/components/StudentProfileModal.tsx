
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { User, Mail, MapPin, Phone, Calendar, GraduationCap, Home } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  username: string;
  grade_level: string;
  stream: string;
  room: string;
  age?: number;
  date_of_birth?: string;
  home_address?: string;
  parent_name?: string;
  parent_contact?: string;
  shoe_rack_number?: string;
}

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentProfileModal = ({ student, isOpen, onClose }: StudentProfileModalProps) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto bg-white border-0 shadow-2xl mx-4">
        <DialogHeader className="pb-2 sm:pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-gray-800">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span>Student Profile</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
          {/* Basic Information */}
          <div className="bg-gray-50 p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-4 text-gray-800 flex items-center space-x-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span>Basic Information</span>
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm">Name:</span>
                <span className="text-xs sm:text-sm truncate">{student.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm">Email:</span>
                <span className="text-xs sm:text-sm truncate">{student.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm">Username:</span>
                <span className="text-xs sm:text-sm">{student.username}</span>
              </div>
              {student.age && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">Age:</span>
                  <span className="text-xs sm:text-sm">{student.age}</span>
                </div>
              )}
              {student.date_of_birth && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">Date of Birth:</span>
                  <span className="text-xs sm:text-sm">{new Date(student.date_of_birth).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-blue-50 p-3 sm:p-6 rounded-xl shadow-sm border border-blue-100">
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-4 text-gray-800 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span>Academic Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm">Grade Level:</span>
                <span className="text-xs sm:text-sm">{student.grade_level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm">Stream:</span>
                <span className="text-xs sm:text-sm">{student.stream}</span>
              </div>
            </div>
          </div>

          {/* Accommodation Information */}
          <div className="bg-green-50 p-3 sm:p-6 rounded-xl shadow-sm border border-green-100">
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-4 text-gray-800 flex items-center space-x-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span>Accommodation Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm">Room:</span>
                <span className="text-xs sm:text-sm">{student.room}</span>
              </div>
              {student.shoe_rack_number && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">Shoe Rack:</span>
                  <span className="text-xs sm:text-sm">{student.shoe_rack_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {(student.home_address || student.parent_name || student.parent_contact) && (
            <div className="bg-yellow-50 p-3 sm:p-6 rounded-xl shadow-sm border border-yellow-100">
              <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-4 text-gray-800 flex items-center space-x-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                <span>Contact Information</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {student.home_address && (
                  <div className="flex items-start space-x-2">
                    <Home className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-xs sm:text-sm">Home Address:</span>
                      <p className="text-xs sm:text-sm text-gray-700">{student.home_address}</p>
                    </div>
                  </div>
                )}
                {student.parent_name && (
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">Parent Name:</span>
                    <span className="text-xs sm:text-sm">{student.parent_name}</span>
                  </div>
                )}
                {student.parent_contact && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">Parent Contact:</span>
                    <span className="text-xs sm:text-sm">{student.parent_contact}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 sm:pt-6 border-t border-gray-100">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="px-4 sm:px-8 py-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium text-sm sm:text-base"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;
