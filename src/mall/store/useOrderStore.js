import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeOrder } from '@/mall/constants/order'

function mergeOrderLists(localOrders, apiOrders) {
  const map = new Map()
  localOrders.forEach((o) => map.set(o.id, o))
  apiOrders.forEach((o) => {
    const existing = map.get(o.id)
    map.set(o.id, existing ? { ...existing, ...o } : o)
  })
  return [...map.values()].sort((a, b) => b.id - a.id)
}

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      /** 新增或更新订单（支付成功后写入） */
      addOrder: (order) => {
        const normalized = normalizeOrder(order)
        if (!normalized) return
        set((state) => {
          const exists = state.orders.some((o) => o.id === normalized.id)
          if (exists) {
            return {
              orders: state.orders.map((o) =>
                o.id === normalized.id ? { ...o, ...normalized } : o,
              ),
            }
          }
          return { orders: [normalized, ...state.orders] }
        })
      },

      /** 更新整单 */
      updateOrder: (order) => {
        const normalized = normalizeOrder(order)
        if (!normalized) return
        set((state) => ({
          orders: state.orders.some((o) => o.id === normalized.id)
            ? state.orders.map((o) => (o.id === normalized.id ? normalized : o))
            : [normalized, ...state.orders],
        }))
      },

      /** 更新订单状态 */
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === Number(orderId) ? { ...o, status } : o,
          ),
        }))
      },

      /** 从 Mock API 同步订单列表（与本地合并，避免覆盖刚支付的订单） */
      syncOrders: (apiOrders) => {
        const apiList = (apiOrders || []).map(normalizeOrder).filter(Boolean)
        set((state) => ({
          orders: mergeOrderLists(state.orders, apiList),
        }))
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
