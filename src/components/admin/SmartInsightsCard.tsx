import React from 'react';

const SmartInsightsCard: React.FC = () => {
  return (
    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 group overflow-hidden h-full min-h-[400px]">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-50/40 to-purple-500/10 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 right-4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping delay-500"></div>
      
      <div className="relative">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full animate-pulse border-2 border-white"></div>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h3 className="text-xl font-black text-blue-600 drop-shadow-sm">Smart Insights</h3>
            </div>
            <p className="text-sm text-gray-600 font-medium">AI-powered analytics</p>
          </div>
        </div>
      
        <div className="space-y-6">
          {/* Guest Satisfaction */}
          <div className="p-6 bg-heritage-light/30 rounded-2xl border border-blue-200/30 relative overflow-hidden group/card hover:bg-heritage-light/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative flex items-center justify-between mb-3">
              <span className="text-base font-black text-blue-600">Guest Satisfaction</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'} drop-shadow-sm`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-lg font-black text-blue-600 ml-2">4.8/5</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Excellent ratings from recent guests</p>
          </div>

          {/* Most Popular Room */}
          <div className="p-6 bg-heritage-light/30 rounded-2xl border border-heritage-green/30 relative overflow-hidden group/card hover:bg-heritage-light/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-heritage-green/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative flex items-center justify-between mb-3">
              <span className="text-base font-black text-heritage-green">Most Popular Room</span>
              <span className="text-sm font-bold text-heritage-green bg-heritage-green/10 px-3 py-2 rounded-xl border border-heritage-green/20">Deluxe Suite</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">65% of bookings prefer this room type</p>
          </div>

          {/* Peak Check-in Time */}
          <div className="p-6 bg-heritage-light/30 rounded-2xl border border-amber-200/30 relative overflow-hidden group/card hover:bg-heritage-light/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative flex items-center justify-between mb-3">
              <span className="text-base font-black text-amber-600">Peak Check-in Time</span>
              <span className="text-sm font-bold text-amber-600 bg-amber-100/50 px-3 py-2 rounded-xl border border-amber-200/30">3:00 PM</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Most guests arrive between 2-4 PM</p>
          </div>

          {/* AI Recommendation */}
          <div className="p-6 bg-heritage-light/30 rounded-2xl border border-purple-200/30 relative overflow-hidden group/card hover:bg-heritage-light/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-base font-black text-purple-600">AI Recommendation</span>
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Consider adding more Deluxe Suites to meet demand and increase staff during 2-4 PM for smoother check-ins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartInsightsCard;
