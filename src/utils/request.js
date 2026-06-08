import axios from 'axios'
import { getMallToken, getAdminToken, MALL_TOKEN_KEY } from '@/utils/auth'
import useMallUserStore from '@/mall/store/useMallUserStore'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  const isAdminRoute =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
  const token = isAdminRoute ? getAdminToken() : getMallToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 0 && res.code !== 200) {
      const err = new Error(res.message || '请求失败')
      err.code = res.code

      // 401 鉴权失效（排除登录/注册接口本身）
      const url = response.config?.url || ''
      if (
        res.code === 401 &&
        !url.includes('/login') &&
        !url.includes('/register') &&
        !window.location.pathname.startsWith('/admin')
      ) {
        localStorage.removeItem(MALL_TOKEN_KEY)
        sessionStorage.removeItem(MALL_TOKEN_KEY)
        useMallUserStore.getState().logout()
      }

      return Promise.reject(err)
    }
    return res
  },
  (error) => Promise.reject(error),
)

export default request
