import axios from 'axios'
import { getMallToken, getAdminToken } from '@/utils/auth'

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
      return Promise.reject(err)
    }
    return res
  },
  (error) => Promise.reject(error),
)

export default request
