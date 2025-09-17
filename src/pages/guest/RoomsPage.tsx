import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Room {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
  price: string;
  features: string[];
  amenities: string[];
  maxGuests: number;
  size: string;
}

export const RoomsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const roomRefs = useRef<{ [key: number]: HTMLElement | null }>({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomId = params.get('roomId');
    
    if (roomId) {
      const roomIdNum = parseInt(roomId);
      setTimeout(() => {
        const roomElement = roomRefs.current[roomIdNum];
        if (roomElement) {
          roomElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          setSelectedRoom(roomIdNum);
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search]);

  const rooms: Room[] = [
    {
      id: 1,
      name: 'Silid Payapa',
      type: 'Standard Room',
      description: 'A cozy sanctuary that embodies tranquility and comfort. Perfect for solo travelers or couples seeking an intimate retreat with authentic Filipino hospitality.',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      price: '₱2,500',
      features: ['Queen-size bed', 'City view', 'Air conditioning', 'Private bathroom', 'Work desk'],
      amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee maker', 'Daily housekeeping'],
      maxGuests: 2,
      size: '25 sqm'
    },
    {
      id: 2,
      name: 'Silid Marahuyo',
      type: 'Deluxe Room',
      description: 'Spacious elegance meets modern comfort in this beautifully appointed room. Designed with premium amenities and Filipino-inspired décor for the discerning traveler.',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      price: '₱3,800',
      features: ['King-size bed', 'Ocean view', 'Premium amenities', 'Marble bathroom', 'Seating area'],
      amenities: ['Free Wi-Fi', 'Smart TV', 'Mini bar', 'Coffee & tea station', 'Bathrobes', 'Room service'],
      maxGuests: 2,
      size: '35 sqm'
    },
    {
      id: 3,
      name: 'Silid Ginhawa',
      type: 'Suite Room',
      description: 'Experience ultimate comfort in this sophisticated suite featuring a separate living area, elegant interiors, and enhanced privacy for an unforgettable stay.',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      price: '₱5,500',
      features: ['Separate living area', 'Premium furnishing', 'City & ocean view', 'Luxury bathroom', 'Dining area'],
      amenities: ['Free Wi-Fi', 'Smart TV', 'Full mini bar', 'Coffee machine', 'Premium toiletries', 'Concierge service'],
      maxGuests: 3,
      size: '50 sqm'
    },
    {
      id: 4,
      name: 'Silid Haraya',
      type: 'Premium Family Suite',
      description: 'Our grandest accommodation designed for families and groups. Featuring multiple bedrooms, spacious living areas, and panoramic views in a heritage-inspired setting.',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      price: '₱8,000',
      features: ['Multiple bedrooms', 'Family-friendly layout', 'Panoramic views', 'Premium amenities', 'Private balcony'],
      amenities: ['Free Wi-Fi', 'Multiple TVs', 'Full kitchen', 'Dining area', 'Premium toiletries', '24/7 room service'],
      maxGuests: 6,
      size: '75 sqm'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-heritage-green/95 via-heritage-neutral/90 to-heritage-green/95 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-heritage-light rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-1 bg-heritage-light rounded-full mb-6"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-white via-heritage-light to-white bg-clip-text text-transparent">
              Our Rooms & Suites
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-heritage-light/90 max-w-4xl mx-auto leading-relaxed font-light mb-12">
            Each room at Balay Ginhawa reflects the warmth and beauty of Filipino heritage, 
            designed to provide comfort and create lasting memories.
          </p>
          
          <div className="flex justify-center items-center space-x-2 text-heritage-light/70">
            <div className="w-2 h-2 bg-heritage-light rounded-full animate-pulse"></div>
            <span className="text-sm uppercase tracking-widest font-medium">Discover Your Perfect Stay</span>
            <div className="w-2 h-2 bg-heritage-light rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>

      {/* Rooms Sections */}
      {rooms.map((room, index) => (
        <section 
          key={room.id}
          ref={(el) => roomRefs.current[room.id] = el}
          className={`relative ${
            index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-heritage-light/30 to-heritage-light/60'
          } ${selectedRoom === room.id ? 'ring-4 ring-heritage-green/30' : ''} overflow-hidden`}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className={`absolute ${index % 2 === 0 ? 'top-20 right-20' : 'bottom-20 left-20'} w-72 h-72 bg-heritage-green rounded-full blur-3xl`}></div>
            <div className={`absolute ${index % 2 === 0 ? 'bottom-40 left-40' : 'top-40 right-40'} w-48 h-48 bg-heritage-neutral rounded-full blur-2xl`}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className={`grid lg:grid-cols-2 gap-16 lg:gap-20 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}>
              
              {/* Room Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} relative group`}>
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-3xl">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Enhanced Price Badge */}
                  <div className="absolute top-8 right-8 bg-gradient-to-r from-heritage-green to-heritage-green/90 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl backdrop-blur-sm border border-white/20 transform transition-all duration-300 hover:scale-105">
                    <div className="text-2xl font-bold">{room.price}</div>
                    <div className="text-sm font-normal opacity-90">per night</div>
                  </div>
                  
                  {/* Room Number Badge */}
                  <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm text-heritage-green px-4 py-2 rounded-xl font-semibold shadow-lg">
                    Room {room.id}
                  </div>
                </div>
              </div>

              {/* Enhanced Room Info */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''} space-y-10`}>
                {/* Title Section with Better Spacing */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-5xl lg:text-6xl font-serif font-bold text-heritage-green leading-tight tracking-tight">
                      {room.name}
                    </h2>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-1 bg-heritage-green rounded-full"></div>
                      <p className="text-xl text-heritage-neutral font-medium uppercase tracking-wider">
                        {room.type}
                      </p>
                    </div>
                  </div>
                  <p className="text-xl text-gray-700 leading-relaxed font-light">
                    {room.description}
                  </p>
                </div>

                {/* Enhanced Quick Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-heritage-light/20 backdrop-blur-sm px-6 py-5 rounded-2xl shadow-lg border border-heritage-green/10 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-heritage-green/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">👥</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Max Guests</p>
                        <p className="text-2xl font-bold text-heritage-green">{room.maxGuests}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-heritage-light/20 backdrop-blur-sm px-6 py-5 rounded-2xl shadow-lg border border-heritage-green/10 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-heritage-green/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📐</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Room Size</p>
                        <p className="text-2xl font-bold text-heritage-green">{room.size}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Features */}
                <div className="space-y-6">
                  <h4 className="text-2xl font-serif font-bold text-heritage-green flex items-center">
                    <span className="w-2 h-2 bg-heritage-green rounded-full mr-3"></span>
                    Room Features
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {room.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="bg-gradient-to-r from-heritage-green/10 to-heritage-green/5 text-heritage-green px-5 py-3 rounded-2xl text-sm font-semibold border border-heritage-green/20 hover:from-heritage-green hover:to-heritage-green/90 hover:text-white hover:shadow-lg transform transition-all duration-300 hover:scale-105 cursor-default"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enhanced Amenities */}
                <div className="space-y-6">
                  <h4 className="text-2xl font-serif font-bold text-heritage-green flex items-center">
                    <span className="w-2 h-2 bg-heritage-neutral rounded-full mr-3"></span>
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {room.amenities.map((amenity, idx) => (
                      <span 
                        key={idx}
                        className="bg-gradient-to-r from-heritage-neutral/10 to-heritage-neutral/5 text-heritage-neutral px-5 py-3 rounded-2xl text-sm font-semibold border border-heritage-neutral/20 hover:from-heritage-neutral hover:to-heritage-neutral/90 hover:text-white hover:shadow-lg transform transition-all duration-300 hover:scale-105 cursor-default"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <div className="pt-8">
                  <button 
                    onClick={() => navigate(`/booking?roomId=${room.id}`)}
                    className="group relative w-full bg-gradient-to-r from-heritage-green to-heritage-green/90 hover:from-heritage-green/90 hover:to-heritage-green text-white font-bold py-6 px-12 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-heritage-green/25 transform hover:scale-105 text-xl overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Book {room.name} Now
                      <svg className="ml-3 w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
