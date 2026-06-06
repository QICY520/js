import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { DotLoading } from 'antd-mobile'
import useMallUserStore from '@/mall/store/useMallUserStore'
import { getMallToken } from '@/utils/auth'

export default function MallAuthGuard({ children }) {
  const location = useLocation()
  const [hydrated, setHydrated] = useState(useMallUserStore.persist.hasHydrated())
  const user = useMallUserStore((s) => s.user)
  const token = useMallUserStore((s) => s.token)

  useEffect(() => {
    const unsub = useMallUserStore.persist.onFinishHydration(() => {
      const state = useMallUserStore.getState()
      if (state.token) {
        localStorage.setItem('mall-token', state.token)
      }
      setHydrated(true)
    })
    if (useMallUserStore.persist.hasHydrated()) {
      setHydrated(true)
    }
    return unsub
  }, [])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-olive-600">
        <DotLoading color="currentColor" />
      </div>
    )
  }

  const loggedIn = !!(token && user) || !!getMallToken()

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
