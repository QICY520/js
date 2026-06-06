import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /** 添加商品到购物车 */
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + quantity, product.stock ?? i.stock),
                      selected: true,
                    }
                  : i,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity: Math.min(quantity, product.stock ?? quantity),
                selected: true,
              },
            ],
          }
        })
      },

      /** 移除商品 */
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      /** 增加数量 */
      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.productId !== productId) return i
            return { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
          }),
        }))
      },

      /** 减少数量 */
      decreaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.productId !== productId) return i
            return { ...i, quantity: Math.max(1, i.quantity - 1) }
          }),
        }))
      },

      /** 直接设置数量 */
      setQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.productId !== productId) return i
            return { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          }),
        }))
      },

      /** 切换选中状态 */
      toggleSelect: (productId) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, selected: !i.selected } : i,
          ),
        }))
      },

      /** 全选 / 取消全选 */
      toggleSelectAll: (selected) => {
        set((state) => ({
          items: state.items.map((i) => ({ ...i, selected })),
        }))
      },

      /** 清除已选中的商品（支付成功后） */
      removeSelected: () => {
        set((state) => ({
          items: state.items.filter((i) => !i.selected),
        }))
      },

      /** 获取已选商品 */
      getSelectedItems: () => get().items.filter((i) => i.selected),

      /** 计算已选商品总价 */
      getTotalPrice: () =>
        get()
          .items.filter((i) => i.selected)
          .reduce((sum, i) => sum + i.price * i.quantity, 0),

      /** 计算已选商品总件数 */
      getSelectedCount: () =>
        get()
          .items.filter((i) => i.selected)
          .reduce((sum, i) => sum + i.quantity, 0),

      /** 购物车商品总件数（含未选中） */
      getCartCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      /** 是否全选 */
      isAllSelected: () => {
        const { items } = get()
        return items.length > 0 && items.every((i) => i.selected)
      },
    }),
    { name: 'mall-cart-storage' },
  ),
)

export default useCartStore
