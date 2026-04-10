import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import useAppStore, { AppStoreProvider } from '@/stores/useAppStore'

import PublicLayout from './components/PublicLayout'
import DashboardLayout from './components/DashboardLayout'
import Index from './pages/Index'
import Login from './pages/auth/Login'
import PortabilidadePage from './pages/portabilidade/index'
import ClienteDashboard from './pages/dashboard/Cliente'
import AdminDashboard from './pages/dashboard/Admin'
import NotFound from './pages/NotFound'

const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode
  allowedRole?: string
}) => {
  const { user } = useAppStore()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />
  return <>{children}</>
}

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/portabilidade"
        element={
          <ProtectedRoute>
            <PortabilidadePage />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route element={<DashboardLayout />}>
      <Route
        path="/cliente"
        element={
          <ProtectedRoute allowedRole="client">
            <ClienteDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
)

const App = () => (
  <AppStoreProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </BrowserRouter>
  </AppStoreProvider>
)

export default App
