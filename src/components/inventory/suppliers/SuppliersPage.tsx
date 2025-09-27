import React, { useState } from 'react';
import SuppliersHeader from './SuppliersHeader';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'suspended';
  paymentTerms: string;
  deliveryTime: string;
  notes?: string;
}

const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sample suppliers data
  const suppliers: Supplier[] = [
    {
      id: 'SUP001',
      name: 'Hotel Linens Co.',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@hotellinens.com',
      phone: '+63 917 123 4567',
      address: '123 Textile Street, Makati City',
      category: 'Linens & Textiles',
      rating: 4.8,
      totalOrders: 45,
      totalValue: 2250000,
      lastOrderDate: '2024-09-18',
      status: 'active',
      paymentTerms: 'Net 30',
      deliveryTime: '3-5 business days',
      notes: 'Reliable supplier with excellent quality products'
    },
    {
      id: 'SUP002',
      name: 'Premium Coffee Co.',
      contactPerson: 'Miguel Santos',
      email: 'miguel@premiumcoffee.ph',
      phone: '+63 917 234 5678',
      address: '456 Coffee Avenue, Quezon City',
      category: 'Food & Beverage',
      rating: 4.9,
      totalOrders: 32,
      totalValue: 850000,
      lastOrderDate: '2024-09-20',
      status: 'active',
      paymentTerms: 'Net 15',
      deliveryTime: '1-2 business days',
      notes: 'Premium quality coffee beans and tea supplies'
    },
    {
      id: 'SUP003',
      name: 'Cleaning Supplies Inc.',
      contactPerson: 'Maria Cruz',
      email: 'maria@cleaningsupplies.com',
      phone: '+63 917 345 6789',
      address: '789 Industrial Road, Pasig City',
      category: 'Cleaning & Maintenance',
      rating: 4.5,
      totalOrders: 78,
      totalValue: 1450000,
      lastOrderDate: '2024-09-19',
      status: 'active',
      paymentTerms: 'Net 30',
      deliveryTime: '2-4 business days',
      notes: 'Wide range of cleaning products and equipment'
    },
    {
      id: 'SUP004',
      name: 'Hotel Amenities Ltd.',
      contactPerson: 'John Rivera',
      email: 'john@hotelamenities.ph',
      phone: '+63 917 456 7890',
      address: '321 Business Park, Taguig City',
      category: 'Guest Amenities',
      rating: 4.6,
      totalOrders: 28,
      totalValue: 680000,
      lastOrderDate: '2024-09-15',
      status: 'active',
      paymentTerms: 'Net 30',
      deliveryTime: '3-7 business days',
      notes: 'Specializes in bathroom amenities and guest supplies'
    },
    {
      id: 'SUP005',
      name: 'Maintenance Tools Corp.',
      contactPerson: 'Roberto Garcia',
      email: 'roberto@maintenancetools.com',
      phone: '+63 917 567 8901',
      address: '654 Hardware Street, Manila',
      category: 'Tools & Equipment',
      rating: 4.2,
      totalOrders: 15,
      totalValue: 320000,
      lastOrderDate: '2024-08-25',
      status: 'inactive',
      paymentTerms: 'Net 45',
      deliveryTime: '5-10 business days',
      notes: 'Good prices but slow delivery times'
    },
    {
      id: 'SUP006',
      name: 'Fresh Produce Market',
      contactPerson: 'Ana Fernandez',
      email: 'ana@freshproduce.ph',
      phone: '+63 917 678 9012',
      address: '987 Market Road, Las Piñas',
      category: 'Food & Beverage',
      rating: 3.8,
      totalOrders: 52,
      totalValue: 1120000,
      lastOrderDate: '2024-09-10',
      status: 'suspended',
      paymentTerms: 'COD',
      deliveryTime: '1-2 business days',
      notes: 'Quality issues with recent deliveries - under review'
    }
  ];

  const categories = ['all', ...Array.from(new Set(suppliers.map(supplier => supplier.category)))];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" viewBox="0 0 20 20">
          <path fill="currentColor" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }
    
    return stars;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStats = () => {
    const stats = {
      active: suppliers.filter(sup => sup.status === 'active').length,
      inactive: suppliers.filter(sup => sup.status === 'inactive').length,
      suspended: suppliers.filter(sup => sup.status === 'suspended').length,
      total: suppliers.length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
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
        <SuppliersHeader />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-heritage-green">{formatCurrency(suppliers.reduce((sum, sup) => sum + sup.totalValue, 0))}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
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
                  placeholder="Search by supplier name, contact person, email, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              
              <button className="px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium">
                Add Supplier
              </button>
            </div>
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{supplier.name}</h3>
                    <p className="text-sm text-gray-500">ID: {supplier.id}</p>
                  </div>
                  {getStatusBadge(supplier.status)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {supplier.contactPerson}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {supplier.email}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {supplier.phone}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {supplier.category}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {getRatingStars(supplier.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({supplier.rating})</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">{supplier.totalOrders}</p>
                      <p className="text-xs text-blue-600">Total Orders</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{formatCurrency(supplier.totalValue)}</p>
                      <p className="text-xs text-green-600">Total Value</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Payment Terms:</span>
                        <p className="font-medium">{supplier.paymentTerms}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Delivery Time:</span>
                        <p className="font-medium">{supplier.deliveryTime}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Last Order:</span>
                        <p className="font-medium">{new Date(supplier.lastOrderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {supplier.notes && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-gray-700">
                      <strong>Notes:</strong> {supplier.notes}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-heritage-green text-white text-sm rounded-lg hover:bg-heritage-green/90 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                    Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersPage;
