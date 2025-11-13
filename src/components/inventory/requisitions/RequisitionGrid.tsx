import React, { useState, useEffect } from "react";
import { RequisitionCard } from "./RequisitionCard";

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
  status: "pending" | "approved" | "rejected" | "fulfilled";
  priority: "low" | "medium" | "high" | "urgent";
  requestDate: string;
  requiredDate: string;
  justification: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

interface RequisitionGridProps {
  requisitions: Requisition[];
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  setRequisitions: React.Dispatch<React.SetStateAction<Requisition[]>>;
}

export const RequisitionGrid: React.FC<RequisitionGridProps> = ({
  requisitions,
  formatCurrency,
  getStatusBadge,
  getPriorityBadge,
  setRequisitions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Reset to page 1 when requisitions change
  useEffect(() => {
    setCurrentPage(1);
  }, [requisitions]);

  // Show empty state if no requisitions
  if (!requisitions || requisitions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No Requisitions Found
          </h3>
          <p className="text-gray-600">
            There are no requisitions to display at this time.
          </p>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(requisitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequisitions = requisitions.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className="overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
      {/* Header */}
      <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 shadow-xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Requisitions</h3>
              <p className="text-sm font-medium text-gray-500">
                Showing {startIndex + 1}-
                {Math.min(endIndex, requisitions.length)} of{" "}
                {requisitions.length} requisitions • Page {currentPage} of{" "}
                {totalPages}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requisitions Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {currentRequisitions.map((requisition, index) => (
            <div
              key={requisition.id}
              className="opacity-0 animate-pulse"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`,
              }}
            >
              <RequisitionCard
                requisition={requisition}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                getPriorityBadge={getPriorityBadge}
                setRequisitions={setRequisitions}
              />
            </div>
          ))}
        </div>

        {/* Animation Styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `,
          }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-6 space-x-2 border-t border-gray-100">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } transition-colors`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                    currentPage === pageNum
                      ? "bg-heritage-green text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } transition-colors`}
            >
              Next
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
