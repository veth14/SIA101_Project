import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
export const RoomCarousel = ({ rooms, currentRoom }) => {
    const [hoveredRoom, setHoveredRoom] = useState(null);
    const [activeRoom, setActiveRoom] = useState(currentRoom);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    // Minimum swipe distance (in px) to trigger slide change
    const minSwipeDistance = 50;
    const nextRoom = () => {
        setActiveRoom((prev) => (prev + 1) % rooms.length);
    };
    const prevRoom = () => {
        setActiveRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
    };
    const goToRoom = (index) => {
        setActiveRoom(index);
    };
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd)
            return;
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
    return (_jsx("section", { className: "w-full py-10 sm:py-12 md:py-16 bg-gradient-to-br from-heritage-light/50 via-white to-heritage-neutral/20", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-8 sm:mb-10", children: [_jsx("div", { className: "inline-block mb-4 sm:mb-6", children: _jsx("span", { className: "px-4 sm:px-6 py-2 sm:py-3 bg-heritage-green/10 text-heritage-green text-sm sm:text-base md:text-lg font-medium rounded-full border border-heritage-green/20", children: "Accommodation" }) }), _jsxs("h2", { className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4", children: ["Luxury ", _jsx("span", { className: "bg-gradient-to-r from-heritage-green to-heritage-neutral bg-clip-text text-transparent", children: "Rooms & Suites" })] }), _jsx("p", { className: "text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4", children: "Discover our thoughtfully designed spaces that blend Filipino heritage with modern comfort" })] }), _jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-white shadow-2xl", onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, children: [_jsx("button", { onClick: prevRoom, className: "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-heritage-green rounded-full shadow-lg transition-all duration-300 active:scale-95 sm:hover:scale-110 items-center justify-center hidden md:flex", children: _jsx("svg", { className: "w-5 h-5 sm:w-6 sm:h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), _jsx("button", { onClick: nextRoom, className: "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-heritage-green rounded-full shadow-lg transition-all duration-300 active:scale-95 sm:hover:scale-110 items-center justify-center hidden md:flex", children: _jsx("svg", { className: "w-5 h-5 sm:w-6 sm:h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) }), _jsx("div", { className: "flex transition-transform duration-700 ease-out", style: { transform: `translateX(-${activeRoom * 100}%)` }, children: rooms.map((room) => (_jsx("div", { className: "w-full flex-none", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 min-h-[400px] sm:min-h-[500px]", onMouseEnter: () => setHoveredRoom(room.id), onMouseLeave: () => setHoveredRoom(null), children: [_jsxs("div", { className: "relative overflow-hidden", children: [_jsx("img", { src: room.image, alt: room.name, className: `w-full h-full object-cover transition-transform duration-700 ${hoveredRoom === room.id ? 'scale-110' : 'scale-100'}` }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent to-black/20" }), _jsx("div", { className: "absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6", children: _jsx("span", { className: "px-3 sm:px-4 py-1.5 sm:py-2 bg-heritage-green text-white text-sm sm:text-base md:text-lg font-bold rounded-full shadow-lg", children: room.price }) })] }), _jsx("div", { className: "flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-white to-heritage-light/10", children: _jsxs("div", { className: "max-w-lg", children: [_jsx("div", { className: "mb-3 sm:mb-4", children: _jsx("span", { className: "px-3 sm:px-4 py-1.5 sm:py-2 bg-heritage-green/10 text-heritage-green text-xs sm:text-sm font-medium rounded-full border border-heritage-green/20", children: "Featured Room" }) }), _jsx("h3", { className: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight", children: room.name }), _jsx("p", { className: "text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed", children: room.description }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 sm:gap-4", children: [_jsxs(Link, { to: `/rooms?roomId=${room.id}`, className: "inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-heritage-green hover:bg-heritage-green/90 text-white text-sm sm:text-base font-semibold rounded-full transition-all duration-300 hover:shadow-xl active:scale-95 sm:hover:scale-105", children: ["View Details", _jsx("svg", { className: "ml-2 w-4 h-4 sm:w-5 sm:h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })] }), _jsx(Link, { to: "/booking", className: "inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-heritage-light/20 text-heritage-green text-sm sm:text-base font-semibold rounded-full border-2 border-heritage-green/20 hover:border-heritage-green/40 transition-all duration-300 hover:shadow-lg active:scale-95", children: "Book Now" })] }), _jsxs("div", { className: "mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3", children: [_jsx("span", { className: "px-2.5 sm:px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-xs sm:text-sm rounded-full", children: "Free Wi-Fi" }), _jsx("span", { className: "px-2.5 sm:px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-xs sm:text-sm rounded-full", children: "Air Conditioning" }), _jsx("span", { className: "px-2.5 sm:px-3 py-1 bg-heritage-neutral/10 text-heritage-neutral text-xs sm:text-sm rounded-full", children: "Room Service" })] })] }) })] }) }, room.id))) })] }), _jsx("div", { className: "flex justify-center mt-12 space-x-3", children: rooms.map((_, index) => (_jsx("button", { onClick: () => goToRoom(index), className: `w-4 h-4 rounded-full transition-all duration-300 ${index === activeRoom
                            ? 'bg-heritage-green scale-125'
                            : 'bg-heritage-neutral/40 hover:bg-heritage-neutral/60'}` }, index))) }), _jsxs("div", { className: "text-center mt-8 sm:mt-10 px-4", children: [_jsx("p", { className: "text-base sm:text-lg text-gray-600 mb-4 sm:mb-6", children: "Experience the perfect blend of comfort and elegance in every room" }), _jsxs(Link, { to: "/rooms", className: "inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-heritage-neutral hover:bg-heritage-neutral/90 text-white text-sm sm:text-base font-semibold rounded-full transition-all duration-300 hover:shadow-xl active:scale-95 sm:hover:scale-105", children: ["Explore All Rooms", _jsx("svg", { className: "ml-2 w-4 h-4 sm:w-5 sm:h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })] })] })] }) }));
};
