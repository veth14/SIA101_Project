import React, { useState } from 'react';

interface FeedbackItem {
  id: string;
  guestName: string;
  roomNumber: string;
  rating: number;
  category: 'service' | 'cleanliness' | 'amenities' | 'food' | 'general';
  feedback: string;
  date: string;
  status: 'new' | 'reviewed' | 'responded';
  response?: string;
}

export const GuestFeedback: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const feedbackData: FeedbackItem[] = [
    {
      id: '1',
      guestName: 'Maria Santos',
      roomNumber: '201',
      rating: 5,
      category: 'service',
      feedback: 'Exceptional service from the front desk staff. Very accommodating and professional.',
      date: '2024-01-15',
      status: 'responded',
      response: 'Thank you for your kind words! We\'ll share this with our team.'
    },
    {
      id: '2',
      guestName: 'John Rodriguez',
      roomNumber: '305',
      rating: 4,
      category: 'cleanliness',
      feedback: 'Room was very clean and well-maintained. Minor issue with bathroom lighting.',
      date: '2024-01-14',
      status: 'reviewed'
    },
    {
      id: '3',
      guestName: 'Lisa Chen',
      roomNumber: '102',
      rating: 3,
      category: 'food',
      feedback: 'Breakfast selection could be improved. Limited vegetarian options.',
      date: '2024-01-13',
      status: 'new'
    },
    {
      id: '4',
      guestName: 'Carlos Mendoza',
      roomNumber: '408',
      rating: 5,
      category: 'amenities',
      feedback: 'Love the spa facilities! Pool area is beautiful and well-maintained.',
      date: '2024-01-12',
      status: 'responded',
      response: 'We\'re delighted you enjoyed our amenities! Thank you for staying with us.'
    },
    {
      id: '5',
      guestName: 'Anna Williams',
      roomNumber: '156',
      rating: 2,
      category: 'service',
      feedback: 'Check-in process took too long. Staff seemed overwhelmed during peak hours.',
      date: '2024-01-11',
      status: 'new'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      service: 'bg-blue-100 text-blue-800 border-blue-200',
      cleanliness: 'bg-green-100 text-green-800 border-green-200',
      amenities: 'bg-purple-100 text-purple-800 border-purple-200',
      food: 'bg-orange-100 text-orange-800 border-orange-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-red-100 text-red-800 border-red-200',
      reviewed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      responded: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const filteredFeedback = feedbackData.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search feedback, guest names, or rooms..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white w-80"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Categories</option>
            <option value="service">Service</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="amenities">Amenities</option>
            <option value="food">Food & Dining</option>
            <option value="general">General</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Feedback</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFeedback.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{item.guestName}</div>
                      <div className="text-sm text-gray-500">Room {item.roomNumber}</div>
                      <div className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating)}
                      <span className="ml-2 text-sm font-medium text-gray-600">{item.rating}/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-700 truncate">{item.feedback}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-heritage-green hover:text-heritage-green/80 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {item.status === 'new' && (
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredFeedback.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No feedback found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};
