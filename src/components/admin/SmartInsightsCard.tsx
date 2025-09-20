import React from 'react';

const SmartInsightsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Smart Insights</h3>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Guest Satisfaction */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-900">Guest Satisfaction</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm font-bold text-blue-600 ml-1">4.8/5</span>
            </div>
          </div>
          <p className="text-xs text-blue-700">Excellent ratings from recent guests</p>
        </div>

        {/* Most Popular Room */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-green-900">Most Popular Room</span>
            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Deluxe Suite</span>
          </div>
          <p className="text-xs text-green-700">65% of bookings prefer this room type</p>
        </div>

        {/* Peak Check-in Time */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-orange-900">Peak Check-in Time</span>
            <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">3:00 PM</span>
          </div>
          <p className="text-xs text-orange-700">Most guests arrive between 2-4 PM</p>
        </div>

        {/* AI Recommendation */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200/50">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-purple-900">Recommendation</span>
          </div>
          <p className="text-xs text-purple-700 leading-relaxed">
            Consider adding more Deluxe Suites to meet demand and increase staff during 2-4 PM for smoother check-ins.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartInsightsCard;
