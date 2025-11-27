import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { calculatePayroll } from '../../../utils/philippineTaxCalculations';
export const PayrollTable = ({ employees, onEmployeeSelect, selectedEmployee }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Filter and sort employees (prioritize: pending > delayed > paid)
    const filteredEmployees = employees
        .filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
        const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
        return matchesSearch && matchesDepartment && matchesStatus;
    })
        .sort((a, b) => {
        // Status priority: pending (1) > delayed (2) > paid (3)
        const statusPriority = { pending: 1, delayed: 2, paid: 3 };
        return statusPriority[a.status] - statusPriority[b.status];
    });
    // Pagination
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);
    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, departmentFilter, statusFilter, monthFilter]);
    const getDepartmentName = (department) => {
        const names = {
            front_desk: 'Front Desk',
            housekeeping: 'Housekeeping',
            food_beverage: 'Food & Beverage',
            management: 'Management',
            maintenance: 'Maintenance',
            security: 'Security'
        };
        return names[department] || department;
    };
    const handleExportToExcel = () => {
        // Create CSV content
        const headers = ['Employee ID', 'Name', 'Position', 'Department', 'Basic Pay', 'Allowance', 'Overtime', 'Gross Pay', 'SSS', 'PhilHealth', 'Pag-IBIG', 'Tax', 'Total Deductions', 'Net Pay', 'Status'];
        const rows = filteredEmployees.map(emp => {
            const payroll = calculatePayroll(emp.basicPay, emp.allowance, emp.overtime, emp.overtimeRate);
            return [
                emp.employeeId,
                emp.name,
                emp.position,
                getDepartmentName(emp.department),
                payroll.basicPay,
                payroll.allowance,
                payroll.overtimePay,
                payroll.grossPay,
                payroll.sss,
                payroll.philHealth,
                payroll.pagIBIG,
                payroll.withholdingTax,
                payroll.totalDeductions,
                payroll.netPay,
                emp.status.toUpperCase()
            ];
        });
        // Convert to CSV
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Payroll_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (_jsxs("div", { className: "flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70", children: [_jsxs("div", { className: "p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "flex items-center gap-3 text-2xl font-black text-gray-900", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx("svg", { className: "w-6 h-6 text-[#82A33D]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), "Payroll Records"] }), _jsxs("p", { className: "flex items-center gap-2 mt-2 text-sm text-gray-600", children: [_jsxs("span", { className: "inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold", children: [startIndex + 1, "-", Math.min(endIndex, filteredEmployees.length), " of ", filteredEmployees.length] }), _jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { children: "Current Period Employees" })] })] }), _jsxs("button", { onClick: handleExportToExcel, className: "flex items-center gap-2 px-5 py-3 text-sm font-bold text-white transition-all shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-xl hover:from-heritage-green hover:to-heritage-neutral hover:shadow-xl hover:scale-105", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), "Export to Excel"] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-4", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none", children: _jsx("svg", { className: "w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", placeholder: "Search employees...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300" })] }), _jsxs("select", { value: departmentFilter, onChange: (e) => setDepartmentFilter(e.target.value), className: "px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer", children: [_jsx("option", { value: "all", children: "All Departments" }), _jsx("option", { value: "front_desk", children: "Front Desk" }), _jsx("option", { value: "housekeeping", children: "Housekeeping" }), _jsx("option", { value: "food_beverage", children: "Food & Beverage" }), _jsx("option", { value: "management", children: "Management" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "security", children: "Security" })] }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "delayed", children: "Delayed" }), _jsx("option", { value: "paid", children: "Paid" })] }), _jsxs("select", { value: monthFilter, onChange: (e) => setMonthFilter(e.target.value), className: "px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer", children: [_jsx("option", { value: "all", children: "All Months" }), _jsx("option", { value: "2024-10", children: "October 2024" }), _jsx("option", { value: "2024-09", children: "September 2024" }), _jsx("option", { value: "2024-08", children: "August 2024" })] })] })] }), _jsx("div", { className: "flex-1 overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Employee ID" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Name" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Position" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase", children: "Basic Pay" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase", children: "Total Deductions" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase", children: "Net Pay" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase", children: "Status" })] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-200", children: [currentEmployees.map((employee, index) => {
                                    const payroll = calculatePayroll(employee.basicPay, employee.allowance, employee.overtime, employee.overtimeRate);
                                    return (_jsxs("tr", { onClick: () => onEmployeeSelect(employee), style: { animationDelay: `${index * 50}ms`, height: '74px' }, className: `group cursor-pointer transition-all duration-300 hover:shadow-sm animate-fade-in ${selectedEmployee?.id === employee.id
                                            ? 'bg-gradient-to-r from-[#82A33D]/10 via-[#82A33D]/5 to-transparent border-l-4 border-l-[#82A33D] shadow-sm'
                                            : 'hover:bg-gray-50'}`, children: [_jsx("td", { className: "px-6 py-5 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-bold text-gray-900", children: employee.employeeId }) }), _jsx("td", { className: "px-6 py-5 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold text-gray-900 group-hover:text-[#82A33D] transition-colors", children: employee.name }), _jsx("div", { className: "text-xs font-medium text-gray-500", children: getDepartmentName(employee.department) })] }) }), _jsx("td", { className: "px-6 py-5 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-semibold text-gray-700", children: employee.position }) }), _jsx("td", { className: "px-6 py-5 text-right whitespace-nowrap", children: _jsxs("div", { className: "text-sm font-bold text-gray-900", children: ["\u20B1", payroll.basicPay.toLocaleString()] }) }), _jsx("td", { className: "px-6 py-5 text-right whitespace-nowrap", children: _jsxs("div", { className: "inline-flex items-center px-2 py-1 text-sm font-bold text-red-700 rounded-lg bg-red-50", children: ["-\u20B1", payroll.totalDeductions.toLocaleString()] }) }), _jsx("td", { className: "px-6 py-5 text-right whitespace-nowrap", children: _jsxs("div", { className: "inline-flex items-center px-3 py-1.5 rounded-lg bg-[#82A33D]/10 text-[#82A33D] text-sm font-black", children: ["\u20B1", payroll.netPay.toLocaleString()] }) }), _jsx("td", { className: "px-6 py-5 text-center whitespace-nowrap", children: employee.status === 'paid' ? (_jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm", children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }), "Paid"] })) : employee.status === 'delayed' ? (_jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 shadow-sm", children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }), "Delayed"] })) : (_jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200 shadow-sm", children: [_jsx("svg", { className: "w-3 h-3 mr-1 animate-spin", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "Pending"] })) })] }, employee.id));
                                }), Array.from({ length: Math.max(0, 5 - currentEmployees.length) }).map((_, index) => (_jsx("tr", { style: { height: '74px' }, className: "border-gray-200 border-dashed bg-gray-50/30", children: _jsx("td", { className: "px-6 py-5", colSpan: 7, children: _jsxs("div", { className: "flex items-center justify-center text-sm font-medium text-gray-300 opacity-60", children: [_jsx("div", { className: "w-2 h-2 mr-2 bg-gray-300 rounded-full opacity-40" }), "Empty slot ", index + 1] }) }) }, `empty-${index}`)))] })] }) }), filteredEmployees.length === 0 && (_jsxs("div", { className: "py-12 text-center", children: [_jsx("div", { className: "mb-4 text-5xl text-gray-400", children: "\uD83D\uDD0D" }), _jsx("p", { className: "font-medium text-gray-500", children: "No employees found" }), _jsx("p", { className: "mt-1 text-sm text-gray-400", children: "Try adjusting your search or filters" })] })), (_jsx("div", { className: "p-6 border-t border-gray-100 bg-gray-50/50", children: _jsx("div", { className: "flex items-center justify-center", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex items-center space-x-1", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    }
                                    else {
                                        const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                                        pageNum = start + i;
                                    }
                                    return (_jsx("button", { onClick: () => setCurrentPage(pageNum), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${pageNum === currentPage ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`, children: pageNum }, pageNum));
                                }) }), _jsxs("button", { onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed", children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }) }))] }));
};
