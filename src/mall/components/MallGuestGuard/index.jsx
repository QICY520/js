import { Navigate, useLocation } from 'react-router-dom'
import useAppAuthHydration from '@/hooks/useAppAuthHydration'
import { AuthPageSkeleton } from '@/mall/components/PageSkeleton'

/** 登录/注册页：已登录则按角色跳转 */
export default function MallGuestGuard({ children }) {
  const location = useLocation()
  const { hydrated, mallLoggedIn, adminLoggedIn } = useAppAuthHydration()

  if (!hydrated) return <AuthPageSkeleton />

  if (adminLoggedIn && !mallLoggedIn) {
    const from = location.state?.from
    const adminTarget =
      from && from.startsWith('/admin') && from !== '/admin/forbidden' ? from : '/admin/products'
    return <Navigate to={adminTarget} replace />
  }

  if (mallLoggedIn) {
    const from = location.state?.from
    const target =
      from && !['/login', '/register'].includes(from) && !from.startsWith('/admin') ? from : '/'
    return <Navigate to={target} replace />
  }

  return children
}
