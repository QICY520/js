import { Navigate, useLocation } from 'react-router-dom'
import useAppAuthHydration from '@/hooks/useAppAuthHydration'

/** 后台登录页：已登录管理员则跳转后台 */
export default function AdminGuestGuard({ children }) {
  const location = useLocation()
  const { hydrated, adminLoggedIn } = useAppAuthHydration()

  if (hydrated && adminLoggedIn) {
    const from = location.state?.from
    const target =
      from && from.startsWith('/admin') && from !== '/admin/login' && from !== '/admin/forbidden'
        ? from
        : '/admin'
    return <Navigate to={target} replace />
  }

  return children
}
