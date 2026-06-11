import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_ADDRESSES } from '@/mall/constants/address'

/**
 * 收货地址 Store
 *
 * - 多地址管理（增删改）
 * - 默认地址切换
 * - 下单时从 store 选择地址
 */
const useAddressStore = create(
  persist(
    (set, get) => ({
      addresses: SEED_ADDRESSES,

      /** 新增地址 */
      addAddress: (address) => {
        set((state) => {
          const newId = Math.max(...state.addresses.map((a) => a.id), 0) + 1
          const addr = {
            ...address,
            id: newId,
            isDefault: address.isDefault || state.addresses.length === 0,
          }
          // 如果新地址设为默认，取消其他
          let list = [...state.addresses, addr]
          if (addr.isDefault) {
            list = list.map((a) => (a.id === addr.id ? a : { ...a, isDefault: false }))
          }
          return { addresses: list }
        })
      },

      /** 更新地址 */
      updateAddress: (id, updates) => {
        set((state) => ({
          addresses: state.addresses.map((a) => {
            if (a.id !== id) return a
            const updated = { ...a, ...updates, id: a.id }
            return updated
          }),
        }))
      },

      /** 删除地址 */
      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }))
      },

      /** 设为默认地址 */
      setDefault: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }))
      },

      /** 获取默认地址 */
      getDefaultAddress: () => {
        const { addresses } = get()
        return addresses.find((a) => a.isDefault) || addresses[0] || null
      },

      /** 根据 ID 获取地址 */
      getAddressById: (id) => {
        return get().addresses.find((a) => a.id === id) || null
      },
    }),
    { name: 'mall-address-storage' },
  ),
)

export default useAddressStore
