import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Import pages
import { LandingPage } from './pages/guest/landing/LandingPage'
import { BookingPage } from './pages/guest/BookingPage'
import { PaymentPage } from './pages/guest/PaymentPage'
import { RoomsPage } from './pages/guest/RoomsPage'
import { AmenitiesPage } from './pages/guest/AmenitiesPage'
import { AuthPage } from './pages/auth/AuthPage'
import { NewProfilePage } from './pages/guest/NewProfilePage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage'
import { AdminLayout } from './layouts/AdminLayout'
import { ReservationsPage } from './components/frontdesk/ReservationsPage'
import { ItemsPage } from './components/inventory/ItemsPage'
import { TransactionsPage } from './components/inventory/TransactionsPage'
import { StaffPage } from './components/staff/StaffPage'
import AdminIncomePage from './pages/admin/incomepage'
import AdminExpensePage from './pages/admin/expensepage'
import AdminPayrollPage from './pages/admin/payrollpage'
import AdminReportsPage from './pages/admin/reportspage'

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
                      <AdminLayout>
                        <AdminRoomsPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/frontdesk" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout>
                        <ReservationsPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout>
                        <ItemsPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/transactions" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout>
                        <TransactionsPage />
                      </AdminLayout>
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
                <Route 
                  path="/admin/staff" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout>
                        <StaffPage />
                      </AdminLayout>
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
