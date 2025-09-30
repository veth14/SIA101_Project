import type { ColumnDef } from '@tanstack/react-table';

export interface AnalyticsReportData {
  id: string;
  item: string;
  category: string;
  department: string;
  consumed: number;
  procured: number;
  variance: number;
  turnoverRate: number;
  value: number;
  lastUpdated: string;
}

export const analyticsColumns: ColumnDef<AnalyticsReportData>[] = [
  {
    accessorKey: 'item',
    header: 'Item',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.getValue('item')}</div>
        <div className="text-sm text-gray-500">{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {row.getValue('department')}
      </span>
    ),
  },
  {
    accessorKey: 'consumed',
    header: 'Consumed',
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {(row.getValue('consumed') as number).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'procured',
    header: 'Procured',
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {(row.getValue('procured') as number).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'variance',
    header: 'Variance',
    cell: ({ row }) => {
      const variance = row.getValue('variance') as number;
      const isPositive = variance >= 0;
      return (
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{variance.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'turnoverRate',
    header: 'Turnover Rate',
    cell: ({ row }) => {
      const rate = row.getValue('turnoverRate') as number;
      const getColor = (rate: number) => {
        if (rate >= 80) return 'text-green-600';
        if (rate >= 60) return 'text-yellow-600';
        return 'text-red-600';
      };
      
      return (
        <div className={`text-sm font-medium ${getColor(rate)}`}>
          {rate.toFixed(1)}%
        </div>
      );
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        ₱{(row.getValue('value') as number).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Last Updated',
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {new Date(row.getValue('lastUpdated')).toLocaleDateString()}
      </div>
    ),
  }
];
