import { Navigate, useLocation } from 'react-router-dom'
import useAppAuthHydration from '@/hooks/useAppAuthHydration'
import useAdminStore from '@/admin/store/useAdminStore'
import { AuthPageSkeleton } from '@/mall/components/PageSkeleton'

export default function AuthGuard({ children }) {
  const location = useLocation()
  const { hydrated, adminLoggedIn } = useAppAuthHydration()

  if (!hydrated) return <AuthPageSkeleton />

  if (!adminLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    )
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
