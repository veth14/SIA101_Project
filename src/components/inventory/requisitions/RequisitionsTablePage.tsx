import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';

interface Requisition {
  id: string;
  requestId: string;
  department: string;
  requestor: string;
  items: string[];
  justification: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

const columnHelper = createColumnHelper<Requisition>();

const RequisitionsTablePage: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Sample requisitions data
  const requisitions: Requisition[] = [
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'approved': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      'fulfilled': { bg: 'bg-green-100', text: 'text-green-800', label: 'Fulfilled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low' },
      'medium': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Medium' },
      'high': { bg: 'bg-red-100', text: 'text-red-800', label: 'High' },
      'urgent': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Urgent' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['low'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('requestId', {
        header: 'Request ID',
        cell: (info) => (
          <div>
            <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{formatDate(info.row.original.requestDate)}</div>
          </div>
        ),
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: (info) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('requestor', {
        header: 'Requestor',
        cell: (info) => (
          <div className="text-sm text-gray-900">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('items', {
        header: 'Items',
        cell: (info) => (
          <div className="text-sm text-gray-900">
            <div className="font-medium">{info.getValue().length} items</div>
            <div className="text-xs text-gray-500 truncate max-w-32" title={info.getValue().join(', ')}>
              {info.getValue().join(', ')}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('justification', {
        header: 'Justification',
        cell: (info) => (
          <div className="text-sm text-gray-900 max-w-48 truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('estimatedCost', {
        header: 'Estimated Cost',
        cell: (info) => (
          <div className="text-sm font-medium text-gray-900">{formatCurrency(info.getValue())}</div>
        ),
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
        cell: (info) => (
          <div className="flex space-x-2">
            {info.row.original.status === 'pending' && (
              <>
                <button className="text-green-600 hover:text-green-800 transition-colors text-sm font-medium">
                  Approve
                </button>
                <button className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium">
                  Reject
                </button>
              </>
            )}
            <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
              View Details
            </button>
            <button className="text-heritage-green hover:text-heritage-green/80 transition-colors text-sm font-medium">
              Edit
            </button>
          </div>
        ),
      }),
    ],
    []
  );

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

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setColumnFilters(prev => prev.filter(filter => filter.id !== 'status'));
    } else {
      setColumnFilters(prev => [
        ...prev.filter(filter => filter.id !== 'status'),
        { id: 'status', value: status }
      ]);
    }
  };

  const handleDepartmentFilter = (department: string) => {
    if (department === 'all') {
      setColumnFilters(prev => prev.filter(filter => filter.id !== 'department'));
    } else {
      setColumnFilters(prev => [
        ...prev.filter(filter => filter.id !== 'department'),
        { id: 'department', value: department }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-heritage-green to-emerald-600 bg-clip-text text-transparent">
                Requisitions Management
              </h1>
              <p className="text-gray-600 mt-2">Manage internal requests and requisitions workflow</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-heritage-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by request ID, department, or requestor..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
              
              <select
                onChange={(e) => handleDepartmentFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button className="px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium">
                New Requisition
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Table with TanStack */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-1">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: '↑',
                                desc: '↓',
                              }[header.column.getIsSorted() as string] ?? '↕'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} entries
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'<'}
              </button>
              
              <span className="flex items-center space-x-1">
                <span className="text-sm text-gray-700">Page</span>
                <strong className="text-sm">
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
              </span>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'>>'}
              </button>
              
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value))
                }}
                className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded-md"
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {table.getFilteredRowModel().rows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requisitions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequisitionsTablePage;
