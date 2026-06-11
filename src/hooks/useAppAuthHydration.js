import { useState, useEffect } from 'react'
import useMallUserStore from '@/mall/store/useMallUserStore'
import useAdminStore from '@/admin/store/useAdminStore'
import { MALL_TOKEN_KEY, ADMIN_TOKEN_KEY } from '@/utils/auth'

/** 等待商城与后台 Zustand 持久化恢复 */
export default function useAppAuthHydration() {
  const [mallHydrated, setMallHydrated] = useState(useMallUserStore.persist.hasHydrated())
  const [adminHydrated, setAdminHydrated] = useState(useAdminStore.persist.hasHydrated())

  useEffect(() => {
    const syncMall = () => {
      const { token } = useMallUserStore.getState()
      if (token) sessionStorage.setItem(MALL_TOKEN_KEY, token)
      setMallHydrated(true)
    }

    if (useMallUserStore.persist.hasHydrated()) {
      syncMall()
    } else {
      useMallUserStore.persist.onFinishHydration(syncMall)
    }

    const syncAdmin = () => {
      const { token } = useAdminStore.getState()
      if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token)
      setAdminHydrated(true)
    }

    if (useAdminStore.persist.hasHydrated()) {
      syncAdmin()
    } else {
      useAdminStore.persist.onFinishHydration(syncAdmin)
    }
  }, [])

  const mallUser = useMallUserStore((s) => s.user)
  const mallToken = useMallUserStore((s) => s.token)
  const adminUser = useAdminStore((s) => s.user)
  const adminToken = useAdminStore((s) => s.token)

  const hydrated = mallHydrated && adminHydrated
  const mallLoggedIn = hydrated && !!(mallToken && mallUser)
  const adminLoggedIn = hydrated && !!(adminToken && adminUser)

  return {
    hydrated,
    mallLoggedIn,
    adminLoggedIn,
    mallUser,
    adminUser,
    isLoggedIn: mallLoggedIn || adminLoggedIn,
  }
}
