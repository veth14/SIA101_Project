import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CreditCard, ArrowLeft, Bell, Clock, User } from 'lucide-react';
import { formatCurrencyPH } from '../../../lib/utils';
import { subscribeToInvoices, type InvoiceRecord } from '../../../backend/invoices/invoicesService';
import { subscribeToRequisitions, type RequisitionRecord } from '../../../backend/requisitions/requisitionsService';
import { subscribeToPurchaseOrders, type PurchaseOrderRecord } from '../../../backend/purchaseOrders/purchaseOrdersService';

type ActivityKind = 'invoice_created' | 'invoice_paid' | 'requisition_approved' | 'po_received';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: ActivityKind;
  amount?: number;
  room: string;
  actor: string;
}

const RecentActivities: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToInvoices(
      (records) => {
        setInvoices(records);
      },
      (error) => {
        console.error('Error loading invoices for recent activities:', error);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToRequisitions(
      (loaded) => {
        setRequisitions(loaded);
      },
      (error) => {
        console.error('Error loading requisitions for recent activities:', error);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPurchaseOrders(
      (loaded) => {
        setPurchaseOrders(loaded);
      },
      (error) => {
        console.error('Error loading purchase orders for recent activities:', error);
      }
    );
    return unsubscribe;
  }, []);

  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    // Invoices: created & paid
    invoices.forEach((inv) => {
      const createdAt = inv.createdAt || (inv.transactionDate ? new Date(inv.transactionDate) : undefined) || new Date();
      const customer = inv.customerName || 'Guest';
      const amount = typeof inv.total === 'number' ? inv.total : 0;

      items.push({
        id: `inv-created-${inv.id}`,
        title: `Invoice ${inv.invoiceNumber} created`,
        description: `${customer} • ${formatCurrencyPH(amount)}`,
        timestamp: createdAt,
        type: 'invoice_created',
        amount,
        room: inv.transactionCategory || 'Invoice',
        actor: customer,
      });

      const rawStatus = (inv.status || '').toString().toLowerCase();
      if (rawStatus === 'paid' || rawStatus === 'completed') {
        items.push({
          id: `inv-paid-${inv.id}`,
          title: `Payment recorded for ${inv.invoiceNumber}`,
          description: `${customer} • ${formatCurrencyPH(amount)}`,
          timestamp: createdAt,
          type: 'invoice_paid',
          amount,
          room: inv.transactionCategory || 'Payment',
          actor: customer,
        });
      }
    });

    // Requisitions: approved / fulfilled
    requisitions.forEach((req) => {
      const rawStatus = (req.status || '').toString().toLowerCase();
      if (rawStatus === 'approved' || rawStatus === 'fulfilled') {
        const ts = req.approvedDate ? new Date(req.approvedDate) : req.createdAt || new Date();
        const amount = typeof req.totalEstimatedCost === 'number' ? req.totalEstimatedCost : 0;
        items.push({
          id: `req-${req.id}`,
          title: `Requisition ${req.requestNumber} approved`,
          description: `${req.department} • ${formatCurrencyPH(amount)}`,
          timestamp: ts,
          type: 'requisition_approved',
          amount,
          room: req.department || 'Requisition',
          actor: req.approvedBy || req.requestedBy || 'Staff',
        });
      }
    });

    // Purchase orders: approved / received
    purchaseOrders.forEach((po) => {
      const rawStatus = (po.status || '').toString().toLowerCase();
      if (rawStatus === 'approved' || rawStatus === 'received') {
        const ts = po.approvedDate ? new Date(po.approvedDate) : po.createdAt || new Date();
        const amount = typeof po.totalAmount === 'number' ? po.totalAmount : 0;
        items.push({
          id: `po-${po.id}`,
          title: `PO ${po.orderNumber} ${rawStatus === 'received' ? 'received' : 'approved'}`,
          description: `${po.supplier} • ${formatCurrencyPH(amount)}`,
          timestamp: ts,
          type: 'po_received',
          amount,
          room: po.supplier || 'Purchase Order',
          actor: po.approvedBy || 'Purchasing',
        });
      }
    });

    // Sort newest first and cap list to 5 activities
    items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return items.slice(0, 5);
  }, [invoices, requisitions, purchaseOrders]);

  const activitiesToday = useMemo(() => {
    if (!activities.length) return 0;
    const today = new Date();
    const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return activities.filter((a) => a.timestamp >= dayStart && a.timestamp < dayEnd).length;
  }, [activities]);

  return (
    <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in min-h-[360px]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Recent Activities
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Key financial events</p>
                  <div className="w-1 h-1 bg-heritage-green rounded-full"></div>
                  <span className="text-sm font-bold text-heritage-green">
                    {activitiesToday} activit{activitiesToday === 1 ? 'y' : 'ies'} today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="px-8 py-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Activity Type Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activity.type === 'invoice_created' ? 'bg-blue-100' :
                      activity.type === 'invoice_paid' ? 'bg-green-100' :
                      activity.type === 'requisition_approved' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      {activity.type === 'invoice_created' && <Calendar className="w-6 h-6 text-blue-600" />}
                      {activity.type === 'invoice_paid' && <CreditCard className="w-6 h-6 text-green-600" />}
                      {activity.type === 'requisition_approved' && <User className="w-6 h-6 text-purple-600" />}
                      {activity.type === 'po_received' && <Bell className="w-6 h-6 text-orange-600" />}
                    </div>
                    
                    {/* Activity Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm font-medium text-heritage-green">{activity.room}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{activity.description}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount and User */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {typeof activity.amount === 'number' && (
                        <div className="text-lg font-bold text-heritage-green">
                          {formatCurrencyPH(activity.amount)}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {activity.timestamp.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    {/* User Avatar */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm text-gray-700 font-medium">
                        {activity.actor.charAt(0)}
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

export default RecentActivities;