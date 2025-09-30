import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusVariant = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'fulfilled' 
  | 'cancelled'
  | 'low-stock'
  | 'out-of-stock'
  | 'in-stock'
  | 'received'
  | 'ordered';

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

const statusConfig: Record<StatusVariant, { label: string; className: string }> = {
  active: { 
    label: 'Active', 
    className: 'bg-green-100 text-green-800 hover:bg-green-100' 
  },
  inactive: { 
    label: 'Inactive', 
    className: 'bg-red-100 text-red-800 hover:bg-red-100' 
  },
  pending: { 
    label: 'Pending', 
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' 
  },
  approved: { 
    label: 'Approved', 
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
  },
  rejected: { 
    label: 'Rejected', 
    className: 'bg-red-100 text-red-800 hover:bg-red-100' 
  },
  fulfilled: { 
    label: 'Fulfilled', 
    className: 'bg-green-100 text-green-800 hover:bg-green-100' 
  },
  cancelled: { 
    label: 'Cancelled', 
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' 
  },
  'low-stock': { 
    label: 'Low Stock', 
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' 
  },
  'out-of-stock': { 
    label: 'Out of Stock', 
    className: 'bg-red-100 text-red-800 hover:bg-red-100' 
  },
  'in-stock': { 
    label: 'In Stock', 
    className: 'bg-green-100 text-green-800 hover:bg-green-100' 
  },
  received: { 
    label: 'Received', 
    className: 'bg-green-100 text-green-800 hover:bg-green-100' 
  },
  ordered: { 
    label: 'Ordered', 
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' 
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="secondary" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};
