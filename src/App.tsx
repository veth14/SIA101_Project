import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Import pages
import { LandingPage } from './pages/guest/landing/LandingPage'
import { BookingPage } from './pages/guest/BookingPage'
import { PaymentPage } from './pages/guest/PaymentPage'
import { RoomsPage } from './pages/guest/RoomsPage'
import { LoginPage } from './pages/auth/LoginPage'
import { AuthPage } from './pages/auth/AuthPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage'

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<><Header /><LandingPage /><Footer /></>} />
            <Route path="/rooms" element={<><Header /><RoomsPage /><Footer /></>} />
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
                      <AdminDashboardPage />
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
                <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    )
  }

  export default App
