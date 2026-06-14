import { Navigate, useLocation } from 'react-router-dom'
import useAppAuthHydration from '@/hooks/useAppAuthHydration'
import { resolveAuthRedirect } from '@/mall/constants/auth'

/** 登录/注册页：已登录则跳转；未 hydration 时也先展示页面，避免卡在骨架屏 */
export default function MallGuestGuard({ children }) {
  const location = useLocation()
  const { hydrated, mallLoggedIn, adminLoggedIn } = useAppAuthHydration()

  if (!hydrated) {
    return children
  }

  if (adminLoggedIn && !mallLoggedIn) {
    return <Navigate to="/admin" replace />
  }

  if (mallLoggedIn) {
    const target = resolveAuthRedirect(location.search, location.state?.from)
    return <Navigate to={target} replace />
  }

  return children
}
