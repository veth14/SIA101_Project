import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Import pages
import { LandingPage } from './pages/guest/landing/LandingPage'
import { BookingPage } from './pages/guest/BookingPage'
import { RoomsPage } from './pages/guest/RoomsPage'
import { AmenitiesPage } from './pages/guest/AmenitiesPage'
import { AuthPage } from './pages/auth/AuthPage'
import { NewProfilePage } from './pages/guest/NewProfilePage'
import { PaymentPage } from './pages/guest/PaymentPage'
import { AdminDashboardPage } from './pages/admin/Dashboard/AdminDashboardPage'
import AdminRoomsPage from './pages/admin/Front-Desk/AdminRoomsPage'
import { AdminLayout } from './layouts/AdminLayout'
import FrontDeskPage from './pages/admin/Front-Desk/frontdesk'
import AdminLostFoundPage from './pages/admin/Front-Desk/lostfoundpage'
import AdminInventoryItemsPage from './pages/admin/Inventory/invitems'
import AdminInventoryAnalyticsPage from './pages/admin/Inventory/invanalytics'
import AdminInventoryDashboardPage from './pages/admin/Inventory/invdashboard'
import AdminDepartmentsPage from './pages/admin/Inventory/invdepartments'
import AdminProcurementPage from './pages/admin/Inventory/procurement'
import AdminRequisitionsPage from './pages/admin/Inventory/requisitions'
import AdminSuppliersPage from './pages/admin/Inventory/suppliers'
import AdminIncomePage from './pages/admin/Finances/incomepage'
import AdminExpensePage from './pages/admin/Finances/expensepage'
import AdminPayrollPage from './pages/admin/Finances/payrollpage'
import AdminReportsPage from './pages/admin/Finances/reportspage'

// Import maintenance pages
import AdminMaintenanceOverviewPage from './pages/admin/Maintenance/maintenance-overview'
import AdminManageStaffPage from './pages/admin/Maintenance/manage-staff'
import AdminStaffSchedulesPage from './pages/admin/Maintenance/staff-schedules'
import AdminOnDutyStaffPage from './pages/admin/Maintenance/on-duty-staff'
import AdminTicketsTasksPage from './pages/admin/Maintenance/tickets-tasks'
import AdminArchivePage from './pages/admin/Maintenance/archive'

// Import shared components
import { Header } from './components/shared/navigation/Header'
import { Footer } from './components/shared/navigation/Footer'

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
            <Route path="/" element={<><Header /><LandingPage /><Footer /></>} />
            <Route path="/rooms" element={<><Header /><RoomsPage /><Footer /></>} />
            <Route path="/amenities" element={<><Header /><AmenitiesPage /><Footer /></>} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['guest']}>
                  <><Header /><NewProfilePage /><Footer /></>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute allowedRoles={['guest']}>
                  <><Header /><BookingPage /><Footer /></>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment/:bookingId" 
              element={
                <ProtectedRoute allowedRoles={['guest']}>
                  <><Header /><PaymentPage /><Footer /></>
                </ProtectedRoute>
              } 
            />
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
