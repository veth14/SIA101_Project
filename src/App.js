import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { GuestLayout } from './components/layouts/GuestLayout';
// Import pages
import { LandingPage } from './pages/guest/landing/LandingPage';
import { BookingPage } from './pages/guest/BookingPage';
import { RoomsPage } from './pages/guest/RoomsPage';
import { AmenitiesPage } from './pages/guest/AmenitiesPage';
import { AuthPage } from './pages/auth/AuthPage';
import { NewProfilePage } from './pages/guest/NewProfilePage';
import { PaymentPage } from './pages/guest/PaymentPage';
import { MyBookingsPage } from './pages/guest/MyBookingsPage';
import { MyRequestsPage } from './pages/guest/MyRequests';
import { HelpCenterPage } from './pages/guest/HelpCenter/HelpCenterPage';
import { SubmitReviewPage } from './pages/guest/SubmitReviewPage';
import { AdminDashboardPage } from './pages/admin/Dashboard/AdminDashboardPage';
import AdminRoomsPage from './pages/admin/Front-Desk/AdminRoomsPage';
import { AdminLayout } from './layouts/AdminLayout';
import FrontDeskPage from './pages/admin/Front-Desk/frontdesk';
import AdminLostFoundPage from './pages/admin/Front-Desk/lostfoundpage';
import GuestServicesPage from './pages/admin/Front-Desk/GuestServicesPage';
import AdminInventoryItemsPage from './pages/admin/Inventory/invitems';
import AdminInventoryAnalyticsPage from './pages/admin/Inventory/invanalytics';
import AdminInventoryDashboardPage from './pages/admin/Inventory/invdashboard';
import AdminDepartmentsPage from './pages/admin/Inventory/invdepartments';
import AdminProcurementPage from './pages/admin/Inventory/procurement';
import AdminRequisitionsPage from './pages/admin/Inventory/requisitions';
import AdminSuppliersPage from './pages/admin/Inventory/suppliers';
import AdminIncomePage from './pages/admin/Finances/RevenuePage';
import AdminExpensePage from './pages/admin/Finances/ExpensesPage';
import AdminPayrollPage from './pages/admin/Finances/AdminPayrollPage';
import AdminReportsPage from './pages/admin/Finances/AdminReportsPage';
import AdminFinanceDashboardPage from './pages/admin/Finances/dashboardpage';
import AdminFinanceTransactionsPage from './pages/admin/Finances/transactionspage';
import AdminInvoicesPage from './pages/admin/Finances/InvoicesPage';
import AdminPaymentsPage from './pages/admin/Finances/PaymentsPage';
import AdminProfitAnalysisPage from './pages/admin/Finances/ProfitAnalysisPage';
// Import maintenance pages
import AdminMaintenanceOverviewPage from './pages/admin/Maintenance/maintenance-overview';
import AdminManageStaffPage from './pages/admin/Maintenance/manage-staff';
import AdminStaffSchedulesPage from './pages/admin/Maintenance/staff-schedules';
import AdminOnDutyStaffPage from './pages/admin/Maintenance/on-duty-staff';
import AdminTicketsTasksPage from './pages/admin/Maintenance/tickets-tasks';
import AdminArchivePage from './pages/admin/Maintenance/archive';
function LoadingSpinner() {
    return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600" }) }));
}
function App() {
    return (_jsx(AuthProvider, { children: _jsx(Suspense, { fallback: _jsx(LoadingSpinner, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Navigate, { to: "/auth", replace: true }) }), _jsx(Route, { path: "/auth", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/", element: _jsx(GuestLayout, { children: _jsx(LandingPage, {}) }) }), _jsx(Route, { path: "/rooms", element: _jsx(GuestLayout, { children: _jsx(RoomsPage, {}) }) }), _jsx(Route, { path: "/amenities", element: _jsx(GuestLayout, { children: _jsx(AmenitiesPage, {}) }) }), _jsx(Route, { path: "/help", element: _jsx(GuestLayout, { children: _jsx(HelpCenterPage, {}) }) }), _jsx(Route, { path: "/faqs", element: _jsx(GuestLayout, { children: _jsx(HelpCenterPage, {}) }) }), _jsx(Route, { path: "/privacy-policy", element: _jsx(GuestLayout, { children: _jsx(HelpCenterPage, {}) }) }), _jsx(Route, { path: "/terms-conditions", element: _jsx(GuestLayout, { children: _jsx(HelpCenterPage, {}) }) }), _jsx(Route, { path: "/contact", element: _jsx(GuestLayout, { children: _jsx(HelpCenterPage, {}) }) }), _jsx(Route, { path: "/about", element: _jsx(GuestLayout, { children: _jsx(HelpCenterPage, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { allowedRoles: ['guest'], children: _jsx(GuestLayout, { children: _jsx(NewProfilePage, {}) }) }) }), _jsx(Route, { path: "/booking", element: _jsx(ProtectedRoute, { allowedRoles: ['guest'], children: _jsx(GuestLayout, { children: _jsx(BookingPage, {}) }) }) }), _jsx(Route, { path: "/payment", element: _jsx(ProtectedRoute, { allowedRoles: ['guest'], children: _jsx(GuestLayout, { children: _jsx(PaymentPage, {}) }) }) }), _jsx(Route, { path: "/mybookings", element: _jsx(ProtectedRoute, { allowedRoles: ['guest'], children: _jsx(GuestLayout, { children: _jsx(MyBookingsPage, {}) }) }) }), _jsx(Route, { path: "/myrequests", element: _jsx(ProtectedRoute, { allowedRoles: ['guest'], children: _jsx(GuestLayout, { children: _jsx(MyRequestsPage, {}) }) }) }), _jsx(Route, { path: "/submit-review/:bookingId", element: _jsx(ProtectedRoute, { allowedRoles: ['guest'], children: _jsx(GuestLayout, { children: _jsx(SubmitReviewPage, {}) }) }) }), _jsx(Route, { path: "/admin", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(Navigate, { to: "/admin/dashboard", replace: true }) }) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminLayout, { children: _jsx(AdminDashboardPage, {}) }) }) }), _jsx(Route, { path: "/admin/rooms", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminRoomsPage, {}) }) }), _jsx(Route, { path: "/admin/frontdesk", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(FrontDeskPage, {}) }) }), _jsx(Route, { path: "/admin/lostfound", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminLostFoundPage, {}) }) }), _jsx(Route, { path: "/admin/guest-services", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(GuestServicesPage, {}) }) }), _jsx(Route, { path: "/admin/inventory", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminInventoryItemsPage, {}) }) }), _jsx(Route, { path: "/admin/inventory/analytics", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminInventoryAnalyticsPage, {}) }) }), _jsx(Route, { path: "/admin/inventory/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminInventoryDashboardPage, {}) }) }), _jsx(Route, { path: "/admin/inventory/procurement", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminProcurementPage, {}) }) }), _jsx(Route, { path: "/admin/inventory/requisitions", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminRequisitionsPage, {}) }) }), _jsx(Route, { path: "/admin/inventory/suppliers", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminSuppliersPage, {}) }) }), _jsx(Route, { path: "/admin/inventory/departments", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminDepartmentsPage, {}) }) }), _jsx(Route, { path: "/admin/finances/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminFinanceDashboardPage, {}) }) }), _jsx(Route, { path: "/admin/finances/transactions", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminFinanceTransactionsPage, {}) }) }), _jsx(Route, { path: "/admin/finances/invoices", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminInvoicesPage, {}) }) }), _jsx(Route, { path: "/admin/finances/payments", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminPaymentsPage, {}) }) }), _jsx(Route, { path: "/admin/finances/profit-analysis", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminProfitAnalysisPage, {}) }) }), _jsx(Route, { path: "/admin/income", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminIncomePage, {}) }) }), _jsx(Route, { path: "/admin/expenses", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminExpensePage, {}) }) }), _jsx(Route, { path: "/admin/payroll", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminPayrollPage, {}) }) }), _jsx(Route, { path: "/admin/reports", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminReportsPage, {}) }) }), _jsx(Route, { path: "/admin/maintenance", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminMaintenanceOverviewPage, {}) }) }), _jsx(Route, { path: "/admin/manage-staff", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminManageStaffPage, {}) }) }), _jsx(Route, { path: "/admin/staff-schedules", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminStaffSchedulesPage, {}) }) }), _jsx(Route, { path: "/admin/on-duty-staff", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminOnDutyStaffPage, {}) }) }), _jsx(Route, { path: "/admin/tickets-tasks", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminTicketsTasksPage, {}) }) }), _jsx(Route, { path: "/admin/archive", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminArchivePage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
export default App;
