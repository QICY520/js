import { Navigate, useLocation } from 'react-router-dom'
import useAdminStore from '@/admin/store/useAdminStore'

export default function AuthGuard({ children }) {
  const location = useLocation()
  const loggedIn = useAdminStore((s) => !!s.token && !!s.user)

  if (!loggedIn) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return children
}

export function PermissionGuard({ permission, children }) {
  const hasPermission = useAdminStore((s) => s.hasPermission)

  if (!hasPermission(permission)) {
    return <Navigate to="/admin/forbidden" replace />
  }

  return children
}
