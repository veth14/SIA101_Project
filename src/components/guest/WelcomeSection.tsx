import React, { useEffect, useRef, useState } from 'react';

export const WelcomeSection: React.FC = () => {
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
    <section ref={sectionRef} className="w-full py-20 bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-heritage-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-heritage-light/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="space-y-6">
              <div className="inline-block animate-pulse">
                <span className="px-6 py-3 bg-heritage-green/10 text-heritage-green text-lg font-medium rounded-full border border-heritage-green/20 shadow-lg backdrop-blur-sm">
                  Our Story
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to 
                <span className="bg-gradient-to-r from-heritage-green via-heritage-neutral to-heritage-green bg-clip-text text-transparent block mt-2 animate-pulse"> Balay Ginhawa</span>
              </h2>
            </div>
            
            <div className={`space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <p className="relative">
                Nestled in the vibrant heart of the Philippines, Balay Ginhawa stands as a testament to the perfect harmony between 
                <span className="font-semibold text-heritage-green relative">
                  <span className="absolute inset-0 bg-heritage-green/10 rounded px-1 -mx-1"></span>
                  <span className="relative"> timeless Filipino heritage</span>
                </span> and 
                <span className="font-semibold text-heritage-neutral relative">
                  <span className="absolute inset-0 bg-heritage-neutral/10 rounded px-1 -mx-1"></span>
                  <span className="relative"> contemporary luxury</span>
                </span>.
              </p>
              <p>
                Our meticulously crafted spaces tell stories of rich cultural traditions while embracing modern comfort and sophistication. 
                Every corner whispers tales of Filipino hospitality, creating an atmosphere where guests don't just stay—they belong.
              </p>
            </div>

            {/* Enhanced Stats */}
            <div className={`grid grid-cols-3 gap-6 pt-8 border-t-2 border-gradient-to-r from-heritage-green/20 via-heritage-neutral/20 to-heritage-light/20 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-heritage-green mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-sm md:text-base text-heritage-neutral font-medium">Luxury Rooms</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-heritage-green mb-2 group-hover:scale-110 transition-transform duration-300">15+</div>
                <div className="text-sm md:text-base text-heritage-neutral font-medium">Years Experience</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-heritage-green mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-sm md:text-base text-heritage-neutral font-medium">Guest Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Enhanced Images */}
          <div className={`relative transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="grid grid-cols-2 gap-4 h-[600px]">
              {/* Main large image */}
              <div className="col-span-2 relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=95"
                  alt="Filipino Heritage Hotel Lobby"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-heritage-green/25 via-transparent to-transparent group-hover:from-heritage-green/40 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-lg font-semibold">Grand Lobby</div>
                  <div className="text-sm text-white/80">Filipino Heritage Design</div>
                </div>
              </div>
              
              {/* Two smaller images */}
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Hotel Restaurant"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-heritage-neutral/40 via-transparent to-transparent group-hover:from-heritage-neutral/60 transition-all duration-500"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <div className="text-sm font-semibold">Restaurant</div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <img
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Hotel Pool"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-heritage-light/40 via-transparent to-transparent group-hover:from-heritage-light/60 transition-all duration-500"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <div className="text-sm font-semibold">Pool Area</div>
                </div>
              </div>
            </div>

            {/* Enhanced floating badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-2xl border-4 border-heritage-light animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-br from-heritage-green via-heritage-neutral to-heritage-light rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <span className="text-white font-bold text-lg">★</span>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute top-1/4 -left-8 w-16 h-16 bg-heritage-green/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 -right-8 w-12 h-12 bg-heritage-light/20 rounded-full blur-lg animate-pulse delay-2000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
