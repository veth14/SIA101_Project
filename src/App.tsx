import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { GuestLayout } from './components/layouts/GuestLayout'

// Import pages
import { LandingPage } from './pages/guest/landing/LandingPage'
import { BookingPage } from './pages/guest/BookingPage'
import { RoomsPage } from './pages/guest/RoomsPage'
import { AmenitiesPage } from './pages/guest/AmenitiesPage'
import { AuthPage } from './pages/auth/AuthPage'
import { NewProfilePage } from './pages/guest/NewProfilePage'
import { PaymentPage } from './pages/guest/PaymentPage'
import { MyBookingsPage } from './pages/guest/MyBookingsPage'
import { MyRequestsPage } from './pages/guest/MyRequests'
import { HelpCenterPage } from './pages/guest/HelpCenter/HelpCenterPage'
import { SubmitReviewPage } from './pages/guest/SubmitReviewPage'
import { AdminDashboardPage } from './pages/admin/Dashboard/AdminDashboardPage'
import AdminRoomsPage from './pages/admin/Front-Desk/AdminRoomsPage'
import { AdminLayout } from './layouts/AdminLayout'
import FrontDeskPage from './pages/admin/Front-Desk/frontdesk'
import AdminLostFoundPage from './pages/admin/Front-Desk/lostfoundpage'
import GuestServicesPage from './pages/admin/Front-Desk/GuestServicesPage'
import AdminInventoryItemsPage from './pages/admin/Inventory/invitems'
import AdminInventoryAnalyticsPage from './pages/admin/Inventory/invanalytics'
import AdminInventoryDashboardPage from './pages/admin/Inventory/invdashboard'
import AdminDepartmentsPage from './pages/admin/Inventory/invdepartments'
import AdminProcurementPage from './pages/admin/Inventory/procurement'
import AdminRequisitionsPage from './pages/admin/Inventory/requisitions'
import AdminSuppliersPage from './pages/admin/Inventory/suppliers'
import AdminIncomePage from './pages/admin/Finances/RevenuePage'
import AdminExpensePage from './pages/admin/Finances/ExpensesPage'
import AdminPayrollPage from './pages/admin/Finances/AdminPayrollPage'
import AdminReportsPage from './pages/admin/Finances/AdminReportsPage'
import AdminFinanceDashboardPage from './pages/admin/Finances/dashboardpage'
import AdminFinanceTransactionsPage from './pages/admin/Finances/transactionspage'
import AdminInvoicesPage from './pages/admin/Finances/InvoicesPage'
import AdminPaymentsPage from './pages/admin/Finances/PaymentsPage'
import AdminProfitAnalysisPage from './pages/admin/Finances/ProfitAnalysisPage'

// Import maintenance pages
import AdminMaintenanceOverviewPage from './pages/admin/Maintenance/maintenance-overview'
import AdminManageStaffPage from './pages/admin/Maintenance/manage-staff'
import AdminStaffSchedulesPage from './pages/admin/Maintenance/staff-schedules'
import AdminOnDutyStaffPage from './pages/admin/Maintenance/on-duty-staff'
import AdminTicketsTasksPage from './pages/admin/Maintenance/tickets-tasks'
import AdminArchivePage from './pages/admin/Maintenance/archive'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Guest routes with GuestLayout wrapper - eliminates Header/Footer duplication */}
          <Route path="/" element={<GuestLayout><LandingPage /></GuestLayout>} />
          <Route path="/rooms" element={<GuestLayout><RoomsPage /></GuestLayout>} />
          <Route path="/amenities" element={<GuestLayout><AmenitiesPage /></GuestLayout>} />
          
          {/* Consolidated Help Center routes - all render HelpCenterPage with URL-based tab selection */}
          <Route path="/help" element={<GuestLayout><HelpCenterPage /></GuestLayout>} />
          <Route path="/faqs" element={<GuestLayout><HelpCenterPage /></GuestLayout>} />
          <Route path="/privacy-policy" element={<GuestLayout><HelpCenterPage /></GuestLayout>} />
          <Route path="/terms-conditions" element={<GuestLayout><HelpCenterPage /></GuestLayout>} />
          <Route path="/contact" element={<GuestLayout><HelpCenterPage /></GuestLayout>} />
          <Route path="/about" element={<GuestLayout><HelpCenterPage /></GuestLayout>} />
          
          {/* Protected guest routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['guest']}>
                <GuestLayout><NewProfilePage /></GuestLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking"
            element={
              <ProtectedRoute allowedRoles={['guest']}>
                <GuestLayout><BookingPage /></GuestLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={['guest']}>
                <GuestLayout><PaymentPage /></GuestLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mybookings"
            element={
              <ProtectedRoute allowedRoles={['guest']}>
                <GuestLayout><MyBookingsPage /></GuestLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/myrequests"
            element={
              <ProtectedRoute allowedRoles={['guest']}>
                <GuestLayout><MyRequestsPage /></GuestLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit-review/:bookingId"
            element={
              <ProtectedRoute allowedRoles={['guest']}>
                <GuestLayout><SubmitReviewPage /></GuestLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Navigate to="/admin/dashboard" replace />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout>
                        <AdminDashboardPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/rooms" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminRoomsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/frontdesk" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <FrontDeskPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/lostfound" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLostFoundPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/guest-services" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <GuestServicesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminInventoryItemsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory/analytics" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminInventoryAnalyticsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminInventoryDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory/procurement" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminProcurementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory/requisitions" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminRequisitionsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory/suppliers" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminSuppliersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory/departments" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDepartmentsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/finances/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminFinanceDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/finances/transactions" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminFinanceTransactionsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/finances/invoices" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminInvoicesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/finances/payments" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPaymentsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/finances/profit-analysis" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminProfitAnalysisPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/income" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminIncomePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/expenses" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminExpensePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/payroll" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPayrollPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/reports" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminReportsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Maintenance Routes */}
                <Route 
                  path="/admin/maintenance" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminMaintenanceOverviewPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/manage-staff" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminManageStaffPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/staff-schedules" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminStaffSchedulesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/on-duty-staff" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminOnDutyStaffPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/tickets-tasks" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminTicketsTasksPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/archive" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminArchivePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    )
  }

  export default App
