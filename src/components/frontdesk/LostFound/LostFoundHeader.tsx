import React from 'react';

const LostFoundHeader: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
      
      {/* Header Content */}
      <div className="relative p-10">
        <div className="flex items-center justify-between">
          {/* Left Side - Title and Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {/* Icon with Glow Effect */}
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>
              
              {/* Title and Description */}
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                  Lost & Found
                </h1>
                <p className="text-xl text-gray-700 font-medium tracking-wide">
                  Manage lost and found items efficiently
                </p>
                
                {/* Status Indicators */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-700">All System operational</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-blue-700">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Real-time Clock */}
          <div className="text-right">
            <div className="relative group">
              <div className="bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative">
                  <p className="text-4xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <div className="w-1 h-1 bg-[#82A33D] rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-green-600 rounded-full animate-ping delay-75"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-ping delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFoundHeader;
