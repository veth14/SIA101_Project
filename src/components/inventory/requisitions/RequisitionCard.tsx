import React, { useState } from "react";
import { RequisitionDetailsModal } from "./RequisitionDetailsModal";
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

interface RequisitionCardProps {
  requisition: Requisition;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  setRequisitions: React.Dispatch<React.SetStateAction<Requisition[]>>;
}

export const RequisitionCard: React.FC<RequisitionCardProps> = ({
  requisition,
  formatCurrency,
  getStatusBadge,
  getPriorityBadge,
  setRequisitions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Handle Delete (optional - if you want to add delete functionality)
  const handleDelete = () => {
    console.log("Deleting requisition with ID:", requisition.id);
    console.log("Request Number:", requisition.requestNumber);
    // TODO: Add API call to delete requisition
  };

  // Check if any action is loading
  const isLoading = isApproving || isRejecting || isFulfilling;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {requisition.requestNumber}
            </h3>
            <p className="text-sm text-gray-600">
              {requisition.department} - {requisition.requestedBy}
            </p>
          </div>
          <div className="flex flex-col space-y-1">
            {getStatusBadge(requisition.status)}
            {getPriorityBadge(requisition.priority)}
          </div>
        </div>

        {/* Items List */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Items ({requisition.items.length})
          </p>
          <div className="space-y-1">
            {requisition.items.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-600"
              >
                <span>
                  {item.name} (×{item.quantity})
                </span>
                <span>{formatCurrency(item.estimatedCost)}</span>
              </div>
            ))}
            {requisition.items.length > 2 && (
              <p className="text-sm text-gray-500">
                +{requisition.items.length - 2} more items
              </p>
            )}
          </div>
        </div>

        {/* Total Cost */}
        <div className="flex justify-between items-center py-3 border-t border-gray-200 mb-4">
          <span className="text-sm font-medium text-gray-700">
            Total Estimated
          </span>
          <span className="text-lg font-bold text-heritage-green">
            {formatCurrency(requisition.totalEstimatedCost)}
          </span>
        </div>

        {/* Dates */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>
            Requested: {new Date(requisition.requestDate).toLocaleDateString()}
          </span>
          <span>
            Required: {new Date(requisition.requiredDate).toLocaleDateString()}
          </span>
        </div>

        {/* Approval Information */}
        {requisition.status === "approved" ||
        requisition.status === "fulfilled" ? (
          requisition.approvedBy ? (
            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400 mb-4">
              <p className="text-sm text-green-700 font-medium">
                Approved by: {requisition.approvedBy}
              </p>
              {requisition.approvedDate && (
                <p className="text-xs text-green-600 mt-1">
                  Approved on:{" "}
                  {new Date(requisition.approvedDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 mb-4">
              <p className="text-sm text-gray-500 italic">
                Approval information not available
              </p>
            </div>
          )
        ) : requisition.status === "rejected" ? (
          <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400 mb-4">
            <p className="text-sm text-red-700 font-medium">Request rejected</p>
            <p className="text-xs text-red-600 mt-1">
              Review required for resubmission
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400 mb-4">
            <p className="text-sm text-yellow-700 font-medium">
              Pending approval
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Awaiting manager review
            </p>
          </div>
        )}

        {/* Notes Section */}
        {requisition.notes ? (
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 min-h-[60px] flex flex-col justify-center mb-4">
            <p className="text-xs text-blue-600 font-medium mb-1">Notes:</p>
            <p className="text-sm text-blue-700 italic">
              "{requisition.notes}"
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 min-h-[60px] flex items-center mb-4">
            <p className="text-sm text-gray-400 italic">
              No additional notes provided
            </p>
          </div>
        )}

        {/* Justification */}
        <div className="text-sm text-gray-600 mb-4 flex-grow">
          <p className="text-xs text-gray-500 font-medium mb-1">
            Justification:
          </p>
          <p className="line-clamp-2">{requisition.justification}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Details
          </button>
          {requisition.status === "pending" && (
            <>
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
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
                  "Approve"
                )}
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
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
                  "Reject"
                )}
              </button>
            </>
          )}
          {requisition.status === "approved" && (
            <button
              onClick={handleMarkFulfilled}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
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
                "Mark Fulfilled"
              )}
            </button>
          )}
        </div>
      </div>

      <RequisitionDetailsModal
        requisition={requisition}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formatCurrency={formatCurrency}
        getStatusBadge={getStatusBadge}
        getPriorityBadge={getPriorityBadge}
        setRequisitions={setRequisitions}
      />
    </>
  );
};
