
import React from 'react';
import { Award, Users, Clock, Zap } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Award, value: '5+', label: 'Years Experience' },
    { icon: Users, value: '100+', label: 'Happy Students' },
    { icon: Clock, value: '24/7', label: 'Customer Support' },
    { icon: Zap, value: '99.9%', label: 'Uptime' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About DormHub
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  DormHub is the leading dormitory management platform designed to streamline operations 
                  and enhance the living experience for students, parents, and administrators alike.
                </p>
                <p>
                  Our comprehensive solution combines cutting-edge technology with user-friendly design 
                  to create a seamless environment where everyone can thrive. From room assignments to 
                  maintenance requests, we handle it all.
                </p>
                <p>
                  With years of experience in educational technology, we understand the unique challenges 
                  faced by dormitory managers and have built our platform to address these needs effectively.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-700">
                To provide innovative, reliable, and user-friendly dormitory management solutions 
                that enhance the residential experience and simplify administrative tasks.
              </p>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <IconComponent size={32} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Community First</h4>
              <p className="text-gray-600">
                We believe in fostering strong communities where students feel safe, supported, and connected.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h4>
              <p className="text-gray-600">
                Continuously improving our platform with the latest technology and user feedback.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h4>
              <p className="text-gray-600">
                Committed to delivering the highest quality service and support to our users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
