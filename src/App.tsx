import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppStoreProvider } from '@/stores/useAppStore'

import PublicLayout from './components/PublicLayout'
import DashboardLayout from './components/DashboardLayout'
import Index from './pages/Index'
import Login from './pages/auth/Login'
import PortabilidadePage from './pages/portabilidade/index'
import ClienteDashboard from './pages/dashboard/Cliente'
import AdminDashboard from './pages/dashboard/Admin'
import NotFound from './pages/NotFound'

const App = () => (
  <AppStoreProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/portabilidade" element={<PortabilidadePage />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/cliente" element={<ClienteDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppStoreProvider>
)

export default App
