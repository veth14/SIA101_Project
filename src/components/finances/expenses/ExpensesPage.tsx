import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ExpenseList from '@/components/finances/expenses/ExpenseList';
import type { Expense } from '@/components/finances/expenses/types';
import ExpensesStats from '@/components/finances/expenses/ExpensesStats';
import ExpensesAnalytics from '@/components/finances/expenses/ExpensesAnalytics';
import { getCurrentPayrollTotal } from '@/services/payrollService';

import { subscribeToRequisitions, RequisitionRecord, updateRequisitionStatus } from '@/backend/requisitions/requisitionsService';
import { subscribeToPurchaseOrders, PurchaseOrderRecord, updatePurchaseOrderStatus } from '@/backend/purchaseOrders/purchaseOrdersService';
import { createNotification } from '@/backend/notifications/notificationsService';

export const ExpensesPage: React.FC = () => {
  // Base/manual expenses managed locally on this page (start empty; no hardcoded seed data)
  const [baseExpenses, setBaseExpenses] = useState<Expense[]>([]);

  // Derived expenses coming from requisitions and purchase orders
  const [requisitionExpenses, setRequisitionExpenses] = useState<Expense[]>([]);
  const [purchaseOrderExpenses, setPurchaseOrderExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type?: 'success' | 'error' | 'info' }>>([]);

  const handleExpenseSelect = (expense: Expense) => {
    setSelectedExpense(expense);
  };

  const toggleSelect = (id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (selected) next.add(id); else next.delete(id);
      return next;
    });
  };

  const selectAll = (ids: string[], select: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => (select ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500);
  };

  const updateStatus = useCallback((ids: string[], status: Expense['status']) => {
    if (ids.length === 0) return;

    // Sync status back to requisitions / purchase orders in Firestore when applicable
    ids.forEach((rawId) => {
      if (rawId.startsWith('REQ-')) {
        const sourceId = rawId.replace(/^REQ-/, '');
        let backendStatus: RequisitionRecord['status'];
        let title = '';
        if (status === 'approved') {
          backendStatus = 'approved';
          title = 'Requisition approved';
        } else if (status === 'paid') {
          backendStatus = 'fulfilled';
          title = 'Requisition fulfilled';
        } else if (status === 'rejected') {
          backendStatus = 'rejected';
          title = 'Requisition rejected';
        } else {
          backendStatus = 'pending';
          title = 'Requisition updated';
        }
        void updateRequisitionStatus(sourceId, backendStatus);
        void createNotification({
          type: 'requisition',
          title,
          message: rawId,
          sourceId,
        });
      } else if (rawId.startsWith('PO-')) {
        const sourceId = rawId.replace(/^PO-/, '');
        let backendStatus: PurchaseOrderRecord['status'];
        let title = '';
        if (status === 'approved') {
          backendStatus = 'approved';
          title = 'Purchase order approved';
        } else if (status === 'paid') {
          backendStatus = 'received';
          title = 'Purchase order received';
        } else if (status === 'rejected') {
          backendStatus = 'cancelled';
          title = 'Purchase order cancelled';
        } else {
          backendStatus = 'pending';
          title = 'Purchase order updated';
        }
        void updatePurchaseOrderStatus(sourceId, backendStatus);
        void createNotification({
          type: 'purchaseOrder',
          title,
          message: rawId,
          sourceId,
        });
      }
    });

    // Only mutate base/manual expenses; requisitions and purchase orders are
    // driven by Firestore subscriptions.
    setBaseExpenses(prev => prev.map(e => (ids.includes(e.id) ? { ...e, status } : e)));

    // Update selectedExpense if it is a base expense whose status changed
    setSelectedExpense(prev => (prev && ids.includes(prev.id) ? { ...prev, status } : prev));
    addToast(`${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Marked as Paid'} ${ids.length} item${ids.length > 1 ? 's' : ''}`);
    // Clear selection after action
    setSelectedIds(new Set());
  }, []);

  const handleApprove = useCallback((ids: string[] | string) => updateStatus(Array.isArray(ids) ? ids : [ids], 'approved'), [updateStatus]);
  const handleReject = useCallback((ids: string[] | string) => updateStatus(Array.isArray(ids) ? ids : [ids], 'rejected'), [updateStatus]);
  const handleMarkPaid = useCallback((ids: string[] | string) => updateStatus(Array.isArray(ids) ? ids : [ids], 'paid'), [updateStatus]);

  // Keyboard shortcuts for currently selected expense or selection set
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return; // avoid interfering with inputs
      if (selectedIds.size > 0) {
        if (e.key.toLowerCase() === 'a') handleApprove(Array.from(selectedIds));
        if (e.key.toLowerCase() === 'r') handleReject(Array.from(selectedIds));
        if (e.key.toLowerCase() === 'p') handleMarkPaid(Array.from(selectedIds));
      } else if (selectedExpense) {
        if (e.key.toLowerCase() === 'a') handleApprove(selectedExpense.id);
        if (e.key.toLowerCase() === 'r') handleReject(selectedExpense.id);
        if (e.key.toLowerCase() === 'p') handleMarkPaid(selectedExpense.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIds, selectedExpense, handleApprove, handleReject, handleMarkPaid]);

  // Map requisitions to Expense rows for this view
  const mapRequisitionToExpense = (req: RequisitionRecord): Expense => {
    const rawStatus = (req.status || '').toString().toLowerCase();
    let status: Expense['status'];
    if (rawStatus === 'approved') status = 'approved';
    else if (rawStatus === 'fulfilled') status = 'paid';
    else if (rawStatus === 'rejected') status = 'rejected';
    else status = 'pending';

    const dateSource = req.approvedDate || req.requiredDate || req.requestDate;
    let date = '';
    if (dateSource) {
      const d = new Date(dateSource);
      if (!Number.isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        date = `${year}-${month}-${day}`;
      }
    }

    return {
      id: `REQ-${req.id || req.requestNumber}`,
      description: `Requisition ${req.requestNumber} - ${req.department}`,
      category: 'supplies',
      amount: typeof req.totalEstimatedCost === 'number' ? req.totalEstimatedCost : 0,
      vendor: req.department || 'Internal Department',
      date,
      status,
      submittedBy: req.requestedBy || 'Unknown',
      approvedBy: req.approvedBy,
      purchaseOrder: undefined,
      invoiceNumber: undefined,
    };
  };

  // Map purchase orders to Expense rows for this view
  const mapPurchaseOrderToExpense = (po: PurchaseOrderRecord): Expense => {
    const rawStatus = (po.status || '').toString().toLowerCase();
    let status: Expense['status'];
    if (rawStatus === 'approved') status = 'approved';
    else if (rawStatus === 'received') status = 'paid';
    else if (rawStatus === 'cancelled') status = 'rejected';
    else status = 'pending';

    const dateSource = po.approvedDate || po.expectedDelivery || po.orderDate;
    let date = '';
    if (dateSource) {
      const d = new Date(dateSource);
      if (!Number.isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        date = `${year}-${month}-${day}`;
      }
    }

    return {
      id: `PO-${po.id || po.orderNumber}`,
      description: `PO ${po.orderNumber} - ${po.supplier}`,
      category: 'supplies',
      amount: typeof po.totalAmount === 'number' ? po.totalAmount : 0,
      vendor: po.supplier || 'Supplier',
      date,
      status,
      submittedBy: po.approvedBy || 'Purchasing',
      approvedBy: po.approvedBy,
      purchaseOrder: po.orderNumber,
      invoiceNumber: undefined,
    };
  };

  // Subscribe to requisitions from Firestore and project into expenses
  useEffect(() => {
    const unsubscribe = subscribeToRequisitions(
      (requisitions) => {
        try {
          const relevant = requisitions.filter((req) => {
            const s = (req.status || '').toString().toLowerCase();
            return s === 'approved' || s === 'fulfilled' || s === 'pending' || s === 'rejected';
          });
          const mapped = relevant.map(mapRequisitionToExpense);
          setRequisitionExpenses(mapped);
        } catch (error) {
          console.error('Error mapping requisitions to expenses:', error);
          setRequisitionExpenses([]);
        }
      },
      (error) => {
        console.error('Error loading requisitions for expenses view:', error);
        setRequisitionExpenses([]);
      }
    );

    return unsubscribe;
  }, []);

  // Subscribe to purchase orders from Firestore and project into expenses
  useEffect(() => {
    const unsubscribe = subscribeToPurchaseOrders(
      (orders) => {
        try {
          const relevant = orders.filter((po) => {
            const s = (po.status || '').toString().toLowerCase();
            return s === 'approved' || s === 'received' || s === 'pending' || s === 'cancelled';
          });
          const mapped = relevant.map(mapPurchaseOrderToExpense);
          setPurchaseOrderExpenses(mapped);
        } catch (error) {
          console.error('Error mapping purchase orders to expenses:', error);
          setPurchaseOrderExpenses([]);
        }
      },
      (error) => {
        console.error('Error loading purchase orders for expenses view:', error);
        setPurchaseOrderExpenses([]);
      }
    );

    return unsubscribe;
  }, []);

  // Combined list used for stats, analytics, and the main table
  const allExpenses = useMemo<Expense[]>(
    () => [
      ...baseExpenses,
      ...requisitionExpenses,
      ...purchaseOrderExpenses,
    ],
    [baseExpenses, requisitionExpenses, purchaseOrderExpenses]
  );

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full px-2 py-4 space-y-6 sm:px-4 lg:px-6">
        
  {/* Stats Section */}
  <ExpensesStats expenses={allExpenses} />

  {/* Category Breakdown Analytics */}
  <ExpensesAnalytics expenses={allExpenses} staffFromPayroll={getCurrentPayrollTotal()} />

        {/* Expense List - Full Width */}
        <div className="w-full">
          <ExpenseList 
            expenses={allExpenses}
            onExpenseSelect={handleExpenseSelect}
            selectedExpense={selectedExpense}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onApprove={(ids) => handleApprove(ids)}
            onReject={(ids) => handleReject(ids)}
            onMarkPaid={(ids) => handleMarkPaid(ids)}
          />
        </div>

        {/* Toasts */}
        <div className="fixed z-50 space-y-2 bottom-6 right-6">
          {toasts.map(t => (
            <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-sm text-white ${
              t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-700'
            }`}>
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;