
import React from 'react';
import { Home, Users, Calendar, Shield, MessageSquare, BarChart3 } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Home,
      title: 'Room Management',
      description: 'Efficiently manage room assignments, availability, and maintenance requests with our intuitive dashboard.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Student Portal',
      description: 'Students can access their information, submit requests, and communicate with staff seamlessly.',
      color: 'green'
    },
    {
      icon: Calendar,
      title: 'Event Scheduling',
      description: 'Organize dormitory events, meetings, and activities with our integrated calendar system.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Security System',
      description: 'Advanced security features including access control, visitor management, and emergency protocols.',
      color: 'red'
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Centralized communication platform for announcements, messages, and community building.',
      color: 'yellow'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive reporting and analytics to help you make data-driven decisions.',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Dormitories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your dormitory efficiently and provide the best experience for students.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg ${getColorClasses(feature.color)} flex items-center justify-center mb-4`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
