import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { normalizeRole } from '../utils/apiConfig'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />
  }

  const role = normalizeRole(user.role)
  if (!allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin" replace />
    if (role === 'staff') return <Navigate to="/staff" replace />
    return <Navigate to="/user" replace />
  }

  return children
}
