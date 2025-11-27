import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, createColumnHelper, flexRender, } from '@tanstack/react-table';
const columnHelper = createColumnHelper();
const SuppliersTablePage = () => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    // Sample suppliers data
    const suppliers = [
        {
            id: 'SUP001',
            name: 'Hotel Linens Co.',
            contactPerson: 'Sarah Johnson',
            email: 'sarah@hotellinens.com',
            phone: '+63 2 123 4567',
            address: '123 Business District, Makati City',
            rating: 4.8,
            paymentTerms: 'Net 30',
            deliveryTime: '3-5 days',
            totalOrders: 45,
            totalValue: 2250000,
            status: 'active',
            category: 'Linens & Textiles',
            lastOrderDate: '2024-09-25'
        },
        {
            id: 'SUP002',
            name: 'Premium Coffee Co.',
            contactPerson: 'Miguel Santos',
            email: 'miguel@premiumcoffee.ph',
            phone: '+63 2 234 5678',
            address: '456 Coffee Street, Quezon City',
            rating: 4.6,
            paymentTerms: 'Net 15',
            deliveryTime: '1-2 days',
            totalOrders: 32,
            totalValue: 890000,
            status: 'active',
            category: 'Food & Beverage',
            lastOrderDate: '2024-09-28'
        },
        {
            id: 'SUP003',
            name: 'Cleaning Supplies Inc.',
            contactPerson: 'Anna Cruz',
            email: 'anna@cleaningsupplies.com',
            phone: '+63 2 345 6789',
            address: '789 Industrial Ave, Pasig City',
            rating: 4.2,
            paymentTerms: 'Net 45',
            deliveryTime: '2-4 days',
            totalOrders: 28,
            totalValue: 650000,
            status: 'active',
            category: 'Cleaning & Maintenance',
            lastOrderDate: '2024-09-20'
        },
        {
            id: 'SUP004',
            name: 'Hotel Amenities Ltd.',
            contactPerson: 'Robert Garcia',
            email: 'robert@hotelamenities.ph',
            phone: '+63 2 456 7890',
            address: '321 Commerce Plaza, Taguig City',
            rating: 4.5,
            paymentTerms: 'Net 30',
            deliveryTime: '5-7 days',
            totalOrders: 22,
            totalValue: 480000,
            status: 'active',
            category: 'Guest Amenities',
            lastOrderDate: '2024-09-15'
        },
        {
            id: 'SUP005',
            name: 'Electrical Supplies Ltd.',
            contactPerson: 'Lisa Mendoza',
            email: 'lisa@electricalsupplies.com',
            phone: '+63 2 567 8901',
            address: '654 Tech Hub, Alabang',
            rating: 3.9,
            paymentTerms: 'Net 60',
            deliveryTime: '7-10 days',
            totalOrders: 15,
            totalValue: 320000,
            status: 'inactive',
            category: 'Electrical & Technical',
            lastOrderDate: '2024-08-30'
        },
        {
            id: 'SUP006',
            name: 'Office Supplies Co.',
            contactPerson: 'Carlos Rivera',
            email: 'carlos@officesupplies.ph',
            phone: '+63 2 678 9012',
            address: '987 Business Park, Ortigas',
            rating: 4.3,
            paymentTerms: 'Net 30',
            deliveryTime: '2-3 days',
            totalOrders: 18,
            totalValue: 180000,
            status: 'pending',
            category: 'Office Supplies',
            lastOrderDate: '2024-09-10'
        }
    ];
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const getStatusBadge = (status) => {
        const statusConfig = {
            'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
            'inactive': { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' }
        };
        const config = statusConfig[status] || statusConfig['active'];
        return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const getRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        for (let i = 0; i < fullStars; i++) {
            stars.push(_jsx("svg", { className: "w-4 h-4 text-yellow-400 fill-current", viewBox: "0 0 20 20", children: _jsx("path", { d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" }) }, i));
        }
        if (hasHalfStar) {
            stars.push(_jsxs("svg", { className: "w-4 h-4 text-yellow-400", viewBox: "0 0 20 20", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "half-fill", children: [_jsx("stop", { offset: "50%", stopColor: "currentColor" }), _jsx("stop", { offset: "50%", stopColor: "transparent" })] }) }), _jsx("path", { fill: "url(#half-fill)", d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" })] }, "half"));
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(_jsx("svg", { className: "w-4 h-4 text-gray-300", viewBox: "0 0 20 20", children: _jsx("path", { fill: "currentColor", d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" }) }, `empty-${i}`));
        }
        return (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("div", { className: "flex", children: stars }), _jsxs("span", { className: "text-sm text-gray-600", children: ["(", rating, ")"] })] }));
    };
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Supplier Name',
            cell: (info) => (_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: info.getValue() }), _jsx("div", { className: "text-sm text-gray-500", children: info.row.original.contactPerson })] })),
        }),
        columnHelper.accessor('email', {
            header: 'Contact Info',
            cell: (info) => (_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-900", children: info.getValue() }), _jsx("div", { className: "text-sm text-gray-500", children: info.row.original.phone })] })),
        }),
        columnHelper.accessor('rating', {
            header: 'Rating',
            cell: (info) => getRatingStars(info.getValue()),
        }),
        columnHelper.accessor('paymentTerms', {
            header: 'Payment Terms',
            cell: (info) => (_jsx("span", { className: "text-sm text-gray-900", children: info.getValue() })),
        }),
        columnHelper.accessor('deliveryTime', {
            header: 'Delivery Time',
            cell: (info) => (_jsx("span", { className: "text-sm text-gray-900", children: info.getValue() })),
        }),
        columnHelper.accessor('totalOrders', {
            header: 'Total Orders',
            cell: (info) => (_jsx("div", { className: "text-sm font-medium text-gray-900", children: info.getValue() })),
        }),
        columnHelper.accessor('totalValue', {
            header: 'Total Value',
            cell: (info) => (_jsx("div", { className: "text-sm font-medium text-gray-900", children: formatCurrency(info.getValue()) })),
        }),
        columnHelper.display({
            id: 'status',
            header: 'Status',
            cell: (info) => getStatusBadge(info.row.original.status),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: () => (_jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium", children: "View Details" }), _jsx("button", { className: "text-heritage-green hover:text-heritage-green/80 transition-colors text-sm font-medium", children: "Edit" }), _jsx("button", { className: "text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium", children: "Order" })] })),
        }),
    ], []);
    const table = useReactTable({
        data: suppliers,
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
    const categories = useMemo(() => {
        const cats = Array.from(new Set(suppliers.map(supplier => supplier.category)));
        return cats.map(category => ({ label: category, value: category }));
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
    const handleCategoryFilter = (category) => {
        if (category === 'all') {
            setColumnFilters(prev => prev.filter(filter => filter.id !== 'category'));
        }
        else {
            setColumnFilters(prev => [
                ...prev.filter(filter => filter.id !== 'category'),
                { id: 'category', value: category }
            ]);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25" }), _jsx("div", { className: "absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                backgroundSize: '50px 50px'
                            } }) })] }), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsx("div", { className: "bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-heritage-green to-emerald-600 bg-clip-text text-transparent", children: "Suppliers Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Manage vendor relationships and supplier performance" })] }), _jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-heritage-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) })] }) }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 p-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx("svg", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search by supplier name, contact person, or email...", value: globalFilter ?? '', onChange: (e) => setGlobalFilter(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] }) }), _jsxs("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4", children: [_jsxs("select", { onChange: (e) => handleStatusFilter(e.target.value), className: "px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" }), _jsx("option", { value: "pending", children: "Pending" })] }), _jsxs("select", { onChange: (e) => handleCategoryFilter(e.target.value), className: "px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent", children: [_jsx("option", { value: "all", children: "All Categories" }), categories.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }), _jsx("button", { className: "px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium", children: "Add Supplier" })] })] }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: table.getHeaderGroups().map(headerGroup => (_jsx("tr", { children: headerGroup.headers.map(header => (_jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors", onClick: header.column.getToggleSortingHandler(), children: _jsxs("div", { className: "flex items-center space-x-1", children: [header.isPlaceholder
                                                                ? null
                                                                : flexRender(header.column.columnDef.header, header.getContext()), header.column.getCanSort() && (_jsx("span", { className: "text-gray-400", children: {
                                                                    asc: '↑',
                                                                    desc: '↓',
                                                                }[header.column.getIsSorted()] ?? '↕' }))] }) }, header.id))) }, headerGroup.id))) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: table.getRowModel().rows.map(row => (_jsx("tr", { className: "hover:bg-gray-50 transition-colors", children: row.getVisibleCells().map(cell => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id))) })] }) }), _jsxs("div", { className: "bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200", children: [_jsx("div", { className: "flex items-center space-x-2", children: _jsxs("span", { className: "text-sm text-gray-700", children: ["Showing ", table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1, " to", ' ', Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length), ' ', "of ", table.getFilteredRowModel().rows.length, " entries"] }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => table.setPageIndex(0), disabled: !table.getCanPreviousPage(), className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: '<<' }), _jsx("button", { onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: '<' }), _jsxs("span", { className: "flex items-center space-x-1", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Page" }), _jsxs("strong", { className: "text-sm", children: [table.getState().pagination.pageIndex + 1, " of ", table.getPageCount()] })] }), _jsx("button", { onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: '>' }), _jsx("button", { onClick: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage(), className: "px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: '>>' }), _jsx("select", { value: table.getState().pagination.pageSize, onChange: e => {
                                                    table.setPageSize(Number(e.target.value));
                                                }, className: "ml-2 px-2 py-1 text-sm border border-gray-300 rounded-md", children: [10, 20, 30, 40, 50].map(pageSize => (_jsxs("option", { value: pageSize, children: ["Show ", pageSize] }, pageSize))) })] })] })] }), table.getFilteredRowModel().rows.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83C\uDFE2" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No suppliers found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your search criteria or filters." })] }))] })] }));
};
export default SuppliersTablePage;
