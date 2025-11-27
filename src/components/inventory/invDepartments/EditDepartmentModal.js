import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
export const EditDepartmentModal = ({ isOpen, onClose, department, onSuccess, }) => {
    const [formData, setFormData] = useState({
        name: '',
        manager: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name,
                manager: department.manager,
            });
        }
    }, [department]);
    if (!isOpen || !department)
        return null;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault;
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/inventory-department/update-department/${department.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    manager: formData.manager,
                }),
            });
            const result = await response.json();
            if (result.success) {
                alert('Department updated successfully!');
                onSuccess?.();
                onClose();
            }
            else {
                alert(result.message || 'Failed to update department');
            }
        }
        catch (error) {
            console.error('Error updating department:', error);
            alert('An error occurred while updating the department');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const modalContent = (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-start justify-between p-5 border-b", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-heritage-green flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Edit Department" }), _jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: department.name })] })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Department Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Department name" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Manager ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "manager", value: formData.manager, onChange: handleInputChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Manager name" })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Items Assigned:" }), _jsx("span", { className: "font-semibold text-gray-900", children: department.itemsAssigned })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Total Usage:" }), _jsxs("span", { className: "font-semibold text-gray-900", children: [department.totalUsage, "%"] })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [_jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-2 text-sm font-medium text-white bg-heritage-green rounded-md hover:bg-heritage-green/90 transition-colors disabled:opacity-50 flex items-center gap-2", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Updating..."] })) : ('Save Changes') })] })] })] }) }));
    return ReactDOM.createPortal(modalContent, document.body);
};
