import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Clock } from 'lucide-react';
import { subscribeToRequisitions, type RequisitionRecord } from '../../../backend/requisitions/requisitionsService';
import { subscribeToPurchaseOrders, type PurchaseOrderRecord } from '../../../backend/purchaseOrders/purchaseOrdersService';

interface Activity {
  id: string;
  type: 'approved' | 'submitted' | 'delivered' | 'replenished';
  title: string;
  code: string;
  department: string;
  timestamp: string;
}

interface InternalActivity {
  id: string;
  type: Activity['type'];
  title: string;
  code: string;
  department: string;
  timestamp: Date;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'approved':
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case 'submitted':
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    case 'delivered':
      return (
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      );
    case 'replenished':
      return (
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      );
    default:
      return null;
  }
};

export const DashboardActivity: React.FC = () => {
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]);

  useEffect(() => {
    const unsubscribeReq = subscribeToRequisitions((loaded) => {
      setRequisitions(loaded || []);
    });
    const unsubscribePo = subscribeToPurchaseOrders((loaded) => {
      setPurchaseOrders(loaded || []);
    });
    return () => {
      unsubscribeReq();
      unsubscribePo();
    };
  }, []);

  const formatRelativeTime = (date: Date): string => {
    const now = new Date().getTime();
    const diffMs = now - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    }
    if (diffHr > 0) {
      return diffHr === 1 ? '1 hour ago' : `${diffHr} hours ago`;
    }
    if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    }
    return 'Just now';
  };

  const activities: Activity[] = useMemo(() => {
    const items: InternalActivity[] = [];

    requisitions.forEach((req) => {
      const rawStatus = (req.status || '').toString().toLowerCase();
      const createdAt = req.createdAt || (req.requestDate ? new Date(req.requestDate) : new Date());
      const dept = req.department || 'Requisition';
      const code = req.requestNumber || req.id || 'REQ';

      if (rawStatus === 'submitted' || rawStatus === 'pending') {
        items.push({
          id: `req-submitted-${code}`,
          type: 'submitted',
          title: 'Requisition submitted',
          code,
          department: dept,
          timestamp: createdAt,
        });
      }

      if (rawStatus === 'approved' || rawStatus === 'fulfilled') {
        const ts = req.approvedDate ? new Date(req.approvedDate) : createdAt;
        items.push({
          id: `req-approved-${code}`,
          type: 'approved',
          title: 'Requisition approved',
          code,
          department: dept,
          timestamp: ts,
        });
      }
    });

    purchaseOrders.forEach((po) => {
      const rawStatus = (po.status || '').toString().toLowerCase();
      const createdAt = po.createdAt || (po.orderDate ? new Date(po.orderDate) : new Date());
      const dept = po.supplier || 'Purchase Order';
      const code = po.orderNumber || po.id || 'PO';

      if (rawStatus === 'approved') {
        const ts = po.approvedDate ? new Date(po.approvedDate) : createdAt;
        items.push({
          id: `po-approved-${code}`,
          type: 'approved',
          title: 'Purchase order approved',
          code,
          department: dept,
          timestamp: ts,
        });
      }

      if (rawStatus === 'received' || rawStatus === 'delivered') {
        const ts = createdAt;
        items.push({
          id: `po-delivered-${code}`,
          type: 'delivered',
          title: 'Order delivered',
          code,
          department: dept,
          timestamp: ts,
        });
      }
    });

    items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const capped = items.slice(0, 5);

    return capped.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      code: item.code,
      department: item.department,
      timestamp: formatRelativeTime(item.timestamp),
    }));
  }, [requisitions, purchaseOrders]);

  return (
    <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in min-h-[320px]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-heritage-green/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <Bell className="w-6 h-6 text-[#82A33D]" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Recent Procurement Activities
                </h3>
                <p className="text-sm font-semibold text-gray-600 mt-1 flex items-center gap-2">
                  <span>Latest inventory and procurement updates</span>
                  <span className="w-1 h-1 bg-heritage-green rounded-full inline-block"></span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="relative z-10 px-8 py-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getActivityIcon(activity.type)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <span className="text-xs text-gray-500">
                          {activity.code} • {activity.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};