import { Navigate, useLocation } from 'react-router-dom'
import useAuthHydration from '@/mall/hooks/useAuthHydration'
import { AuthPageSkeleton } from '@/mall/components/PageSkeleton'

/** 登录/注册页：已登录用户自动跳转到商城 */
export default function MallGuestGuard({ children }) {
  const location = useLocation()
  const { hydrated, isLoggedIn } = useAuthHydration()

  if (!hydrated) return <AuthPageSkeleton />

  if (isLoggedIn) {
    const from = location.state?.from
    const target = from && !['/login', '/register'].includes(from) ? from : '/'
    return <Navigate to={target} replace />
  }

  return children
}
