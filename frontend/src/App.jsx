import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LayoutDashboard, ParkingCircle, Ticket, Shield, ClipboardCheck, IndianRupee, BarChart3, Users } from 'lucide-react'
import { ThemeProvider } from './hooks/useTheme'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ParkingSystemProvider } from './hooks/useParkingSystem'
import ProtectedRoute from './components/ProtectedRoute'
import RoleDashboardLayout from './components/RoleDashboardLayout'
import LoginPage from './pages/LoginPage'
import UserOverview from './pages/UserOverview'
import UserBookSlot from './pages/UserBookSlot'
import UserBookings from './pages/UserBookings'
import StaffOverview from './pages/StaffOverview'
import StaffOperations from './pages/StaffOperations'
import AdminOverview from './pages/AdminOverview'
import AdminSlots from './pages/AdminSlots'
import AdminPricing from './pages/AdminPricing'
import AdminStaffs from './pages/AdminStaffs'

const USER_NAV = [
  { icon: LayoutDashboard, label: 'Overview', to: '/user', exact: true },
  { icon: ParkingCircle, label: 'Book Slot', to: '/user/book-slot' },
  { icon: Ticket, label: 'My Bookings', to: '/user/bookings' },
]

const STAFF_NAV = [
  { icon: LayoutDashboard, label: 'Overview', to: '/staff', exact: true },
  { icon: ClipboardCheck, label: 'Operations', to: '/staff/operations' },
]

const ADMIN_NAV = [
  { icon: Shield, label: 'Overview', to: '/admin', exact: true },
  { icon: BarChart3, label: 'Slot Management', to: '/admin/slots' },
  { icon: Users, label: 'Staff Management', to: '/admin/staff' },
  { icon: IndianRupee, label: 'Pricing & Revenue', to: '/admin/pricing' },
]

function AdminGate() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <LoginPage adminOnly />
  }

  return <RoleDashboardLayout title="Admin Panel" navItems={ADMIN_NAV} />
}

function StaffGate() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user || user.role !== 'staff') {
    return <LoginPage staffOnly />
  }

  return <RoleDashboardLayout title="Parking Staff Panel" navItems={STAFF_NAV} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ParkingSystemProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                borderRadius: '12px',
                padding: '12px 16px',
              },
            }}
          />

          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <RoleDashboardLayout title="User Panel" navItems={USER_NAV} />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserOverview />} />
              <Route path="book-slot" element={<UserBookSlot />} />
              <Route path="bookings" element={<UserBookings />} />
            </Route>

            <Route path="/staff" element={<StaffGate />}>
              <Route index element={<StaffOverview />} />
              <Route path="operations" element={<StaffOperations />} />
            </Route>

            <Route path="/admin" element={<AdminGate />}>
              <Route index element={<AdminOverview />} />
              <Route path="slots" element={<AdminSlots />} />
              <Route path="staff" element={<AdminStaffs />} />
              <Route path="pricing" element={<AdminPricing />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ParkingSystemProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
