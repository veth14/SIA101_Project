import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import usePatchInvDepartment from '../../../api/patchInvDepartment';

interface MaintenanceRequest {
  id: string;
  department: string;
  itemService: string;
  requestedBy: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
}

interface RequestDetailsModalProps {
  request: MaintenanceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { patchInvMaintenanceRequest, loadingForPatchInvMaintenanceRequest } = usePatchInvDepartment();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !request) return null;

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this maintenance request?')) {
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Approving request with ID:", request.id);
      const response = await patchInvMaintenanceRequest(request.id, {
        status: 'Approved',
        approvedBy: 'Manager Name', // TODO: Replace with actual logged-in user
        approvedDate: new Date().toISOString(),
      });

      console.log("Approve response:", response);

      if (response.success) {
        alert('Maintenance request approved successfully!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(response.message || 'Failed to approve maintenance request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('An error occurred while approving the maintenance request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this maintenance request?')) {
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Rejecting request with ID:", request.id);
      const response = await patchInvMaintenanceRequest(request.id, {
        status: 'Rejected',
        rejectedBy: 'Manager Name', // TODO: Replace with actual logged-in user
        rejectedDate: new Date().toISOString(),
      });

      console.log("Reject response:", response);

      if (response.success) {
        alert('Maintenance request rejected successfully!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(response.message || 'Failed to reject maintenance request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('An error occurred while rejecting the maintenance request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!confirm('Are you sure you want to mark this request as completed?')) {
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Completing request with ID:", request.id);
      const response = await patchInvMaintenanceRequest(request.id, {
        status: 'Completed',
        completedBy: 'Manager Name', // TODO: Replace with actual logged-in user
        completedDate: new Date().toISOString(),
      });

      console.log("Complete response:", response);

      if (response.success) {
        alert('Maintenance request marked as completed!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(response.message || 'Failed to update maintenance request');
      }
    } catch (error) {
      console.error('Error completing request:', error);
      alert('An error occurred while updating the maintenance request');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'Approved':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'Rejected':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'Completed':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const statusColors = getStatusColor(request.status);

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-emerald-50/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                <p className="text-sm text-gray-600 font-mono">{request.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loadingForPatchInvMaintenanceRequest || isProcessing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Request Status</h3>
              <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                <div className="w-2 h-2 rounded-full mr-2 bg-current opacity-60"></div>
                {request.status}
              </span>
            </div>

            {/* Request Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Request Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Request ID</label>
                  <input
                    type="text"
                    value={request.id}
                    disabled
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <div className="flex items-center w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    {request.department}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Requested By</label>
                  <div className="flex items-center w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-emerald-700">
                        {request.requestedBy.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {request.requestedBy}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Request Date</label>
                  <input
                    type="text"
                    value={new Date(request.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                    disabled
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Service Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Item/Service Requested</label>
                <div className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 font-medium">
                  {request.itemService}
                </div>
              </div>
            </div>

            {/* Timeline/History Section */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Request Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Request Created</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(request.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {request.status !== 'Pending' && (
                  <div className="flex items-start">
                    <div className={`w-8 h-8 ${statusColors.bg} rounded-full flex items-center justify-center mr-3 mt-0.5`}>
                      <svg className={`w-4 h-4 ${statusColors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Status: {request.status}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Updated recently</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={loadingForPatchInvMaintenanceRequest || isProcessing}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CLOSE
            </button>
            
            {request.status === 'Pending' && (
              <>
                <button 
                  onClick={handleApprove}
                  disabled={loadingForPatchInvMaintenanceRequest || isProcessing}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {(loadingForPatchInvMaintenanceRequest || isProcessing) ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'APPROVE'
                  )}
                </button>
                <button 
                  onClick={handleReject}
                  disabled={loadingForPatchInvMaintenanceRequest || isProcessing}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {(loadingForPatchInvMaintenanceRequest || isProcessing) ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'REJECT'
                  )}
                </button>
              </>
            )}
            
            {request.status === 'Approved' && (
              <button 
                onClick={handleMarkCompleted}
                disabled={loadingForPatchInvMaintenanceRequest || isProcessing}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(loadingForPatchInvMaintenanceRequest || isProcessing) ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'MARK AS COMPLETED'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
