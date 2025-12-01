import React, { useEffect, useState } from 'react';
import { RequisitionBackground } from './RequisitionBackground';
import { RequisitionStats } from './RequisitionStats';
import { RequisitionGrid } from './RequisitionGrid';
import RequisitionDetailsModal from './RequisitionDetailsModal';
import { subscribeToRequisitions, type RequisitionRecord } from '../../../backend/requisitions/requisitionsService';

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
  hasInvoice?: boolean;
}

const RequisitionsPage: React.FC = () => {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const mapRecordToRequisition = (record: RequisitionRecord): Requisition => {
    const rawStatus = (record.status || '').toString().toLowerCase();
    let status: Requisition['status'];
    switch (rawStatus) {
      case 'approved':
        status = 'approved';
        break;
      case 'rejected':
        status = 'rejected';
        break;
      case 'fulfilled':
        status = 'fulfilled';
        break;
      case 'pending':
      default:
        status = 'pending';
    }

    return {
      id: record.id,
      requestNumber: record.requestNumber,
      department: record.department,
      requestedBy: record.requestedBy,
      items: record.items ?? [],
      totalEstimatedCost: record.totalEstimatedCost,
      status,
      priority: (record.priority || 'low') as Requisition['priority'],
      requestDate: record.requestDate,
      requiredDate: record.requiredDate || '',
      justification: record.justification,
      approvedBy: record.approvedBy,
      approvedDate: record.approvedDate,
      notes: record.notes,
      hasInvoice: record.hasInvoice,
    };
  };

  useEffect(() => {
    const unsubscribe = subscribeToRequisitions(
      (records) => {
        const mapped = records.map(mapRecordToRequisition);
        setRequisitions(mapped);
      },
      (error) => {
        console.error('Error subscribing to requisitions:', error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

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

  const handleViewDetails = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Background */}
      <RequisitionBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

        {/* Stats */}
        <RequisitionStats stats={stats} formatCurrency={formatCurrency} />

        {/* Requisitions Grid */}
        <RequisitionGrid
          requisitions={requisitions}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          getPriorityBadge={getPriorityBadge}
          onViewDetails={handleViewDetails}
        />
      </div>
      <RequisitionDetailsModal
        requisition={selectedRequisition}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default RequisitionsPage;