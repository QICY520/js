import { Navigate, useLocation } from 'react-router-dom'
import useAuthHydration from '@/mall/hooks/useAuthHydration'
import { AuthPageSkeleton } from '@/mall/components/PageSkeleton'
import { buildLoginPath } from '@/mall/constants/auth'

/** 受保护路由：未登录跳转登录页，并记录来源路径 */
export default function MallAuthGuard({ children }) {
  const location = useLocation()
  const { hydrated, isLoggedIn } = useAuthHydration()

  if (!hydrated) return <AuthPageSkeleton />

  if (!isLoggedIn) {
    const redirectTo = location.pathname + location.search
    return <Navigate to={buildLoginPath(redirectTo)} replace />
  }

  return children
}
