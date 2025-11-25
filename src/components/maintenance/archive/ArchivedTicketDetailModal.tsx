import React from 'react';
import { createPortal } from 'react-dom';

interface ArchivedTicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  data: Record<string, any> | null;
}

const ArchivedTicketDetailModal: React.FC<ArchivedTicketDetailModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  data,
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Extract key fields from data
  const ticketNumber = data?.ticketNumber || data?.ticketId || ticketId;
  const taskTitle = data?.taskTitle || data?.title || data?.task || '';
  const category = data?.category || data?.type || '';
  const priority = data?.priority || '';
  const roomNumber = data?.roomNumber || data?.room || '';
  const assignedTo = data?.assignedTo || data?.assignee || data?.assigned || '';
  const createdBy = data?.createdBy || data?.creatorEmail || data?.creator || '';
  const description = data?.description || data?.taskDescription || '';
  
  // Timeline data
  const createdAt = data?.createdAt || data?.created || data?.dateCreated || '';
  const completedAt = data?.completedAt || data?.completed || data?.dateCompleted || '';
  const archivedAt = data?.archivedAt || data?.archived || data?.dateArchived || '';
  
  // Status
  const status = data?.status || 'Completed';

  // Helper to format dates
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';
    try {
      // If it's already a formatted string, return it
      if (typeof dateValue === 'string') return dateValue;
      // If it's a Date object, format it
      if (dateValue instanceof Date) {
        return dateValue.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      return String(dateValue);
    } catch (e) {
      return String(dateValue);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideInUp">
        {/* Header with icon and title */}
        <div className="bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-heritage-green/10 rounded-full p-3">
              <svg className="w-6 h-6 text-heritage-green" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ticket {ticketNumber}</h2>
              <p className="text-sm text-gray-600">Task: {taskTitle || 'Maintenance Request'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Status Badge */}
        <div className="px-6 py-3 bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-green-800">{status}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Ticket Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category:</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{category || '-'}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priority:</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                      priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      priority?.toLowerCase() === 'low' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {priority || '-'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number:</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{roomNumber || '-'}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-900 font-medium">{assignedTo || '-'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created By:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <p className="text-sm text-gray-900 break-all">{createdBy || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{description || 'No description provided.'}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Timeline and Additional Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              
              <div className="space-y-4">
                {/* Created */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Created</p>
                    <p className="text-xs text-gray-600 mt-0.5">{formatDate(createdAt) || '-'}</p>
                  </div>
                </div>

                {/* Completed */}
                {completedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-blue-100 rounded-full p-2">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Completed</p>
                      <p className="text-xs text-gray-600 mt-0.5">{formatDate(completedAt)}</p>
                    </div>
                  </div>
                )}

                {/* Archived */}
                {archivedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-gray-100 rounded-full p-2">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Archived</p>
                      <p className="text-xs text-gray-600 mt-0.5">{formatDate(archivedAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-500">Ticket ID:</span>
                    <span className="text-sm font-semibold text-gray-900">{ticketNumber}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-500">Task:</span>
                    <span className="text-sm text-gray-900 text-right max-w-[60%] truncate">{taskTitle || '-'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-500">Created by:</span>
                    <span className="text-sm text-gray-900 text-right max-w-[60%] truncate">{createdBy || '-'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-500">Created At:</span>
                    <span className="text-sm text-gray-900 text-right">{formatDate(createdAt) || '-'}</span>
                  </div>
                  
                  {completedAt && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-xs font-medium text-gray-500">Completed At:</span>
                      <span className="text-sm text-gray-900 text-right">{formatDate(completedAt)}</span>
                    </div>
                  )}
                  
                  {archivedAt && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs font-medium text-gray-500">Archived At:</span>
                      <span className="text-sm text-gray-900 text-right">{formatDate(archivedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ArchivedTicketDetailModal;
