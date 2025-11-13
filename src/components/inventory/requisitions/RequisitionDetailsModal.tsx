import React, { useState } from "react";
import { createPortal } from "react-dom";
import usePatchInvRequisition from "@/api/patchInvRequisition";

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

interface RequisitionDetailsModalProps {
  requisition: Requisition;
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  setRequisitions: React.Dispatch<React.SetStateAction<Requisition[]>>;
}

export const RequisitionDetailsModal: React.FC<
  RequisitionDetailsModalProps
> = ({
  requisition,
  isOpen,
  onClose,
  formatCurrency,
  getStatusBadge,
  getPriorityBadge,
  setRequisitions,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isFulfilling, setIsFulfilling] = useState(false);

  const { patchInvRequisition } = usePatchInvRequisition();

  // Handle Approve
  const handleApprove = async () => {
    console.log("Approving requisition with ID:", requisition.id);
    console.log("Request Number:", requisition.requestNumber);

    setIsApproving(true);
    try {
      const response = await patchInvRequisition(requisition.id, {
        status: "approved",
        approvedBy: "Supervisor", // TODO: Replace with actual logged-in user
        approvedDate: new Date().toISOString(),
      });

      if (response.success) {
        alert("Requisition approved successfully!");
        console.log(response);
        setRequisitions(response.updatedData);
        onClose(); // Close modal after success
      } else {
        alert(response.message || "Failed to approve requisition");
      }
    } catch (error) {
      console.error("Error approving requisition:", error);
      alert("An error occurred while approving the requisition");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    console.log("Rejecting requisition with ID:", requisition.id);
    console.log("Request Number:", requisition.requestNumber);

    setIsRejecting(true);
    try {
      const response = await patchInvRequisition(requisition.id, {
        status: "rejected",
        approvedBy: "Supervisor", // TODO: Replace with actual logged-in user
        approvedDate: new Date().toISOString(),
      });

      if (response.success) {
        alert("Requisition rejected successfully!");
        console.log(response);
        setRequisitions(response.updatedData);
        onClose(); // Close modal after success
      } else {
        alert(response.message || "Failed to reject requisition");
      }
    } catch (error) {
      console.error("Error reject requisition:", error);
      alert("An error occurred while rejecting the requisition");
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle Mark as Fulfilled
  const handleMarkFulfilled = async () => {
    console.log("Marking requisition as fulfilled with ID:", requisition.id);
    console.log("Request Number:", requisition.requestNumber);

    setIsFulfilling(true);
    try {
      const response = await patchInvRequisition(requisition.id, {
        status: "fulfilled",
        approvedBy: "Supervisor", // TODO: Replace with actual logged-in user
        approvedDate: new Date().toISOString(),
      });

      if (response.success) {
        alert("Requisition fulfilled successfully!");
        console.log(response);
        setRequisitions(response.updatedData);
        onClose(); // Close modal after success
      } else {
        alert(response.message || "Failed to fulfilled requisition");
      }
    } catch (error) {
      console.error("Error fulfilled requisition:", error);
      alert("An error occurred while fulfilling the requisition");
    } finally {
      setIsFulfilling(false);
    }
  };

  // Check if any action is loading
  const isLoading = isApproving || isRejecting || isFulfilling;

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
      ></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-emerald-50/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {requisition.requestNumber}
                </h2>
                <p className="text-sm text-gray-600">
                  {requisition.department} - {requisition.requestedBy}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-250px)] px-6 py-5">
            <div className="space-y-5">
              {/* Request Info Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Request Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Status
                    </label>
                    <div className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white">
                      {getStatusBadge(requisition.status)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Priority
                    </label>
                    <div className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white">
                      {getPriorityBadge(requisition.priority)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Request Date
                    </label>
                    <input
                      type="text"
                      value={new Date(
                        requisition.requestDate
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Required Date
                    </label>
                    <input
                      type="text"
                      value={new Date(
                        requisition.requiredDate
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={requisition.department}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Requested By
                    </label>
                    <input
                      type="text"
                      value={requisition.requestedBy}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Approval Information */}
                {(requisition.status === "approved" ||
                  requisition.status === "fulfilled") &&
                  requisition.approvedBy && (
                    <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-700">
                        Approved by: {requisition.approvedBy}
                      </p>
                      {requisition.approvedDate && (
                        <p className="text-sm text-green-600 mt-1">
                          on{" "}
                          {new Date(
                            requisition.approvedDate
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  )}
              </div>

              {/* Justification Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Justification
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    {requisition.justification}
                  </p>
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Requested Items
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {requisition.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className="mb-2">
                        <h4 className="font-semibold text-gray-700 text-xs">
                          Item #{index + 1}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Item Name
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            disabled
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <input
                              type="text"
                              value={`${item.quantity} ${item.unit}`}
                              disabled
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Estimated Cost (₱)
                            </label>
                            <input
                              type="text"
                              value={item.estimatedCost.toLocaleString(
                                "en-PH",
                                { minimumFractionDigits: 2 }
                              )}
                              disabled
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Reason
                          </label>
                          <textarea
                            value={item.reason}
                            disabled
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              {requisition.notes && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Notes
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">{requisition.notes}</p>
                  </div>
                </div>
              )}

              {/* Total Estimated Cost */}
              <div className="bg-gradient-to-r from-heritage-green/10 to-emerald-50 rounded-lg p-4 border border-heritage-green/20">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">
                    Total Estimated Cost:
                  </span>
                  <span className="text-2xl font-black text-heritage-green">
                    ₱
                    {requisition.totalEstimatedCost.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CLOSE
            </button>
            {requisition.status === "pending" && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isApproving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "APPROVE"
                  )}
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isRejecting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "REJECT"
                  )}
                </button>
              </>
            )}
            {requisition.status === "approved" && (
              <button
                onClick={handleMarkFulfilled}
                disabled={isLoading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
              >
                {isFulfilling ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "MARK AS FULFILLED"
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
