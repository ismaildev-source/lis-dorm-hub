
import { ArrowRight } from "lucide-react";
import ImageGallery from "./ImageGallery";

const Hero = () => {
  return (
    <>
      <section className="pt-16 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">LIS Dorm Karen</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive dormitory management system that streamlines student life, 
              attendance tracking, and administrative tasks for educational institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#facilities"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
              >
                <span>Learn More</span>
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <ImageGallery />
    </>
  );
};

export default Hero;
