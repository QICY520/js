import { useState, useEffect } from 'react'
import useMallUserStore from '@/mall/store/useMallUserStore'
import { MALL_TOKEN_KEY } from '@/utils/auth'

/** 等待 Zustand 持久化恢复，并同步 mall-token */
export default function useAuthHydration() {
  const [hydrated, setHydrated] = useState(useMallUserStore.persist.hasHydrated())

  useEffect(() => {
    const syncToken = () => {
      const { token } = useMallUserStore.getState()
      if (token) sessionStorage.setItem(MALL_TOKEN_KEY, token)
      setHydrated(true)
    }

    if (useMallUserStore.persist.hasHydrated()) {
      syncToken()
      return undefined
    }

    return useMallUserStore.persist.onFinishHydration(syncToken)
  }, [])

  const user = useMallUserStore((s) => s.user)
  const token = useMallUserStore((s) => s.token)

  return {
    hydrated,
    isLoggedIn: hydrated && !!(token && user),
    user,
    token,
  }
}
