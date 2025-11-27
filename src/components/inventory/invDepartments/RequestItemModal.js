import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import ReactDOM from 'react-dom';
export const RequestItemModal = ({ isOpen, onClose, departmentName, departmentId, onSuccess, }) => {
    const [formData, setFormData] = useState({
        itemService: '',
        requestedBy: '',
        priority: 'Normal',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!isOpen)
        return null;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.itemService.trim() || !formData.requestedBy.trim()) {
            alert('Please fill in all required fields');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:3000/api/inventory-department/post-maintenance-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    department: departmentName,
                    itemService: formData.itemService,
                    requestedBy: formData.requestedBy,
                    date: new Date().toISOString().split('T')[0],
                    status: 'Pending',
                }),
            });
            const result = await response.json();
            if (result.success) {
                alert('Maintenance request submitted successfully!');
                handleClose();
                // Trigger refresh of the department page
                onSuccess?.();
            }
            else {
                alert(result.message || 'Failed to submit request');
            }
        }
        catch (error) {
            console.error('Error submitting request:', error);
            alert('An error occurred while submitting the request');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleClose = () => {
        setFormData({
            itemService: '',
            requestedBy: '',
            priority: 'Normal',
            description: '',
        });
        onClose();
    };
    const modalContent = (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-start justify-between p-5 border-b", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "New Maintenance Request" }), _jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: ["Department: ", departmentName] })] })] }), _jsx("button", { onClick: handleClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Item/Service ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "itemService", value: formData.itemService, onChange: handleInputChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "e.g., Air Conditioner Repair, New Office Chairs" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Requested By ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "requestedBy", value: formData.requestedBy, onChange: handleInputChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Your name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Priority" }), _jsxs("select", { name: "priority", value: formData.priority, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Normal", children: "Normal" }), _jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Urgent", children: "Urgent" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleInputChange, rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Provide details about the request..." })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [_jsx("button", { type: "button", onClick: handleClose, disabled: isSubmitting, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Submitting..."] })) : ('Submit Request') })] })] })] }) }));
    return ReactDOM.createPortal(modalContent, document.body);
};
