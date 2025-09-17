import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const CallToAction: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-12 bg-gradient-to-br from-heritage-green via-heritage-green/90 to-heritage-neutral relative overflow-hidden">
      {/* Enhanced Background Patterns */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-y-12 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-transparent via-white/20 to-transparent transform skew-y-12 animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-heritage-light/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse delay-1500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Enhanced Badge */}
          <div className="inline-block mb-6 animate-bounce">
            <span className="px-8 py-4 bg-white/20 backdrop-blur-md text-white text-lg font-medium rounded-full border border-white/30 shadow-2xl">
              Ready to Experience?
            </span>
          </div>

          {/* Enhanced Main Heading */}
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight transition-all duration-1500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            Experience Authentic
            <span className="block bg-gradient-to-r from-heritage-light via-white to-heritage-light bg-clip-text text-transparent animate-pulse">
              Filipino Hospitality
            </span>
          </h2>

          {/* Enhanced Description */}
          <p className={`text-lg md:text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Book your stay now and create lasting memories at Balay Ginhawa. 
            Discover the perfect blend of <span className="text-heritage-light font-semibold">heritage charm</span> and <span className="text-white font-semibold">modern luxury</span>.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Link
              to="/booking"
              className="group relative inline-flex items-center justify-center px-12 py-6 bg-white hover:bg-heritage-light text-heritage-green font-bold text-lg rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-white/25 hover:scale-110 min-w-[220px] overflow-hidden"
            >
              <span className="relative z-10">Reserve Now</span>
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-heritage-light to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>

            <Link
              to="/rooms"
              className="group relative inline-flex items-center justify-center px-12 py-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold text-lg rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-500 hover:shadow-2xl hover:shadow-white/25 hover:scale-110 min-w-[220px]"
            >
              <span className="relative z-10">Explore Rooms</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-heritage-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-white/80 font-medium text-lg">Concierge Service</div>
              <div className="w-16 h-1 bg-heritage-light mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">Free</div>
              <div className="text-white/80 font-medium text-lg">Cancellation</div>
              <div className="w-16 h-1 bg-heritage-light mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">Best</div>
              <div className="text-white/80 font-medium text-lg">Price Guarantee</div>
              <div className="w-16 h-1 bg-heritage-light mx-auto mt-2 rounded-full"></div>
            </div>
          </div>

          {/* Enhanced Bottom Text */}
          <div className={`mt-10 text-white/70 text-lg transition-all duration-1000 delay-1100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Join thousands of satisfied guests who have experienced the warmth of Filipino hospitality
          </div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-heritage-light/20 rounded-full translate-x-28 translate-y-28 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-10 w-20 h-20 bg-white/5 rounded-full animate-pulse delay-2000"></div>
    </section>
  );
};
