import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as loginApi } from '@/utils/api'
import { ADMIN_TOKEN_KEY } from '@/utils/auth'

const useAdminStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (username, password) => {
        const res = await loginApi({ username, password })
        const { token, user, role, permissions } = res.data

        if (role === 'user') {
          throw new Error('该账号为前台用户，无法登录后台')
        }

        localStorage.setItem(ADMIN_TOKEN_KEY, token)
        set({ user: { ...user, role, permissions }, token })
        return res.data
      },

      logout: () => {
        localStorage.removeItem(ADMIN_TOKEN_KEY)
        set({ user: null, token: null })
      },

      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        if (user.role === 'admin') return true
        return user.permissions?.includes(permission) ?? false
      },

      isLoggedIn: () => !!get().token && !!get().user,
    }),
    {
      name: 'admin-auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          localStorage.setItem(ADMIN_TOKEN_KEY, state.token)
        }
      },
    },
  ),
)

export default useAdminStore
