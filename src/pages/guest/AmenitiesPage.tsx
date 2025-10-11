import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Amenity {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
  availability: string;
}

export const AmenitiesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const amenities: Amenity[] = [
    {
      id: 1,
      name: 'Free Wi-Fi',
      category: 'connectivity',
      description: 'High-speed internet access throughout the entire property, ensuring you stay connected during your visit.',
      icon: '📶',
      features: ['High-speed broadband', 'Available in all rooms', 'Lobby and common areas', '24/7 technical support'],
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: '24/7'
    },
    {
      id: 2,
      name: 'Infinity Pool',
      category: 'recreation',
      description: 'Stunning infinity pool with breathtaking Manila Bay views, perfect for relaxation and recreation.',
      icon: '🏊',
      features: ['Manila Bay view', 'Temperature controlled', 'Pool bar service', 'Lounge chairs', 'Towel service'],
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80',
      availability: '6:00 AM - 10:00 PM'
    },
    {
      id: 3,
      name: 'Spa Services',
      category: 'wellness',
      description: 'Traditional Filipino spa treatments and modern wellness therapies for ultimate relaxation.',
      icon: '🌿',
      features: ['Traditional Filipino treatments', 'Aromatherapy sessions', 'Couples massage rooms', 'Wellness consultations'],
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: '9:00 AM - 9:00 PM'
    },
    {
      id: 4,
      name: 'Restaurant',
      category: 'dining',
      description: 'Authentic local and international cuisine prepared by our expert culinary team.',
      icon: '🍽️',
      features: ['Local Filipino cuisine', 'International dishes', 'Fresh seafood', 'Vegetarian options', 'Room service'],
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: '6:00 AM - 11:00 PM'
    },
    {
      id: 5,
      name: 'Events Hall',
      category: 'events',
      description: 'Modern function rooms perfect for meetings, conferences, and special celebrations.',
      icon: '🎉',
      features: ['Audio-visual equipment', 'Flexible seating arrangements', 'Catering services', 'Event planning assistance'],
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      availability: 'By reservation'
    },
    {
      id: 6,
      name: 'Fitness Center',
      category: 'wellness',
      description: 'Fully equipped gym with modern exercise equipment and personal training services.',
      icon: '💪',
      features: ['Modern equipment', 'Personal trainers', 'Group classes', 'Locker rooms', 'Towel service'],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: '5:00 AM - 11:00 PM'
    },
    {
      id: 7,
      name: 'Business Center',
      category: 'business',
      description: 'Complete business facilities including computers, printers, and meeting rooms.',
      icon: '💼',
      features: ['Computer workstations', 'Printing services', 'Meeting rooms', 'High-speed internet', 'Secretarial services'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      availability: '24/7'
    },
    {
      id: 8,
      name: 'Concierge Service',
      category: 'service',
      description: 'Professional concierge team to assist with tours, reservations, and local recommendations.',
      icon: '🛎️',
      features: ['Tour arrangements', 'Restaurant reservations', 'Transportation booking', 'Local recommendations'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: '24/7'
    },
    {
      id: 9,
      name: 'Laundry Service',
      category: 'service',
      description: 'Professional laundry and dry cleaning services for your convenience.',
      icon: '👔',
      features: ['Same-day service', 'Dry cleaning', 'Pressing service', 'Pickup and delivery'],
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: '7:00 AM - 7:00 PM'
    },
    {
      id: 10,
      name: 'Airport Shuttle',
      category: 'transportation',
      description: 'Complimentary shuttle service to and from Ninoy Aquino International Airport.',
      icon: '🚐',
      features: ['Complimentary service', 'Scheduled departures', 'Professional drivers', 'Luggage assistance'],
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      availability: 'Scheduled times'
    },
    {
      id: 11,
      name: 'Gift Shop',
      category: 'shopping',
      description: 'Curated selection of local crafts, souvenirs, and travel essentials.',
      icon: '🛍️',
      features: ['Local handicrafts', 'Souvenirs', 'Travel essentials', 'Filipino delicacies'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: '8:00 AM - 8:00 PM'
    },
    {
      id: 12,
      name: 'Rooftop Bar',
      category: 'dining',
      description: 'Elegant rooftop bar with panoramic city views and signature cocktails.',
      icon: '🍸',
      features: ['Panoramic city views', 'Signature cocktails', 'Light snacks', 'Live music weekends'],
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      availability: '5:00 PM - 1:00 AM'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Amenities', icon: '🏨' },
    { id: 'recreation', name: 'Recreation', icon: '🏊' },
    { id: 'dining', name: 'Dining', icon: '🍽️' },
    { id: 'wellness', name: 'Wellness', icon: '🌿' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'service', name: 'Services', icon: '🛎️' },
    { id: 'connectivity', name: 'Connectivity', icon: '📶' },
    { id: 'events', name: 'Events', icon: '🎉' },
    { id: 'transportation', name: 'Transport', icon: '🚐' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' }
  ];

  const filteredAmenities = selectedCategory === 'all' 
    ? amenities 
    : amenities.filter(amenity => amenity.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20 pt-20">
      {/* Header Section */}
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
              Premium Amenities
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-heritage-light/90 max-w-4xl mx-auto leading-relaxed font-light mb-12">
            Experience world-class facilities designed to make your stay unforgettable
          </p>
          
          <div className="flex justify-center items-center space-x-2 text-heritage-light/70">
            <div className="w-2 h-2 bg-heritage-light rounded-full animate-pulse"></div>
            <span className="text-sm uppercase tracking-widest font-medium">Discover Our Exceptional Facilities</span>
            <div className="w-2 h-2 bg-heritage-light rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-heritage-green/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-heritage-green text-white shadow-lg transform scale-105'
                    : 'bg-white text-heritage-green border border-heritage-green/20 hover:bg-heritage-green/5 hover:border-heritage-green/40'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAmenities.map((amenity, index) => (
            <div 
              key={amenity.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={amenity.image} 
                  alt={amenity.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{amenity.icon}</span>
                </div>
                
                {/* Availability Badge */}
                <div className="absolute top-4 right-4 bg-heritage-green/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {amenity.availability}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{amenity.name}</h3>
                  <div className="w-12 h-1 bg-heritage-green rounded-full"></div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {amenity.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-heritage-green rounded-full mr-2"></span>
                    Features
                  </h4>
                  <div className="space-y-2">
                    {amenity.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-heritage-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-heritage-green/10 via-heritage-light/10 to-heritage-green/10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Ready to Experience Our Amenities?
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Book your stay at Balay Ginhawa and enjoy access to all our premium facilities and services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/rooms')}
              className="group relative bg-gradient-to-r from-heritage-green to-heritage-green/90 hover:from-heritage-green/90 hover:to-heritage-green text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-heritage-green/25 transform hover:scale-105 text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                View Our Rooms
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            </button>
            
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => navigate('/'), 300);
              }}
              className="group bg-white text-heritage-green font-bold py-4 px-8 rounded-2xl border-2 border-heritage-green hover:bg-heritage-green hover:text-white transition-all duration-300 text-lg"
            >
              <span className="flex items-center justify-center">
                Back to Home
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
