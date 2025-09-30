import React from 'react';
import SuppliersHeader from './SuppliersHeader';
import { SupplierBackground } from './SupplierBackground';
import { SupplierStats } from './SupplierStats';
import { SupplierGrid } from './SupplierGrid';

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
      lastOrderDate: '2024-09-25',
      status: 'active',
      paymentTerms: 'Net 30',
      deliveryTime: '3-5 days'
    },
    {
      id: 'SUP002',
      name: 'Premium Coffee Co.',
      contactPerson: 'Miguel Santos',
      email: 'miguel@premiumcoffee.ph',
      phone: '+63 917 234 5678',
      address: '456 Coffee Street, Quezon City',
      category: 'Food & Beverage',
      rating: 4.6,
      totalOrders: 32,
      totalValue: 890000,
      lastOrderDate: '2024-09-28',
      status: 'active',
      paymentTerms: 'Net 15',
      deliveryTime: '1-2 days'
    },
    {
      id: 'SUP003',
      name: 'Cleaning Supplies Inc.',
      contactPerson: 'Anna Cruz',
      email: 'anna@cleaningsupplies.com',
      phone: '+63 917 345 6789',
      address: '789 Industrial Ave, Pasig City',
      category: 'Cleaning & Maintenance',
      rating: 4.2,
      totalOrders: 28,
      totalValue: 650000,
      lastOrderDate: '2024-09-20',
      status: 'active',
      paymentTerms: 'Net 45',
      deliveryTime: '2-4 days'
    },
    {
      id: 'SUP004',
      name: 'Hotel Amenities Ltd.',
      contactPerson: 'Robert Garcia',
      email: 'robert@hotelamenities.ph',
      phone: '+63 917 456 7890',
      address: '321 Commerce Plaza, Taguig City',
      category: 'Guest Amenities',
      rating: 4.5,
      totalOrders: 22,
      totalValue: 480000,
      lastOrderDate: '2024-09-15',
      status: 'active',
      paymentTerms: 'Net 30',
      deliveryTime: '5-7 days'
    },
    {
      id: 'SUP005',
      name: 'Electrical Supplies Ltd.',
      contactPerson: 'Lisa Mendoza',
      email: 'lisa@electricalsupplies.com',
      phone: '+63 917 567 8901',
      address: '654 Tech Hub, Alabang',
      category: 'Electrical & Technical',
      rating: 3.9,
      totalOrders: 15,
      totalValue: 320000,
      lastOrderDate: '2024-08-30',
      status: 'inactive',
      paymentTerms: 'Net 60',
      deliveryTime: '7-10 days'
    }
  ];


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      'inactive': { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' },
      'suspended': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Suspended' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['active'];
    
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
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
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
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = {
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter(s => s.status === 'active').length,
    inactiveSuppliers: suppliers.filter(s => s.status === 'inactive').length,
    suspendedSuppliers: suppliers.filter(s => s.status === 'suspended').length,
    totalValue: suppliers.reduce((sum, s) => sum + s.totalValue, 0)
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Background */}
      <SupplierBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <SuppliersHeader />

        {/* Stats */}
        <SupplierStats stats={stats} formatCurrency={formatCurrency} />

        {/* Suppliers Grid */}
        <SupplierGrid
          suppliers={suppliers}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          getRatingStars={getRatingStars}
        />
      </div>
    </div>
  );
};

export default SuppliersPage;
