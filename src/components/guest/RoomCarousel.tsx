import React from 'react';
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
  return (
    <section className="py-16 px-4 bg-heritage-light">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-heritage-green text-center mb-12">Our Rooms</h2>
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentRoom * 100}%)` }}
          >
            {rooms.map((room) => (
              <div key={room.id} className="w-full flex-none px-4">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <img src={room.image} alt={room.name} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <p className="text-gray-600 mb-4">{room.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-heritage-green font-semibold">{room.price}</span>
                      <Link to={`/rooms/${room.id}`} className="text-heritage-green hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
