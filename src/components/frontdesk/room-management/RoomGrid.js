import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import RoomCard from './RoomCard';
const RoomGrid = ({ rooms, loading, error, onView, onEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    useEffect(() => {
        setCurrentPage(1);
    }, [rooms]);
    const totalPages = Math.ceil(rooms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRooms = rooms.slice(startIndex, endIndex);
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++)
                    pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++)
                    pages.push(i);
            }
            else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++)
                    pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };
    if (loading) {
        return (_jsx("div", { className: "bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden", children: _jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-green mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Loading rooms..." }), _jsx("p", { className: "text-gray-600", children: "Fetching room data from database" })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden", children: _jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\u26A0\uFE0F" }), _jsx("h3", { className: "text-xl font-semibold text-red-600 mb-2", children: "Error Loading Rooms" }), _jsx("p", { className: "text-gray-600 mb-4", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors", children: "Retry" })] }) }));
    }
    if (rooms.length === 0 && !loading) {
        return (_jsx("div", { className: "bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden", children: _jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83C\uDFE8" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No rooms found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your search criteria or filters." })] }) }));
    }
    return (_jsxs("div", { className: "bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden", children: [_jsx("div", { className: "px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Hotel Rooms" }), _jsxs("p", { className: "text-sm text-gray-500 font-medium", children: ["Showing ", startIndex + 1, "-", Math.min(endIndex, rooms.length), " of ", rooms.length, " rooms \u2022 Page ", currentPage, " of ", totalPages] })] })] }) }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 items-stretch", children: currentRooms.map((room, index) => (_jsx("div", { className: "opacity-0 animate-pulse h-full", style: {
                                animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`
                            }, children: _jsx(RoomCard, { roomNumber: room.roomNumber, roomName: room.roomName, roomType: room.roomType, status: room.status, price: room.basePrice, guest: room.guest, checkIn: room.checkIn, checkOut: room.checkOut, features: room.features, maxFeatures: 3, onViewDetails: () => onView(room), onEdit: () => onEdit(room) }) }, room.roomNumber))) }), _jsx("style", { dangerouslySetInnerHTML: {
                            __html: `
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `
                        } }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-center space-x-2 pt-6 border-t border-gray-100", children: [_jsx("button", { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} transition-colors`, children: "Previous" }), _jsx("div", { className: "flex items-center space-x-1", children: getPageNumbers().map((pageNum, index) => (_jsx("button", { onClick: () => typeof pageNum === 'number' && setCurrentPage(pageNum), disabled: pageNum === '...', className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${currentPage === pageNum
                                        ? 'bg-heritage-green text-white'
                                        : pageNum === '...'
                                            ? 'text-gray-400 cursor-default'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`, children: pageNum }, index))) }), _jsx("button", { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} transition-colors`, children: "Next" })] }))] })] }));
};
export default RoomGrid;
