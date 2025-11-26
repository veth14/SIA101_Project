import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import usePostInvRequisition from "../../../api/postInvRequisition";
import useGetInvDepartment from "../../../api/getInvDepartment";

interface RequisitionItem {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  reason: string;
}

interface NewRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface NewRequisitionData {
  department: string;
  requestedBy: string;
  requiredDate: string;
  priority: string;
  justification: string;
  items: RequisitionItem[];
}

const NewRequisitionModal: React.FC<NewRequisitionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [requisitionData, setRequisitionData] = useState<NewRequisitionData>({
    department: "",
    requestedBy: "",
    requiredDate: "",
    priority: "medium",
    justification: "",
    items: [{ name: "", quantity: 0, unit: "", estimatedCost: 0, reason: "" }],
  });
  const [departments, setDepartments] = useState<any[]>([]);

  const { postInvRequisition, loadingForPostInvRequisition } = usePostInvRequisition();
  const { getInvDepartment, loadingForGetInvDepartment } = useGetInvDepartment();

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    try {
      const response = await getInvDepartment();
      console.log("Departments response:", response);
      if (response && response.success) {
        // Extract departments from nested structure
        const departmentsData = response.data?.departments || response.data || [];
        console.log("Departments data:", departmentsData);
        setDepartments(departmentsData);
      } else {
        console.error("Failed to fetch departments:", response?.message);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  const handleAddItem = () => {
    setRequisitionData({
      ...requisitionData,
      items: [...requisitionData.items, { name: "", quantity: 0, unit: "", estimatedCost: 0, reason: "" }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (requisitionData.items.length > 1) {
      const newItems = requisitionData.items.filter((_, i) => i !== index);
      setRequisitionData({ ...requisitionData, items: newItems });
    }
  };

  const handleItemChange = (index: number, field: keyof RequisitionItem, value: string | number) => {
    const newItems = [...requisitionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setRequisitionData({ ...requisitionData, items: newItems });
  };

  const calculateTotalEstimatedCost = () => {
    return requisitionData.items.reduce((sum, item) => sum + (item.quantity * item.estimatedCost), 0);
  };

  const handleSave = async () => {
    if (!requisitionData.department.trim()) {
      alert("Please select a department");
      return;
    }

    if (!requisitionData.requestedBy.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!requisitionData.requiredDate) {
      alert("Please select a required date");
      return;
    }

    if (!requisitionData.justification.trim()) {
      alert("Please provide justification for this requisition");
      return;
    }

    const hasInvalidItems = requisitionData.items.some(
      (item) => !item.name.trim() || item.quantity <= 0 || !item.unit.trim() || item.estimatedCost <= 0 || !item.reason.trim()
    );

    if (hasInvalidItems) {
      alert("Please fill in all item details with valid information");
      return;
    }

    const newRequisition = {
      department: requisitionData.department,
      requestedBy: requisitionData.requestedBy,
      requestDate: new Date().toISOString().split("T")[0],
      requiredDate: requisitionData.requiredDate,
      priority: requisitionData.priority,
      justification: requisitionData.justification,
      items: requisitionData.items,
      totalEstimatedCost: calculateTotalEstimatedCost(),
      status: "pending",
    };

    try {
      const response = await postInvRequisition(newRequisition);
      
      if (response.success) {
        console.log("Requisition created successfully:", response);
        alert("Requisition created successfully!");
        handleCancel();
        if (onSuccess) onSuccess();
      } else {
        alert(response.message || "Failed to create requisition");
      }
    } catch (error) {
      console.error("Error creating requisition:", error);
      alert("An error occurred while creating the requisition");
    }
  };

  const handleCancel = () => {
    setRequisitionData({
      department: "",
      requestedBy: "",
      requiredDate: "",
      priority: "medium",
      justification: "",
      items: [{ name: "", quantity: 0, unit: "", estimatedCost: 0, reason: "" }],
    });
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-emerald-50/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Add New Requisition</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-250px)] px-6 py-5">
            <div className="space-y-5">
              {/* Requisition Info Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Requisition Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Request Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={new Date().toISOString().split("T")[0]}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Required Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={requisitionData.requiredDate}
                      onChange={(e) => setRequisitionData({ ...requisitionData, requiredDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={requisitionData.department}
                      onChange={(e) => setRequisitionData({ ...requisitionData, department: e.target.value })}
                      disabled={loadingForGetInvDepartment}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">
                        {loadingForGetInvDepartment ? "Loading departments..." : "Select Department"}
                      </option>
                      {departments && departments.length > 0 && departments.map((dept) => (
                        <option key={dept.id || dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Requested By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={requisitionData.requestedBy}
                      onChange={(e) => setRequisitionData({ ...requisitionData, requestedBy: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={requisitionData.priority}
                      onChange={(e) => setRequisitionData({ ...requisitionData, priority: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Justification <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={requisitionData.justification}
                      onChange={(e) => setRequisitionData({ ...requisitionData, justification: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white resize-none"
                      placeholder="Provide justification for this requisition..."
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Requisition Items</h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors font-medium text-xs flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {requisitionData.items.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-700 text-xs">Item #{index + 1}</h4>
                        {requisitionData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            placeholder="e.g., Office Supplies"
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity || ""}
                              onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                              placeholder="pcs, box"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Est. Cost (₱)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.estimatedCost || ""}
                              onChange={(e) => handleItemChange(index, "estimatedCost", parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                          <input
                            type="text"
                            value={item.reason}
                            onChange={(e) => handleItemChange(index, "reason", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            placeholder="Reason for requesting this item"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Estimated Cost */}
              <div className="bg-gradient-to-r from-heritage-green/10 to-emerald-50 rounded-lg p-4 border border-heritage-green/20">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">Total Estimated Cost:</span>
                  <span className="text-2xl font-black text-heritage-green">
                    ₱{calculateTotalEstimatedCost().toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleCancel}
              disabled={loadingForPostInvRequisition}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={loadingForPostInvRequisition}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingForPostInvRequisition ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "SAVE REQUISITION"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default NewRequisitionModal;
