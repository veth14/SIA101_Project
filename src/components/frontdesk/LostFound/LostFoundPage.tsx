import React, { useState } from 'react';
import LostFoundStatsCard from '../shared/FrontDeskStatsCard';

interface LostFoundItem {
  id: string;
  itemName: string;
  description: string;
  category: 'electronics' | 'clothing' | 'jewelry' | 'documents' | 'personal' | 'other';
  location: string;
  dateFound: string;
  foundBy: string;
  status: 'unclaimed' | 'claimed' | 'disposed';
  guestInfo?: {
    name: string;
    room: string;
    contact: string;
  };
  claimedDate?: string;
  claimedBy?: string;
}

const LostFoundPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unclaimed' | 'claimed' | 'disposed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | LostFoundItem['category']>('all');

  // Sample data
  const lostFoundItems: LostFoundItem[] = [
    {
      id: 'LF001',
      itemName: 'iPhone 14 Pro',
      description: 'Black iPhone with cracked screen protector',
      category: 'electronics',
      location: 'Room 205 - Bathroom',
      dateFound: '2024-09-20',
      foundBy: 'Maria Santos (Housekeeping)',
      status: 'unclaimed'
    },
    {
      id: 'LF002',
      itemName: 'Gold Wedding Ring',
      description: 'Gold band with small diamond',
      category: 'jewelry',
      location: 'Pool Area - Lounge Chair',
      dateFound: '2024-09-18',
      foundBy: 'Carlos Rivera (Pool Attendant)',
      status: 'claimed',
      guestInfo: {
        name: 'Sarah Johnson',
        room: '312',
        contact: '+63 917 123 4567'
      },
      claimedDate: '2024-09-19',
      claimedBy: 'Sarah Johnson'
    },
    {
      id: 'LF003',
      itemName: 'Blue Denim Jacket',
      description: 'Medium size, Levi\'s brand',
      category: 'clothing',
      location: 'Restaurant - Table 8',
      dateFound: '2024-09-15',
      foundBy: 'Ana Cruz (Server)',
      status: 'unclaimed'
    },
    {
      id: 'LF004',
      itemName: 'Passport',
      description: 'US Passport - John Smith',
      category: 'documents',
      location: 'Lobby - Reception Desk',
      dateFound: '2024-09-22',
      foundBy: 'Reception Staff',
      status: 'claimed',
      claimedDate: '2024-09-22',
      claimedBy: 'John Smith'
    },
    {
      id: 'LF005',
      itemName: 'Sunglasses',
      description: 'Ray-Ban Aviators with case',
      category: 'personal',
      location: 'Beach Area',
      dateFound: '2024-09-10',
      foundBy: 'Beach Staff',
      status: 'disposed'
    }
  ];

  const filteredItems = lostFoundItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusCounts = {
    all: lostFoundItems.length,
    unclaimed: lostFoundItems.filter(item => item.status === 'unclaimed').length,
    claimed: lostFoundItems.filter(item => item.status === 'claimed').length,
    disposed: lostFoundItems.filter(item => item.status === 'disposed').length,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      unclaimed: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Unclaimed' },
      claimed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Claimed' },
      disposed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Disposed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unclaimed;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      electronics: '📱',
      clothing: '👕',
      jewelry: '💍',
      documents: '📄',
      personal: '🕶️',
      other: '📦'
    };
    return icons[category as keyof typeof icons] || '📦';
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-green-500/5 rounded-full animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-green-500/10 rounded-full animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
          
          <div className="relative p-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                      <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                      Lost & Found
                    </h1>
                    <p className="text-xl text-gray-700 font-medium tracking-wide">
                      Manage lost and found items
                    </p>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-emerald-700">System operational</span>
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

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <LostFoundStatsCard
            title="Total Items"
            value={statusCounts.all}
            icon="📦"
            color="blue"
            trend={{ value: 8, isPositive: true }}
          />
          <LostFoundStatsCard
            title="Unclaimed Items"
            value={statusCounts.unclaimed}
            icon="🔍"
            color="yellow"
            trend={{ value: 2, isPositive: false }}
          />
          <LostFoundStatsCard
            title="Claimed Items"
            value={statusCounts.claimed}
            icon="✅"
            color="green"
            trend={{ value: 15, isPositive: true }}
          />
          <LostFoundStatsCard
            title="Disposed Items"
            value={statusCounts.disposed}
            icon="🗑️"
            color="red"
            trend={{ value: 5, isPositive: false }}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by item name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unclaimed">Unclaimed</option>
                <option value="claimed">Claimed</option>
                <option value="disposed">Disposed</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="jewelry">Jewelry</option>
                <option value="documents">Documents</option>
                <option value="personal">Personal Items</option>
                <option value="other">Other</option>
              </select>
              
              <button className="px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium">
                Add New Item
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{item.itemName}</h3>
                      <p className="text-sm text-gray-500">ID: {item.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
                    </svg>
                    Found by: {item.foundBy}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
                    </svg>
                    {new Date(item.dateFound).toLocaleDateString()}
                  </div>
                  
                  {item.status === 'claimed' && item.guestInfo && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Claimed by: {item.claimedBy}</p>
                      <p className="text-xs text-green-600">Date: {item.claimedDate && new Date(item.claimedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-heritage-green text-white text-sm rounded-lg hover:bg-heritage-green/90 transition-colors">
                    View Details
                  </button>
                  {item.status === 'unclaimed' && (
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Mark Claimed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFoundPage;
