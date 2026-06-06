import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as loginApi } from '@/utils/api'
import { MALL_TOKEN_KEY } from '@/utils/auth'

const useMallUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (username, password) => {
        const res = await loginApi({ username, password })
        const { token, user, role } = res.data

        if (role !== 'user') {
          throw new Error('该账号为后台账号，请使用前台用户登录')
        }

        localStorage.setItem(MALL_TOKEN_KEY, token)
        set({ user, token })
        return res.data
      },

      logout: () => {
        localStorage.removeItem(MALL_TOKEN_KEY)
        set({ user: null, token: null })
      },

      isLoggedIn: () => !!get().token && !!get().user,
    }),
    {
      name: 'mall-user-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          localStorage.setItem(MALL_TOKEN_KEY, state.token)
        }
      },
    },
  ),
)

export default useMallUserStore
