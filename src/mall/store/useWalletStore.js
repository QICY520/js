import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWalletStore = create(
  persist(
    (set, get) => ({
      balance: 0,
      records: [],

      recharge: (amount, label = '礼品卡充值') => {
        set((state) => ({
          balance: state.balance + amount,
          records: [
            { id: Date.now(), amount, label, time: new Date().toLocaleString('zh-CN') },
            ...state.records,
          ].slice(0, 20),
        }))
      },

      getBalance: () => get().balance,
    }),
    { name: 'mall-wallet-storage' },
  ),
)

export default useWalletStore
