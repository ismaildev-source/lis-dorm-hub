import React, { useState } from 'react';
import { ChevronDown, User, Shield, Users, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userTypes = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'supervisor', label: 'Supervisor', icon: Users },
    { id: 'parent', label: 'Parent', icon: User },
    { id: 'student', label: 'Student', icon: GraduationCap },
  ];

  const handleLogin = (userType: string) => {
    console.log(`Login as ${userType}`);
    setIsDropdownOpen(false);
    
    if (userType === 'admin') {
      navigate('/admin/login');
    } else {
      // Add other user type login logic here later
      console.log(`${userType} login not implemented yet`);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">DormHub</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                About
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Features
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>

          {/* Login Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
            >
              <User size={18} />
              <span>Login</span>
              <ChevronDown size={16} className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                {userTypes.map((user) => {
                  const IconComponent = user.icon;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleLogin(user.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                    >
                      <IconComponent size={18} className="text-gray-600" />
                      <span className="text-gray-700">{user.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
