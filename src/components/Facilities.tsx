
import React from 'react';
import { Bed, PenTool, Gamepad2, Users, Monitor, Shirt, Bath, Droplets } from 'lucide-react';

const Facilities = () => {
  const facilities = [
    {
      icon: Bed,
      title: 'Modern Rooms',
      description: 'Spacious and comfortable rooms to ensure students rest well.',
      gradient: 'from-red-500 to-blue-500'
    },
    {
      icon: PenTool,
      title: 'Study Rooms',
      description: 'Quiet, well-equipped areas to foster focused learning and academic excellence.',
      gradient: 'from-red-500 to-blue-500'
    },
    {
      icon: Gamepad2,
      title: 'Gaming Rooms',
      description: 'Equipped with recreational activities to help students unwind.',
      gradient: 'from-red-500 to-blue-500'
    },
    {
      icon: Users,
      title: 'Mentorship Rooms',
      description: 'Dedicated spaces for one-on-one guidance and group mentorship sessions.',
      gradient: 'from-red-500 to-blue-500'
    },
    {
      icon: Monitor,
      title: 'TV Rooms',
      description: 'Cozy spaces for relaxation and entertainment.',
      gradient: 'from-red-500 to-blue-500'
    },
    {
      icon: Shirt,
      title: 'Laundry Area',
      description: 'Convenient facilities for students to manage their laundry needs.',
      gradient: 'from-red-500 to-blue-500'
    },
    {
      icon: Bath,
      title: 'Clean Washrooms',
      description: 'Maintained to high hygiene standards for comfort and cleanliness.',
      gradient: 'from-red-500 to-blue-500'
    },
    {
      icon: Droplets,
      title: 'Hot Showers',
      description: 'Available to ensure students enjoy a refreshing and comfortable experience.',
      gradient: 'from-red-500 to-blue-500'
    }
  ];

  return (
    <section id="facilities" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Facilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for a comfortable dormitory experience with modern amenities and excellent care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, index) => {
            const IconComponent = facility.icon;
            return (
              <div 
                key={index}
                className={`p-6 rounded-xl bg-gradient-to-br ${facility.gradient} text-white hover:scale-105 transform transition-all duration-300 hover:shadow-2xl cursor-pointer group`}
              >
                <div className="flex flex-col items-start h-full">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {facility.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed text-sm">
                    {facility.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Facilities;
