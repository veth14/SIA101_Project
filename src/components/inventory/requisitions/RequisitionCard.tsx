import React from 'react';

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

interface RequisitionCardProps {
  requisition: Requisition;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  onViewDetails?: (requisition: Requisition) => void;
}

export const RequisitionCard: React.FC<RequisitionCardProps> = ({
  requisition,
  formatCurrency,
  getStatusBadge,
  getPriorityBadge,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{requisition.requestNumber}</h3>
          <p className="text-sm text-gray-600">{requisition.department} - {requisition.requestedBy}</p>
        </div>
        <div className="flex flex-col space-y-1">
          {getStatusBadge(requisition.status)}
          {getPriorityBadge(requisition.priority)}
        </div>
      </div>
      
      {/* Items List */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Items ({requisition.items.length})</p>
        <div className="space-y-1">
          {requisition.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} (×{item.quantity})</span>
              <span>{formatCurrency(item.estimatedCost)}</span>
            </div>
          ))}
          {requisition.items.length > 2 && (
            <p className="text-sm text-gray-500">+{requisition.items.length - 2} more items</p>
          )}
        </div>
      </div>
      
      {/* Total Cost */}
      <div className="flex justify-between items-center py-3 border-t border-gray-200 mb-4">
        <span className="text-sm font-medium text-gray-700">Total Estimated</span>
        <span className="text-lg font-bold text-heritage-green">{formatCurrency(requisition.totalEstimatedCost)}</span>
      </div>
      
      {/* Dates */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>Requested: {new Date(requisition.requestDate).toLocaleDateString()}</span>
        <span>Required: {new Date(requisition.requiredDate).toLocaleDateString()}</span>
      </div>
      
      {/* Approval Information */}
      {requisition.status === 'approved' || requisition.status === 'fulfilled' ? (
        requisition.approvedBy ? (
          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400 mb-4">
            <p className="text-sm text-green-700 font-medium">Approved by: {requisition.approvedBy}</p>
            {requisition.approvedDate && (
              <p className="text-xs text-green-600 mt-1">
                Approved on: {new Date(requisition.approvedDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 mb-4">
            <p className="text-sm text-gray-500 italic">Approval information not available</p>
          </div>
        )
      ) : requisition.status === 'rejected' ? (
        <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400 mb-4">
          <p className="text-sm text-red-700 font-medium">Request rejected</p>
          <p className="text-xs text-red-600 mt-1">Review required for resubmission</p>
        </div>
      ) : (
        <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400 mb-4">
          <p className="text-sm text-yellow-700 font-medium">Pending approval</p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting manager review</p>
        </div>
      )}
      
      {/* Notes Section */}
      {requisition.notes ? (
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 min-h-[60px] flex flex-col justify-center mb-4">
          <p className="text-xs text-blue-600 font-medium mb-1">Notes:</p>
          <p className="text-sm text-blue-700 italic">"{requisition.notes}"</p>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 min-h-[60px] flex items-center mb-4">
          <p className="text-sm text-gray-400 italic">No additional notes provided</p>
        </div>
      )}
      
      {/* Justification */}
      <div className="text-sm text-gray-600 mb-4 flex-grow">
        <p className="text-xs text-gray-500 font-medium mb-1">Justification:</p>
        <p className="line-clamp-2">{requisition.justification}</p>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-auto pt-4 flex gap-2">
        <button
          className="flex-1 px-4 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors text-sm font-medium"
          onClick={() => onViewDetails?.(requisition)}
        >
          View Details
        </button>
        {requisition.status === 'approved' && (
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            Mark Received
          </button>
        )}
      </div>
    </div>
  );
};