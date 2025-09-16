import { Link } from 'react-router-dom';
import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative h-[90vh] bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-4 text-center">
          Balay Ginhawa
          <span className="block text-3xl md:text-4xl mt-2">Filipino Heritage Hotel</span>
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-3xl mb-8 font-light">
          Where tradition meets modern comfort
        </p>
        <div className="flex gap-4">
          <Link to="/booking" className="bg-heritage-green text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all">
            Book Now
          </Link>
          <Link to="/rooms" className="bg-white text-heritage-green px-8 py-3 rounded-md hover:bg-opacity-90 transition-all">
            View Rooms
          </Link>
        </div>
      </div>
    </div>
  );
};
