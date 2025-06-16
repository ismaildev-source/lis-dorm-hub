
import React from 'react';
import { Home, Users, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Modern
                <span className="text-blue-600 block">Dormitory</span>
                Management
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Streamline your dormitory operations with our comprehensive management system. 
                From student housing to maintenance requests, we've got you covered.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Get Started
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-gray-600">Secure</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <Home className="text-blue-600" size={24} />
                <div>
                  <div className="font-semibold text-gray-900">Room Management</div>
                  <div className="text-sm text-gray-600">Efficient room allocation and tracking</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <Users className="text-green-600" size={24} />
                <div>
                  <div className="font-semibold text-gray-900">Student Portal</div>
                  <div className="text-sm text-gray-600">Easy access to services and information</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <Shield className="text-purple-600" size={24} />
                <div>
                  <div className="font-semibold text-gray-900">Security System</div>
                  <div className="text-sm text-gray-600">Advanced security and monitoring</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200 rounded-full opacity-40 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
