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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px) to trigger slide change
  const minSwipeDistance = 50;

  const nextRoom = () => {
    setActiveRoom((prev) => (prev + 1) % rooms.length);
  };

  const prevRoom = () => {
    setActiveRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const goToRoom = (index: number) => {
    setActiveRoom(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextRoom();
    }
    if (isRightSwipe) {
      prevRoom();
    }
  };

  return (
    <section className="w-full py-10 sm:py-12 md:py-16 bg-gradient-to-br from-heritage-light/50 via-white to-heritage-neutral/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - MOBILE RESPONSIVE */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="px-4 sm:px-6 py-2 sm:py-3 bg-heritage-green/10 text-heritage-green text-sm sm:text-base md:text-lg font-medium rounded-full border border-heritage-green/20">
              Accommodation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Luxury <span className="bg-gradient-to-r from-heritage-green to-heritage-neutral bg-clip-text text-transparent">Rooms & Suites</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Discover our thoughtfully designed spaces that blend Filipino heritage with modern comfort
          </p>
        </div>

        {/* Split Screen Room Carousel */}
        <div 
          className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Navigation Arrows - HIDDEN ON MOBILE, VISIBLE ON DESKTOP */}
          <button
            onClick={prevRoom}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-heritage-green rounded-full shadow-lg transition-all duration-300 active:scale-95 sm:hover:scale-110 items-center justify-center hidden md:flex"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextRoom}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-heritage-green rounded-full shadow-lg transition-all duration-300 active:scale-95 sm:hover:scale-110 items-center justify-center hidden md:flex"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] sm:min-h-[500px]"
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
                    
                    {/* Price Badge - MOBILE RESPONSIVE */}
                    <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6">
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-heritage-green text-white text-sm sm:text-base md:text-lg font-bold rounded-full shadow-lg">
                        {room.price}
                      </span>
                    </div>
                  </div>

                  {/* Details Side - MOBILE RESPONSIVE */}
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-white to-heritage-light/10">
                    <div className="max-w-lg">
                      {/* Room Category */}
                      <div className="mb-3 sm:mb-4">
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-heritage-green/10 text-heritage-green text-xs sm:text-sm font-medium rounded-full border border-heritage-green/20">
                          Featured Room
                        </span>
                      </div>
                      
                      {/* Room Name */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                        {room.name}
                      </h3>
                      
                      {/* Room Description */}
                      <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                        {room.description}
                      </p>
                      
                      {/* Action Buttons - MOBILE RESPONSIVE */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link 
                          to={`/rooms?roomId=${room.id}`}
                          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-heritage-green hover:bg-heritage-green/90 text-white text-sm sm:text-base font-semibold rounded-full transition-all duration-300 hover:shadow-xl active:scale-95 sm:hover:scale-105"
                        >
                          View Details
                          <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                        
                        <Link 
                          to="/booking"
                          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-heritage-light/20 text-heritage-green text-sm sm:text-base font-semibold rounded-full border-2 border-heritage-green/20 hover:border-heritage-green/40 transition-all duration-300 hover:shadow-lg active:scale-95"
                        >
                          Book Now
                        </Link>
                      </div>

                      {/* Room Features - MOBILE RESPONSIVE */}
                      <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
                        <span className="px-2.5 sm:px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-xs sm:text-sm rounded-full">
                          Free Wi-Fi
                        </span>
                        <span className="px-2.5 sm:px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-xs sm:text-sm rounded-full">
                          Air Conditioning
                        </span>
                        <span className="px-2.5 sm:px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-xs sm:text-sm rounded-full">
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

        {/* Bottom Section - MOBILE RESPONSIVE */}
        <div className="text-center mt-8 sm:mt-10 px-4">
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
            Experience the perfect blend of comfort and elegance in every room
          </p>
          <Link 
            to="/rooms"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-heritage-neutral hover:bg-heritage-neutral/90 text-white text-sm sm:text-base font-semibold rounded-full transition-all duration-300 hover:shadow-xl active:scale-95 sm:hover:scale-105"
          >
            Explore All Rooms
            <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
