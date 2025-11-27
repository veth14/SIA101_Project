import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, createColumnHelper, flexRender, } from '@tanstack/react-table';
const columnHelper = createColumnHelper();
const RequisitionsTablePage = () => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    // Sample requisitions data
    const requisitions = [
        {
            id: 'REQ001',
            requestId: 'REQ-2024-001',
            department: 'Housekeeping',
            requestor: 'Maria Santos',
            items: ['Vacuum Cleaner', 'Cleaning Supplies', 'Towel Sets'],
            justification: 'Current vacuum cleaner is broken and we need additional cleaning supplies for peak season',
            estimatedCost: 25000,
            status: 'pending',
            priority: 'high',
            requestDate: '2024-09-28',
            notes: 'Urgent need for housekeeping operations'
        },
        {
            id: 'REQ002',
            requestId: 'REQ-2024-002',
            department: 'F&B',
            requestor: 'Carlos Rivera',
            items: ['Commercial Blender', 'Kitchen Utensils', 'Serving Trays'],
            justification: 'Equipment upgrade needed to improve service efficiency and food preparation quality',
            estimatedCost: 18500,
            status: 'approved',
            priority: 'medium',
            requestDate: '2024-09-25',
            approvedBy: 'Admin Manager',
            approvedDate: '2024-09-27'
        },
        {
            id: 'REQ003',
            requestId: 'REQ-2024-003',
            department: 'Maintenance',
            requestor: 'Robert Garcia',
            items: ['Power Tools', 'Safety Equipment', 'Electrical Components'],
            justification: 'Safety compliance and equipment maintenance requirements',
            estimatedCost: 32000,
            status: 'approved',
            priority: 'high',
            requestDate: '2024-09-22',
            approvedBy: 'Admin Manager',
            approvedDate: '2024-09-24'
        },
        {
            id: 'REQ004',
            requestId: 'REQ-2024-004',
            department: 'Front Office',
            requestor: 'Anna Reyes',
            items: ['Computer Monitor', 'Office Supplies', 'Printer Cartridges'],
            justification: 'Current monitor is malfunctioning affecting guest check-in efficiency',
            estimatedCost: 12000,
            status: 'fulfilled',
            priority: 'medium',
            requestDate: '2024-09-20',
            approvedBy: 'Admin Manager',
            approvedDate: '2024-09-21'
        },
        {
            id: 'REQ005',
            requestId: 'REQ-2024-005',
            department: 'Security',
            requestor: 'Michael Torres',
            items: ['Security Cameras', 'Access Control System', 'Monitoring Equipment'],
            justification: 'Upgrade security system to enhance guest safety and property protection',
            estimatedCost: 45000,
            status: 'rejected',
            priority: 'low',
            requestDate: '2024-09-18',
            notes: 'Budget constraints - defer to next quarter'
        },
        {
            id: 'REQ006',
            requestId: 'REQ-2024-006',
            department: 'Housekeeping',
            requestor: 'Lisa Mendoza',
            items: ['Laundry Equipment', 'Cleaning Chemicals', 'Uniform Sets'],
            justification: 'Laundry equipment needs replacement and staff uniform renewal',
            estimatedCost: 28000,
            status: 'pending',
            priority: 'urgent',
            requestDate: '2024-09-30'
        }
    ];
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            'approved': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
            'fulfilled': { bg: 'bg-green-100', text: 'text-green-800', label: 'Fulfilled' }
        };
        const config = statusConfig[status] || statusConfig['pending'];
        return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            'low': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low' },
            'medium': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Medium' },
            'high': { bg: 'bg-red-100', text: 'text-red-800', label: 'High' },
            'urgent': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Urgent' }
        };
        const config = priorityConfig[priority] || priorityConfig['low'];
        return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const columns = useMemo(() => [
        columnHelper.accessor('requestId', {
            header: 'Request ID',
            cell: (info) => (_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: info.getValue() }), _jsx("div", { className: "text-sm text-gray-500", children: formatDate(info.row.original.requestDate) })] })),
        }),
        columnHelper.accessor('department', {
            header: 'Department',
            cell: (info) => (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800", children: info.getValue() })),
        }),
        columnHelper.accessor('requestor', {
            header: 'Requestor',
            cell: (info) => (_jsx("div", { className: "text-sm text-gray-900", children: info.getValue() })),
        }),
        columnHelper.accessor('items', {
            header: 'Items',
            cell: (info) => (_jsxs("div", { className: "text-sm text-gray-900", children: [_jsxs("div", { className: "font-medium", children: [info.getValue().length, " items"] }), _jsx("div", { className: "text-xs text-gray-500 truncate max-w-32", title: info.getValue().join(', '), children: info.getValue().join(', ') })] })),
        }),
        columnHelper.accessor('justification', {
            header: 'Justification',
            cell: (info) => (_jsx("div", { className: "text-sm text-gray-900 max-w-48 truncate", title: info.getValue(), children: info.getValue() })),
        }),
        columnHelper.accessor('estimatedCost', {
            header: 'Estimated Cost',
            cell: (info) => (_jsx("div", { className: "text-sm font-medium text-gray-900", children: formatCurrency(info.getValue()) })),
        }),
        columnHelper.display({
            id: 'status',
            header: 'Status',
            cell: (info) => getStatusBadge(info.row.original.status),
        }),
        columnHelper.display({
            id: 'priority',
            header: 'Priority',
            cell: (info) => getPriorityBadge(info.row.original.priority),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: (info) => (_jsxs("div", { className: "flex space-x-2", children: [info.row.original.status === 'pending' && (_jsxs(_Fragment, { children: [_jsx("button", { className: "text-green-600 hover:text-green-800 transition-colors text-sm font-medium", children: "Approve" }), _jsx("button", { className: "text-red-600 hover:text-red-800 transition-colors text-sm font-medium", children: "Reject" })] })), _jsx("button", { className: "text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium", children: "View Details" }), _jsx("button", { className: "text-heritage-green hover:text-heritage-green/80 transition-colors text-sm font-medium", children: "Edit" })] })),
        }),
    ], []);
    const table = useReactTable({
        data: requisitions,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    const departments = useMemo(() => {
        const depts = Array.from(new Set(requisitions.map(req => req.department)));
        return depts.map(dept => ({ label: dept, value: dept }));
    }, []);
    const handleStatusFilter = (status) => {
        if (status === 'all') {
            setColumnFilters(prev => prev.filter(filter => filter.id !== 'status'));
        }
        else {
            setColumnFilters(prev => [
                ...prev.filter(filter => filter.id !== 'status'),
                { id: 'status', value: status }
            ]);
        }
    };
    const handleDepartmentFilter = (department) => {
        if (department === 'all') {
            setColumnFilters(prev => prev.filter(filter => filter.id !== 'department'));
        }
        else {
            setColumnFilters(prev => [
                ...prev.filter(filter => filter.id !== 'department'),
                { id: 'department', value: department }
            ]);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25" }), _jsx("div", { className: "absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                backgroundSize: '50px 50px'
                            } }) })] }), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsx("div", { className: "bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-heritage-green to-emerald-600 bg-clip-text text-transparent", children: "Requisitions Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Manage internal requests and requisitions workflow" })] }), _jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-heritage-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }) }) })] }) }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 p-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx("svg", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search by request ID, department, or requestor...", value: globalFilter ?? '', onChange: (e) => setGlobalFilter(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] }) }), _jsxs("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4", children: [_jsxs("select", { onChange: (e) => handleStatusFilter(e.target.value), className: "px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "rejected", children: "Rejected" }), _jsx("option", { value: "fulfilled", children: "Fulfilled" })] }), _jsxs("select", { onChange: (e) => handleDepartmentFilter(e.target.value), className: "px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent", children: [_jsx("option", { value: "all", children: "All Departments" }), departments.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }), _jsx("button", { className: "px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium", children: "New Requisition" })] })] }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: table.getHeaderGroups().map(headerGroup => (_jsx("tr", { children: headerGroup.headers.map(header => (_jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors", onClick: header.column.getToggleSortingHandler(), children: _jsxs("div", { className: "flex items-center space-x-1", children: [header.isPlaceholder
                                                                ? null
                                                                : flexRender(header.column.columnDef.header, header.getContext()), header.column.getCanSort() && (_jsx("span", { className: "text-gray-400", children: {
                                                                    asc: '↑',
                                                                    desc: '↓',
                                                                }[header.column.getIsSorted()] ?? '↕' }))] }) }, header.id))) }, headerGroup.id))) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: table.getRowModel().rows.map(row => (_jsx("tr", { className: "hover:bg-gray-50 transition-colors", children: row.getVisibleCells().map(cell => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id))) })] }) }), _jsxs("div", { className: "bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200", children: [_jsx("div", { className: "flex items-center space-x-2", children: _jsxs("span", { className: "text-sm text-gray-700", children: ["Showing ", table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1, " to", ' ', Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length), ' ', "of ", table.getFilteredRowModel().rows.length, " entries"] }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => table.setPageIndex(0), disabled: !table.getCanPreviousPage(), className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: '<<' }), _jsx("button", { onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: '<' }), _jsxs("span", { className: "flex items-center space-x-1", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Page" }), _jsxs("strong", { className: "text-sm", children: [table.getState().pagination.pageIndex + 1, " of ", table.getPageCount()] })] }), _jsx("button", { onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: '>' }), _jsx("button", { onClick: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage(), className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: '>>' }), _jsx("select", { value: table.getState().pagination.pageSize, onChange: e => {
                                                    table.setPageSize(Number(e.target.value));
                                                }, className: "ml-2 px-2 py-1 text-sm border border-gray-300 rounded-md", children: [10, 20, 30, 40, 50].map(pageSize => (_jsxs("option", { value: pageSize, children: ["Show ", pageSize] }, pageSize))) })] })] })] }), table.getFilteredRowModel().rows.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCDD" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No requisitions found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your search criteria or filters." })] }))] })] }));
};
export default RequisitionsTablePage;
