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
    <section ref={sectionRef} className="relative w-full py-20 overflow-hidden bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 rounded-full w-96 h-96 bg-heritage-green/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 rounded-full w-80 h-80 bg-heritage-light/10 blur-2xl"></div>
      
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="space-y-6">
              <div className="inline-block animate-pulse">
                <span className="px-6 py-3 text-lg font-medium border rounded-full shadow-lg bg-heritage-green/10 text-heritage-green border-heritage-green/20 backdrop-blur-sm">
                  Our Story
                </span>
              </div>
              <h2 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                Welcome to 
                <span className="block mt-2 text-transparent bg-gradient-to-r from-heritage-green via-heritage-neutral to-heritage-green bg-clip-text animate-pulse"> Balay Ginhawa</span>
              </h2>
            </div>
            
            <div className={`space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <p className="relative">
                Nestled in the vibrant heart of the Philippines, Balay Ginhawa stands as a testament to the perfect harmony between 
                <span className="relative font-semibold text-heritage-green">
                  <span className="absolute inset-0 px-1 -mx-1 rounded bg-heritage-green/10"></span>
                  <span className="relative"> timeless Filipino heritage</span>
                </span> and 
                <span className="relative font-semibold text-heritage-neutral">
                  <span className="absolute inset-0 px-1 -mx-1 rounded bg-heritage-neutral/10"></span>
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
                <div className="mb-2 text-3xl font-bold transition-transform duration-300 md:text-4xl text-heritage-green group-hover:scale-110">50+</div>
                <div className="text-sm font-medium md:text-base text-heritage-neutral">Luxury Rooms</div>
              </div>
              <div className="text-center group">
                <div className="mb-2 text-3xl font-bold transition-transform duration-300 md:text-4xl text-heritage-green group-hover:scale-110">15+</div>
                <div className="text-sm font-medium md:text-base text-heritage-neutral">Years Experience</div>
              </div>
              <div className="text-center group">
                <div className="mb-2 text-3xl font-bold transition-transform duration-300 md:text-4xl text-heritage-green group-hover:scale-110">98%</div>
                <div className="text-sm font-medium md:text-base text-heritage-neutral">Guest Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Enhanced Images */}
          <div className={`relative transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="grid grid-cols-2 gap-4 h-[600px]">
              {/* Main large image */}
              <div className="relative col-span-2 overflow-hidden shadow-2xl rounded-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=95"
                  alt="Filipino Heritage Hotel Lobby"
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-t from-heritage-green/25 via-transparent to-transparent group-hover:from-heritage-green/40"></div>
                <div className="absolute text-white bottom-4 left-4">
                  <div className="text-lg font-semibold">Grand Lobby</div>
                  <div className="text-sm text-white/80">Filipino Heritage Design</div>
                </div>
              </div>
              
              {/* Two smaller images */}
              <div className="relative overflow-hidden shadow-lg rounded-xl group">
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Hotel Restaurant"
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-t from-heritage-neutral/40 via-transparent to-transparent group-hover:from-heritage-neutral/60"></div>
                <div className="absolute text-white bottom-2 left-2">
                  <div className="text-sm font-semibold">Restaurant</div>
                </div>
              </div>
              
              <div className="relative overflow-hidden shadow-lg rounded-xl group">
                <img
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Hotel Pool"
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-t from-heritage-light/40 via-transparent to-transparent group-hover:from-heritage-light/60"></div>
                <div className="absolute text-white bottom-2 left-2">
                  <div className="text-sm font-semibold">Pool Area</div>
                </div>
              </div>
            </div>

            {/* Enhanced floating badge */}
            <div className="absolute p-4 bg-white border-4 rounded-full shadow-2xl -top-4 -right-4 border-heritage-light animate-pulse">
              <div className="flex items-center justify-center w-16 h-16 transition-transform duration-500 rounded-full bg-gradient-to-br from-heritage-green via-heritage-neutral to-heritage-light group-hover:rotate-12">
                <span className="text-lg font-bold text-white">★</span>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute w-16 h-16 delay-1000 rounded-full top-1/4 -left-8 bg-heritage-green/10 blur-xl animate-pulse"></div>
            <div className="absolute w-12 h-12 rounded-full bottom-1/4 -right-8 bg-heritage-light/20 blur-lg animate-pulse delay-2000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
