  import { Suspense } from 'react'
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
  import { AuthProvider } from './contexts/AuthContext'
  import { ProtectedRoute } from './components/auth/ProtectedRoute'

  // Import components
  import { LoginPage } from './pages/auth/LoginPage'
  import { GuestLayout } from './layouts/GuestLayout'
  import { AdminLayout } from './layouts/AdminLayout'
  import { LandingPage } from './pages/guest/landing/LandingPage'
  import { BookingPage } from './pages/guest/BookingPage'
  import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
  import { AdminRoomsPage } from './pages/admin/AdminRoomsPage'

  function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600" />
      </div>
    )
  }

  function App() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<GuestLayout><LandingPage /></GuestLayout>} />
              <Route path="/booking" element={<GuestLayout><BookingPage /></GuestLayout>} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout>
                        <Navigate to="/admin/dashboard" replace />
                      </AdminLayout>
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
        </AuthProvider>
      </BrowserRouter>
    )
  }

  export default App
