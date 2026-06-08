import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { login as loginApi, register as registerApi } from '@/utils/api'
import { MALL_TOKEN_KEY } from '@/utils/auth'

const persistToken = (token) => {
  if (token) sessionStorage.setItem(MALL_TOKEN_KEY, token)
  else sessionStorage.removeItem(MALL_TOKEN_KEY)
}

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

        persistToken(token)
        set({ user, token })
        return res.data
      },

      register: async ({ username, password, nickname }) => {
        const res = await registerApi({ username, password, nickname })
        const { token, user } = res.data

        persistToken(token)
        set({ user, token })
        return res.data
      },

      logout: () => {
        persistToken(null)
        set({ user: null, token: null })
      },

      isLoggedIn: () => !!get().token && !!get().user,
    }),
    {
      name: 'mall-user-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) persistToken(state.token)
      },
    },
  ),
)

export default useMallUserStore
