import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconType } from 'react-icons';

interface AmenityProps {
  icon: IconType;
  name: string;
  description: string;
}

interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}

export const AmenitiesSection: React.FC<{ amenities: AmenityProps[] }> = ({ amenities }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-12 bg-gradient-to-br from-white via-heritage-light/10 to-white relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-heritage-green/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-heritage-neutral/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className={`text-center mb-10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-block mb-6 animate-bounce">
            <span className="px-6 py-3 bg-heritage-green/10 text-heritage-green text-lg font-medium rounded-full border border-heritage-green/20 shadow-lg backdrop-blur-sm">
              Hotel Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Premium <span className="bg-gradient-to-r from-heritage-green via-heritage-neutral to-heritage-green bg-clip-text text-transparent animate-pulse">Amenities</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience world-class facilities designed to make your stay unforgettable
          </p>
        </div>

        {/* Enhanced Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {amenities.map(({ icon: Icon, name, description }, index) => {
            const IconComponent = Icon as React.ComponentType<IconBaseProps>;
            return (
              <div 
                key={name} 
                className={`group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-heritage-light/20 hover:from-heritage-green/5 hover:to-heritage-neutral/10 border border-heritage-light/30 hover:border-heritage-green/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-heritage-green/10 to-heritage-neutral/10 rounded-full flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-heritage-green group-hover:to-heritage-neutral group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <IconComponent className="w-10 h-10 text-heritage-green group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-heritage-green transition-colors duration-300">
                  {name}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {description}
                </p>
                
                {/* Decorative elements */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-heritage-light rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-heritage-neutral rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className={`text-center mt-10 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg text-gray-600 mb-6">
            Discover more about our exceptional facilities and services
          </p>
          <button 
            onClick={() => navigate('/amenities')}
            className="group relative px-10 py-5 bg-gradient-to-r from-heritage-green to-heritage-neutral hover:from-heritage-neutral hover:to-heritage-green text-white font-semibold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-heritage-green/25 hover:scale-110 overflow-hidden"
          >
            <span className="relative z-10">View All Amenities</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
          </button>
        </div>
      </div>
    </section>
  );
};
