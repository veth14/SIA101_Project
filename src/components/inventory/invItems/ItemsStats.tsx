import React from 'react';
import type { InventoryItem } from '../../../data/sampleInventory';

interface ItemsStatsProps {
  items: InventoryItem[];
  formatCurrency: (amount: number) => string;
}

export const ItemsStats: React.FC<ItemsStatsProps> = ({ items, formatCurrency }) => {
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0).length;
  const outOfStockItems = items.filter(item => item.currentStock === 0).length;
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  const stats = [
    {
      title: 'Total Inventory Items',
      value: totalItems.toString(),
      change: '+23% from last month',
      changeType: 'positive' as const,
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems.toString(),
      change: '5% from last month',
      changeType: 'positive' as const,
      iconBg: 'bg-yellow-100',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      title: 'Out of Stock Items',
      value: outOfStockItems.toString(),
      change: '8% from last month',
      changeType: 'negative' as const,
      iconBg: 'bg-red-100',
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      )
    },
    {
      title: 'Total Inventory Value',
      value: formatCurrency(totalValue),
      change: '23% from last month',
      changeType: 'positive' as const,
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden"
        >
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          
          {/* Floating Decorative Elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full"></div>
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">{stat.title}</p>
              </div>
              <p className="text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500">{stat.value}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                stat.changeType === 'positive' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : stat.changeType === 'negative' 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                {stat.change}
              </div>
            </div>
            <div className="relative">
              <div className={`w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                {stat.icon}
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
