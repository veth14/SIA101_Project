import React, { useState } from 'react';
import DepartmentsHeader from './DepartmentsHeader';

interface Department {
  id: string;
  name: string;
  manager: string;
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  location: string;
  budget: number;
  budgetUsed: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

const DepartmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sample departments data
  const departments: Department[] = [
    {
      id: 'DEPT001',
      name: 'Housekeeping',
      manager: 'Maria Santos',
      totalItems: 85,
      totalValue: 125000,
      lowStockItems: 5,
      location: 'Floor 1 - Storage Room A',
      budget: 200000,
      budgetUsed: 125000,
      status: 'active',
      lastUpdated: '2024-09-20'
    },
    {
      id: 'DEPT002',
      name: 'Food & Beverage',
      manager: 'Carlos Rivera',
      totalItems: 120,
      totalValue: 350000,
      lowStockItems: 8,
      location: 'Kitchen Storage',
      budget: 500000,
      budgetUsed: 350000,
      status: 'active',
      lastUpdated: '2024-09-19'
    },
    {
      id: 'DEPT003',
      name: 'Maintenance',
      manager: 'Juan Dela Cruz',
      totalItems: 45,
      totalValue: 85000,
      lowStockItems: 3,
      location: 'Basement - Tool Room',
      budget: 150000,
      budgetUsed: 85000,
      status: 'active',
      lastUpdated: '2024-09-18'
    },
    {
      id: 'DEPT004',
      name: 'Front Office',
      manager: 'Ana Cruz',
      totalItems: 25,
      totalValue: 45000,
      lowStockItems: 2,
      location: 'Reception Storage',
      budget: 75000,
      budgetUsed: 45000,
      status: 'active',
      lastUpdated: '2024-09-20'
    },
    {
      id: 'DEPT005',
      name: 'Security',
      manager: 'Roberto Garcia',
      totalItems: 15,
      totalValue: 25000,
      lowStockItems: 1,
      location: 'Security Office',
      budget: 50000,
      budgetUsed: 25000,
      status: 'active',
      lastUpdated: '2024-09-17'
    },
    {
      id: 'DEPT006',
      name: 'Laundry',
      manager: 'Lisa Fernandez',
      totalItems: 30,
      totalValue: 65000,
      lowStockItems: 4,
      location: 'Basement - Laundry Room',
      budget: 100000,
      budgetUsed: 65000,
      status: 'inactive',
      lastUpdated: '2024-09-15'
    }
  ];

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetPercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getBudgetColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
        <DepartmentsHeader />

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
                  placeholder="Search by department name, manager, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <button className="px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium">
                Add Department
              </button>
            </div>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{dept.name}</h3>
                    <p className="text-sm text-gray-500">ID: {dept.id}</p>
                  </div>
                  {getStatusBadge(dept.status)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Manager: {dept.manager}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {dept.location}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{dept.totalItems}</p>
                      <p className="text-xs text-blue-600">Total Items</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{dept.lowStockItems}</p>
                      <p className="text-xs text-yellow-600">Low Stock</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Budget Usage</span>
                      <span>{getBudgetPercentage(dept.budgetUsed, dept.budget)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getBudgetColor(getBudgetPercentage(dept.budgetUsed, dept.budget))}`}
                        style={{ width: `${getBudgetPercentage(dept.budgetUsed, dept.budget)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatCurrency(dept.budgetUsed)}</span>
                      <span>{formatCurrency(dept.budget)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Total Value: {formatCurrency(dept.totalValue)}</p>
                    <p className="text-xs text-gray-500">Last updated: {new Date(dept.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-heritage-green text-white text-sm rounded-lg hover:bg-heritage-green/90 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
