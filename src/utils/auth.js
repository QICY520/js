import useMallUserStore from '@/mall/store/useMallUserStore'
import useAdminStore from '@/admin/store/useAdminStore'

export const MALL_TOKEN_KEY = 'mall-token'
export const ADMIN_TOKEN_KEY = 'admin-token'

/** 从 localStorage / Zustand 同步读取前台 Token */
export function getMallToken() {
  let token = localStorage.getItem(MALL_TOKEN_KEY)
  if (token) return token

  token = useMallUserStore.getState().token
  if (token) {
    localStorage.setItem(MALL_TOKEN_KEY, token)
    return token
  }

  return null
}

/** 从 localStorage / Zustand 同步读取后台 Token */
export function getAdminToken() {
  let token = localStorage.getItem(ADMIN_TOKEN_KEY)
  if (token) return token

  token = useAdminStore.getState().token
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
    return token
  }

  return null
}

/** 下单/查订单前校验登录 */
export function ensureMallLogin() {
  const token = getMallToken()
  if (!token) {
    throw new Error('请先登录后再操作')
  }
  return token
}
