import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeOrder } from '@/mall/constants/order'

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      /** 新增订单（支付成功后写入） */
      addOrder: (order) => {
        const normalized = normalizeOrder(order)
        if (!normalized) return
        set((state) => {
          const exists = state.orders.some((o) => o.id === normalized.id)
          if (exists) {
            return {
              orders: state.orders.map((o) =>
                o.id === normalized.id ? normalized : o,
              ),
            }
          }
          return { orders: [normalized, ...state.orders] }
        })
      },

      /** 更新订单状态 */
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o,
          ),
        }))
      },

      /** 从 Mock API 同步订单列表 */
      syncOrders: (apiOrders) => {
        const list = (apiOrders || []).map(normalizeOrder).filter(Boolean)
        set({ orders: list })
      },

      getOrderById: (orderId) =>
        get().orders.find((o) => o.id === Number(orderId)),

      getOrdersByStatus: (status) => {
        const { orders } = get()
        if (status === null || status === undefined || status === 'all') {
          return orders
        }
        return orders.filter((o) => o.status === Number(status))
      },
    }),
    { name: 'mall-order-storage' },
  ),
)

export default useOrderStore
