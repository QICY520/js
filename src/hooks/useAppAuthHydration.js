import { useState, useEffect } from 'react'
import useMallUserStore from '@/mall/store/useMallUserStore'
import useAdminStore from '@/admin/store/useAdminStore'
import { MALL_TOKEN_KEY, ADMIN_TOKEN_KEY } from '@/utils/auth'

/** 等待商城与后台 Zustand 持久化恢复 */
export default function useAppAuthHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false
    const mallDone = { v: useMallUserStore.persist.hasHydrated() }
    const adminDone = { v: useAdminStore.persist.hasHydrated() }

    const tryFinish = () => {
      if (cancelled || !mallDone.v || !adminDone.v) return

      const mall = useMallUserStore.getState()
      const admin = useAdminStore.getState()
      if (mall.token) sessionStorage.setItem(MALL_TOKEN_KEY, mall.token)
      if (admin.token) localStorage.setItem(ADMIN_TOKEN_KEY, admin.token)
      setHydrated(true)
    }

    const unsubMall = useMallUserStore.persist.onFinishHydration(() => {
      mallDone.v = true
      tryFinish()
    })
    const unsubAdmin = useAdminStore.persist.onFinishHydration(() => {
      adminDone.v = true
      tryFinish()
    })

    tryFinish()

    // 兜底：避免 persist 异常时登录页一直卡在骨架屏
    const timer = setTimeout(() => {
      if (!cancelled) setHydrated(true)
    }, 400)

    return () => {
      cancelled = true
      unsubMall()
      unsubAdmin()
      clearTimeout(timer)
    }
  }, [])

  const mallUser = useMallUserStore((s) => s.user)
  const mallToken = useMallUserStore((s) => s.token)
  const adminUser = useAdminStore((s) => s.user)
  const adminToken = useAdminStore((s) => s.token)

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
