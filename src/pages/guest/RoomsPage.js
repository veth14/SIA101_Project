import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
export const RoomsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const roomRefs = useRef({});
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
        }
        else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.search]);
    const rooms = [
        {
            id: 1,
            name: 'Silid Payapa',
            type: 'Standard Room',
            description: 'A cozy sanctuary that embodies tranquility and comfort. Perfect for solo travelers or couples seeking an intimate retreat with authentic Filipino hospitality.',
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            price: '₱2,500',
            features: ['Queen-size bed', 'City view', 'Air conditioning', 'Private bathroom', 'Work desk'],
            amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee maker', 'Daily housekeeping'],
            maxGuests: 4,
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
            maxGuests: 5,
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
            maxGuests: 6,
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
            maxGuests: 8,
            size: '75 sqm'
        }
    ];
    return (_jsxs("div", { className: "min-h-screen pt-16 sm:pt-20", children: [_jsxs("div", { className: "relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-heritage-green/95 via-heritage-neutral/90 to-heritage-green/95 text-white overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 opacity-10", children: [_jsx("div", { className: "absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-20 right-20 w-48 h-48 bg-heritage-light rounded-full blur-2xl" }), _jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" })] }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" }), _jsxs("div", { className: "relative max-w-5xl mx-auto text-center", children: [_jsx("div", { className: "mb-8", children: _jsx("div", { className: "inline-flex items-center justify-center w-20 h-1 bg-heritage-light rounded-full mb-6" }) }), _jsx("h1", { className: "text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold mb-6 sm:mb-8 tracking-tight leading-tight", children: _jsx("span", { className: "bg-gradient-to-r from-white via-heritage-light to-white bg-clip-text text-transparent", children: "Our Rooms & Suites" }) }), _jsx("p", { className: "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-heritage-light/90 max-w-4xl mx-auto leading-relaxed font-light mb-8 sm:mb-12 px-2", children: "Each room at Balay Ginhawa reflects the warmth and beauty of Filipino heritage, designed to provide comfort and create lasting memories." }), _jsxs("div", { className: "flex justify-center items-center space-x-2 text-heritage-light/70", children: [_jsx("div", { className: "w-2 h-2 bg-heritage-light rounded-full animate-pulse" }), _jsx("span", { className: "text-sm uppercase tracking-widest font-medium", children: "Discover Your Perfect Stay" }), _jsx("div", { className: "w-2 h-2 bg-heritage-light rounded-full animate-pulse delay-500" })] })] })] }), rooms.map((room, index) => (_jsxs("section", { ref: (el) => roomRefs.current[room.id] = el, className: `relative bg-white lg:${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-heritage-light/30 to-heritage-light/60'} ${selectedRoom === room.id ? 'ring-4 ring-heritage-green/30' : ''} ${index !== 0 ? 'border-t lg:border-t-0 border-heritage-green/10' : ''} overflow-hidden`, children: [_jsxs("div", { className: "absolute inset-0 opacity-0 lg:opacity-5", children: [_jsx("div", { className: `absolute ${index % 2 === 0 ? 'top-20 right-20' : 'bottom-20 left-20'} w-72 h-72 bg-heritage-green rounded-full blur-3xl` }), _jsx("div", { className: `absolute ${index % 2 === 0 ? 'bottom-40 left-40' : 'top-40 right-40'} w-48 h-48 bg-heritage-neutral rounded-full blur-2xl` })] }), _jsx("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24", children: _jsxs("div", { className: `grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`, children: [_jsx("div", { className: `${index % 2 === 1 ? 'lg:col-start-2' : ''} relative group`, children: _jsxs("div", { className: "relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl transform transition-all duration-700 sm:group-hover:scale-[1.02] group-hover:shadow-3xl", children: [_jsx("img", { src: room.image, alt: room.name, className: "w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" }), _jsxs("div", { className: "absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 bg-gradient-to-r from-heritage-green to-heritage-green/90 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-bold shadow-2xl backdrop-blur-sm border border-white/20 transform transition-all duration-300 hover:scale-105", children: [_jsx("div", { className: "text-lg sm:text-xl md:text-2xl font-bold", children: room.price }), _jsx("div", { className: "text-xs sm:text-sm font-normal opacity-90", children: "per night" })] }), _jsxs("div", { className: "absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 bg-white/90 backdrop-blur-sm text-heritage-green px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg", children: ["Room ", room.id] })] }) }), _jsxs("div", { className: `${index % 2 === 1 ? 'lg:col-start-1' : ''} space-y-6 sm:space-y-8 md:space-y-10`, children: [_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "space-y-2 sm:space-y-3", children: [_jsx("h2", { className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-heritage-green leading-tight tracking-tight", children: room.name }), _jsxs("div", { className: "flex items-center space-x-2 sm:space-x-3", children: [_jsx("div", { className: "w-8 sm:w-10 md:w-12 h-1 bg-heritage-green rounded-full" }), _jsx("p", { className: "text-sm sm:text-base md:text-lg lg:text-xl text-heritage-neutral font-medium uppercase tracking-wider", children: room.type })] })] }), _jsx("p", { className: "text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-light", children: room.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 sm:gap-4 md:gap-6", children: [_jsx("div", { className: "bg-gradient-to-br from-white to-heritage-light/20 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl shadow-lg border border-heritage-green/10 transform transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-xl", children: _jsxs("div", { className: "flex items-center space-x-2 sm:space-x-3 md:space-x-4", children: [_jsx("div", { className: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-heritage-green/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-lg sm:text-xl md:text-2xl", children: "\uD83D\uDC65" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs sm:text-sm text-gray-600 font-medium", children: "Max Guests" }), _jsx("p", { className: "text-lg sm:text-xl md:text-2xl font-bold text-heritage-green", children: room.maxGuests })] })] }) }), _jsx("div", { className: "bg-gradient-to-br from-white to-heritage-light/20 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl shadow-lg border border-heritage-green/10 transform transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-xl", children: _jsxs("div", { className: "flex items-center space-x-2 sm:space-x-3 md:space-x-4", children: [_jsx("div", { className: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-heritage-green/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-lg sm:text-xl md:text-2xl", children: "\uD83D\uDCD0" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs sm:text-sm text-gray-600 font-medium", children: "Room Size" }), _jsx("p", { className: "text-lg sm:text-xl md:text-2xl font-bold text-heritage-green", children: room.size })] })] }) })] }), _jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("h4", { className: "text-lg sm:text-xl md:text-2xl font-serif font-bold text-heritage-green flex items-center", children: [_jsx("span", { className: "w-2 h-2 bg-heritage-green rounded-full mr-2 sm:mr-3" }), "Room Features"] }), _jsx("div", { className: "flex flex-wrap gap-2 sm:gap-3", children: room.features.map((feature, idx) => (_jsx("span", { className: "bg-gradient-to-r from-heritage-green/10 to-heritage-green/5 text-heritage-green px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold border border-heritage-green/20 hover:from-heritage-green hover:to-heritage-green/90 hover:text-white hover:shadow-lg transform transition-all duration-300 active:scale-95 sm:hover:scale-105 cursor-default", children: feature }, idx))) })] }), _jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("h4", { className: "text-lg sm:text-xl md:text-2xl font-serif font-bold text-heritage-green flex items-center", children: [_jsx("span", { className: "w-2 h-2 bg-heritage-neutral rounded-full mr-2 sm:mr-3" }), "Amenities"] }), _jsx("div", { className: "flex flex-wrap gap-2 sm:gap-3", children: room.amenities.map((amenity, idx) => (_jsx("span", { className: "bg-gradient-to-r from-heritage-neutral/10 to-heritage-neutral/5 text-heritage-neutral px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold border border-heritage-neutral/20 hover:from-heritage-neutral hover:to-heritage-neutral/90 hover:text-white hover:shadow-lg transform transition-all duration-300 active:scale-95 sm:hover:scale-105 cursor-default", children: amenity }, idx))) })] }), _jsx("div", { className: "pt-6 sm:pt-8", children: _jsxs("button", { onClick: () => navigate(`/booking?roomId=${room.id}`), className: "group relative w-full bg-gradient-to-r from-heritage-green to-heritage-green/90 hover:from-heritage-green/90 hover:to-heritage-green text-white font-bold py-3 sm:py-4 md:py-5 lg:py-6 px-6 sm:px-8 md:px-10 lg:px-12 rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-heritage-green/25 transform active:scale-95 sm:hover:scale-105 text-base sm:text-lg md:text-xl overflow-hidden", children: [_jsxs("span", { className: "relative z-10 flex items-center justify-center", children: ["Book ", room.name, " Now", _jsx("svg", { className: "ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })] }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" })] }) })] })] }) })] }, room.id)))] }));
};
