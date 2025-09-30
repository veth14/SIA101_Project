import React from 'react';
import RequisitionsHeader from './RequisitionsHeader';
import { RequisitionBackground } from './RequisitionBackground';
import { RequisitionStats } from './RequisitionStats';
import { RequisitionGrid } from './RequisitionGrid';

interface RequisitionItem {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  reason: string;
}

interface Requisition {
  id: string;
  requestNumber: string;
  department: string;
  requestedBy: string;
  items: RequisitionItem[];
  totalEstimatedCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: string;
  requiredDate: string;
  justification: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

const RequisitionsPage: React.FC = () => {

  // Sample requisitions data
  const requisitions: Requisition[] = [
    {
      id: 'REQ001',
      requestNumber: 'REQ-2024-001',
      department: 'Housekeeping',
      requestedBy: 'Maria Santos',
      items: [
        { name: 'Vacuum Cleaner Bags', quantity: 50, unit: 'pieces', estimatedCost: 2500, reason: 'Current stock depleted' },
        { name: 'Floor Cleaner', quantity: 10, unit: 'bottles', estimatedCost: 1200, reason: 'Monthly restocking' }
      ],
      totalEstimatedCost: 3700,
      status: 'pending',
      priority: 'high',
      requestDate: '2024-09-20',
      requiredDate: '2024-09-25',
      justification: 'Essential cleaning supplies needed for daily operations. Current stock is running low and may affect service quality.'
    },
    {
      id: 'REQ002',
      requestNumber: 'REQ-2024-002',
      department: 'Food & Beverage',
      requestedBy: 'Carlos Rivera',
      items: [
        { name: 'Coffee Beans', quantity: 20, unit: 'kg', estimatedCost: 8000, reason: 'Premium blend for restaurant' },
        { name: 'Sugar Packets', quantity: 500, unit: 'pieces', estimatedCost: 1500, reason: 'Guest room amenities' }
      ],
      totalEstimatedCost: 9500,
      status: 'approved',
      priority: 'medium',
      requestDate: '2024-09-18',
      requiredDate: '2024-09-28',
      justification: 'Quality ingredients needed to maintain restaurant standards and guest satisfaction.',
      approvedBy: 'Manager',
      approvedDate: '2024-09-19'
    },
    {
      id: 'REQ003',
      requestNumber: 'REQ-2024-003',
      department: 'Maintenance',
      requestedBy: 'Robert Garcia',
      items: [
        { name: 'LED Light Bulbs', quantity: 30, unit: 'pieces', estimatedCost: 4500, reason: 'Replace burnt bulbs' },
        { name: 'Electrical Wire', quantity: 100, unit: 'meters', estimatedCost: 2000, reason: 'Repair work' }
      ],
      totalEstimatedCost: 6500,
      status: 'fulfilled',
      priority: 'urgent',
      requestDate: '2024-09-15',
      requiredDate: '2024-09-20',
      justification: 'Critical maintenance items needed for guest room repairs and safety compliance.',
      approvedBy: 'Supervisor',
      approvedDate: '2024-09-16'
    },
    {
      id: 'REQ004',
      requestNumber: 'REQ-2024-004',
      department: 'Front Office',
      requestedBy: 'Anna Reyes',
      items: [
        { name: 'Printer Paper', quantity: 20, unit: 'reams', estimatedCost: 1000, reason: 'Office supplies' },
        { name: 'Ink Cartridges', quantity: 5, unit: 'pieces', estimatedCost: 2500, reason: 'Printer maintenance' }
      ],
      totalEstimatedCost: 3500,
      status: 'rejected',
      priority: 'low',
      requestDate: '2024-09-22',
      requiredDate: '2024-10-01',
      justification: 'Office supplies for daily operations and guest service documentation.',
      notes: 'Budget constraints - defer to next month'
    }
  ];


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'approved': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      'fulfilled': { bg: 'bg-green-100', text: 'text-green-800', label: 'Fulfilled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low' },
      'medium': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Medium' },
      'high': { bg: 'bg-red-100', text: 'text-red-800', label: 'High' },
      'urgent': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Urgent' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['low'];
    
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

  const stats = {
    totalRequisitions: requisitions.length,
    pendingRequisitions: requisitions.filter(req => req.status === 'pending').length,
    approvedRequisitions: requisitions.filter(req => req.status === 'approved').length,
    fulfilledRequisitions: requisitions.filter(req => req.status === 'fulfilled').length,
    totalValue: requisitions.reduce((sum, req) => sum + req.totalEstimatedCost, 0)
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Background */}
      <RequisitionBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <RequisitionsHeader />

        {/* Stats */}
        <RequisitionStats stats={stats} formatCurrency={formatCurrency} />

        {/* Requisitions Grid */}
        <RequisitionGrid
          requisitions={requisitions}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          getPriorityBadge={getPriorityBadge}
        />
      </div>
    </div>
  );
};

export default RequisitionsPage;
