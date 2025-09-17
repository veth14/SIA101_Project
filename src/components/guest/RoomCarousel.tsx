import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Room {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
}

interface RoomCarouselProps {
  rooms: Room[];
  currentRoom: number;
}

export const RoomCarousel: React.FC<RoomCarouselProps> = ({ rooms, currentRoom }) => {
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);
  const [activeRoom, setActiveRoom] = useState(currentRoom);

  const nextRoom = () => {
    setActiveRoom((prev) => (prev + 1) % rooms.length);
  };

  const prevRoom = () => {
    setActiveRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const goToRoom = (index: number) => {
    setActiveRoom(index);
  };

  return (
    <section className="w-full py-12 bg-gradient-to-br from-heritage-light/50 via-white to-heritage-neutral/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-heritage-green/10 text-heritage-green text-lg font-medium rounded-full border border-heritage-green/20">
              Accommodation
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Luxury <span className="bg-gradient-to-r from-heritage-green to-heritage-neutral bg-clip-text text-transparent">Rooms & Suites</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our thoughtfully designed spaces that blend Filipino heritage with modern comfort
          </p>
        </div>

        {/* Split Screen Room Carousel */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Navigation Arrows */}
          <button
            onClick={prevRoom}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white text-heritage-green rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextRoom}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white text-heritage-green rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeRoom * 100}%)` }}
          >
            {rooms.map((room) => (
              <div key={room.id} className="w-full flex-none">
                <div 
                  className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  {/* Image Side */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredRoom === room.id ? 'scale-110' : 'scale-100'
                      }`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-heritage-green text-white text-lg font-bold rounded-full shadow-lg">
                        {room.price}
                      </span>
                    </div>
                  </div>

                  {/* Details Side */}
                  <div className="flex flex-col justify-center p-8 lg:p-12 bg-gradient-to-br from-white to-heritage-light/10">
                    <div className="max-w-lg">
                      {/* Room Category */}
                      <div className="mb-4">
                        <span className="px-4 py-2 bg-heritage-green/10 text-heritage-green text-sm font-medium rounded-full border border-heritage-green/20">
                          Featured Room
                        </span>
                      </div>
                      
                      {/* Room Name */}
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {room.name}
                      </h3>
                      
                      {/* Room Description */}
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {room.description}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                          to={`/rooms?roomId=${room.id}`}
                          className="inline-flex items-center justify-center px-8 py-4 bg-heritage-green hover:bg-heritage-green/90 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105"
                        >
                          View Details
                          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                        
                        <Link 
                          to="/booking"
                          className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-heritage-light/20 text-heritage-green font-semibold rounded-full border-2 border-heritage-green/20 hover:border-heritage-green/40 transition-all duration-300 hover:shadow-lg"
                        >
                          Book Now
                        </Link>
                      </div>

                      {/* Room Features */}
                      <div className="mt-8 flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-sm rounded-full">
                          Free Wi-Fi
                        </span>
                        <span className="px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-sm rounded-full">
                          Air Conditioning
                        </span>
                        <span className="px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-sm rounded-full">
                          Room Service
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Navigation Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {rooms.map((_, index) => (
            <button
              key={index}
              onClick={() => goToRoom(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === activeRoom 
                  ? 'bg-heritage-green scale-125' 
                  : 'bg-heritage-neutral/40 hover:bg-heritage-neutral/60'
              }`}
            />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-10">
          <p className="text-lg text-gray-600 mb-6">
            Experience the perfect blend of comfort and elegance in every room
          </p>
          <Link 
            to="/rooms"
            className="inline-flex items-center px-8 py-4 bg-heritage-neutral hover:bg-heritage-neutral/90 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Explore All Rooms
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
