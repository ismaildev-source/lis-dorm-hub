
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = () => {
  const images = [
    '/lovable-uploads/ccddb618-d423-4445-ba57-9987751480d1.png',
    '/lovable-uploads/66a060e0-b29e-44eb-8151-a34f9e9fb4c7.png',
    '/lovable-uploads/c529d743-d0ed-45bb-b9e0-a94c857b1d7f.png',
    '/lovable-uploads/0ca34f9f-6cdc-4bc7-9e46-7cf975296750.png',
    '/lovable-uploads/5f68a442-05a6-4205-9690-39d6ddfec94b.png',
    '/lovable-uploads/bd49ba61-5896-459f-a493-add07a1b27d9.png',
    '/lovable-uploads/7b79d326-60ac-43e6-a253-b659846bd4b7.png',
    '/lovable-uploads/9da9dd31-9c6e-4d15-af76-3ee41b7768f2.png',
    '/lovable-uploads/5647d9cc-ec25-40f0-bc9b-44a6f2aa0142.png'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section className="py-16 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Dormitory Facilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a virtual tour of our modern dormitory facilities designed for comfort and learning.
          </p>
        </div>
        
        <div className="relative w-full">
          <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
            <img
              src={images[currentIndex]}
              alt={`Dormitory facility ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
