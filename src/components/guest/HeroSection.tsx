import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

export const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden -mt-22">
      {/* Parallax Background Images */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-110 transition-transform duration-[20s] ease-out"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
      </div>
      
      {/* Dynamic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-heritage-green/30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-heritage-light/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-heritage-green/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full w-full text-white px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-6xl mx-auto transition-all duration-1500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-heritage-light"></div>
            <div className="mx-4 w-3 h-3 bg-heritage-light rounded-full animate-pulse"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-heritage-light"></div>
          </div>
          
          {/* Hotel Name - Big and Bold with Animation */}
          <h1 className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 sm:mb-6 tracking-tight leading-none text-white transition-all duration-2000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <span className="bg-gradient-to-r from-white via-heritage-light to-white bg-clip-text text-transparent animate-pulse">
              Balay Ginhawa
            </span>
          </h1>
          
          {/* Tagline with Stagger Animation */}
          <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-6 sm:mb-8 text-heritage-light transition-all duration-1500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Filipino Heritage Hotel
          </p>
          
          {/* Subtext with Enhanced Typography */}
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-10 sm:mb-12 text-white/90 leading-relaxed max-w-4xl mx-auto transition-all duration-1500 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Where <span className="text-heritage-light font-semibold">timeless Filipino traditions</span> embrace <span className="text-white font-semibold">modern luxury</span>, creating unforgettable experiences in the heart of paradise
          </p>
          
          {/* Enhanced Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center transition-all duration-1500 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Book Your Stay - Enhanced */}
            <Link 
              to="/booking" 
              className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-heritage-green hover:bg-heritage-green/90 text-white font-semibold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-heritage-green/25 hover:scale-105 text-base sm:text-lg overflow-hidden"
              style={{ backgroundColor: '#82A33D' }}
            >
              <span className="relative z-10">Book Your Stay</span>
              <div className="absolute inset-0 bg-gradient-to-r from-heritage-green to-heritage-neutral opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
            
            {/* Explore Rooms - Enhanced */}
            <Link 
              to="/rooms" 
              className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-500 hover:shadow-2xl hover:shadow-white/25 hover:scale-105 text-base sm:text-lg"
            >
              <span className="relative z-10">Explore Rooms</span>
              <div className="absolute inset-0 bg-gradient-to-r from-heritage-light/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1500 delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white/70 text-sm font-medium tracking-wider">SCROLL</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center animate-bounce">
              <div className="w-1 h-3 bg-heritage-light rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Floating Social Proof */}
        <div className={`absolute bottom-20 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-1500 delay-1400 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-heritage-green rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-heritage-neutral rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-heritage-light rounded-full border-2 border-white"></div>
            </div>
            <div className="text-white">
              <div className="text-sm font-semibold">2,500+ Guests</div>
              <div className="text-xs text-white/70">This month</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
