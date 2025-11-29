import React, { useState } from "react";
import { ProcurementDetailsModal } from "./ProcurementDetailsModal";
import usePatchInvProcurement from "../../../api/patchInvProcurement";

interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: "pending" | "approved" | "received" | "cancelled";
  orderDate: string;
  expectedDelivery: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

interface ProcurementCardProps {
  order: PurchaseOrder;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  onSuccess?: () => void;
}

export const ProcurementCard: React.FC<ProcurementCardProps> = ({
  order,
  formatCurrency,
  getStatusBadge,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { patchInvProcurement, loadingForPatchInvProcurement } =
    usePatchInvProcurement();

  const handleApproveOrder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to approve this purchase order?")) {
      return;
    }

    try {
      const response = await patchInvProcurement(order.orderNumber, {
        status: "approved",
        approvedBy: "Manager Name", // TODO: Replace with actual logged-in user
        approvedDate: new Date().toISOString(),
      });

      if (response.success) {
        alert("Purchase order approved successfully!");
        if (onSuccess) onSuccess();
      } else {
        alert(response.message || "Failed to approve purchase order");
      }
    } catch (error) {
      console.error("Error approving order:", error);
      alert("An error occurred while approving the purchase order");
    }
  };

  const handleMarkReceived = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to mark this order as received?")) {
      return;
    }

    try {
      const response = await patchInvProcurement(order.orderNumber, {
        status: "received",
      });

      if (response.success) {
        alert("Purchase order marked as received!");
        if (onSuccess) onSuccess();
      } else {
        alert(response.message || "Failed to update purchase order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred while updating the purchase order");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {order.orderNumber}
            </h3>
            <p className="text-sm text-gray-600">{order.supplier}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Items ({order.items?.length || 0})
            </p>
            <div className="mt-1 space-y-1">
              {(order.items || []).slice(0, 2).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.name} (×{item.quantity})
                  </span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
              {(order.items?.length || 0) > 2 && (
                <p className="text-sm text-gray-500">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Total Amount
            </span>
            <span className="text-lg font-bold text-heritage-green">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Order: {new Date(order.orderDate).toLocaleDateString()}</span>
            <span>
              Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
            </span>
          </div>

          {/* Approval Information */}
          {order.status === "approved" || order.status === "received" ? (
            order.approvedBy ? (
              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                <p className="text-sm text-green-700 font-medium">
                  Approved by: {order.approvedBy}
                </p>
                {order.approvedDate && (
                  <p className="text-xs text-green-600 mt-1">
                    Approved on:{" "}
                    {new Date(order.approvedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                <p className="text-sm text-gray-500 italic">
                  Approval information not available
                </p>
              </div>
            )
          ) : (
            <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-700 font-medium">
                Pending approval
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Awaiting manager review
              </p>
            </div>
          )}

          {/* Notes Section */}
          {order.notes ? (
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 min-h-[60px] flex flex-col justify-center">
              <p className="text-xs text-blue-600 font-medium mb-1">Notes:</p>
              <p className="text-sm text-blue-700 italic">"{order.notes}"</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 min-h-[60px] flex items-center">
              <p className="text-sm text-gray-400 italic">
                No additional notes provided
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loadingForPatchInvProcurement}
            className="flex-1 px-4 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Details
          </button>
          {order.status === "pending" && (
            <button
              onClick={handleApproveOrder}
              disabled={loadingForPatchInvProcurement}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loadingForPatchInvProcurement ? (
                <>
                  <svg
                    className="animate-spin h-3.5 w-3.5"
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
                </>
              ) : (
                "Approve"
              )}
            </button>
          )}
          {order.status === "approved" && (
            <button
              onClick={handleMarkReceived}
              disabled={loadingForPatchInvProcurement}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loadingForPatchInvProcurement ? (
                <>
                  <svg
                    className="animate-spin h-3.5 w-3.5"
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
                </>
              ) : (
                "Mark Received"
              )}
            </button>
          )}
        </div>
      </div>

      <ProcurementDetailsModal
        order={order}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formatCurrency={formatCurrency}
        getStatusBadge={getStatusBadge}
        onSuccess={onSuccess}
      />
    </>
  );
};
