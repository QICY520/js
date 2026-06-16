import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /** 添加商品到购物车（支持 SKU 规格） */
      addItem: (product, quantity = 1, options = {}) => {
        const {
          lineKey = String(product.id),
          price = product.price,
          image = product.image,
          stock = product.stock,
          specLabel = '',
          skuId = null,
        } = options

        set((state) => {
          const existing = state.items.find((i) => i.lineKey === lineKey)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.lineKey === lineKey
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + quantity, stock ?? i.stock),
                      selected: true,
                    }
                  : i,
              ),
            }
          }
          const title = specLabel ? `${product.title}（${specLabel}）` : product.title
          return {
            items: [
              ...state.items,
              {
                lineKey,
                productId: product.id,
                skuId,
                specLabel,
                categoryId: product.categoryId ?? null,
                title,
                price,
                image,
                stock,
                quantity: Math.min(quantity, stock ?? quantity),
                selected: true,
              },
            ],
          }
        })
      },

      /** 移除商品（按 lineKey 区分 SKU） */
      removeItem: (lineKey) => {
        set((state) => ({
          items: state.items.filter(
            (i) => (i.lineKey || String(i.productId)) !== lineKey,
          ),
        }))
      },

      /** 增加数量 */
      increaseQuantity: (lineKey) => {
        set((state) => ({
          items: state.items.map((i) => {
            const key = i.lineKey || String(i.productId)
            if (key !== lineKey) return i
            return { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
          }),
        }))
      },

      /** 减少数量 */
      decreaseQuantity: (lineKey) => {
        set((state) => ({
          items: state.items.map((i) => {
            const key = i.lineKey || String(i.productId)
            if (key !== lineKey) return i
            return { ...i, quantity: Math.max(1, i.quantity - 1) }
          }),
        }))
      },

      /** 直接设置数量 */
      setQuantity: (lineKey, quantity) => {
        set((state) => ({
          items: state.items.map((i) => {
            const key = i.lineKey || String(i.productId)
            if (key !== lineKey) return i
            return { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          }),
        }))
      },

      /** 切换选中状态 */
      toggleSelect: (lineKey) => {
        set((state) => ({
          items: state.items.map((i) => {
            const key = i.lineKey || String(i.productId)
            return key === lineKey ? { ...i, selected: !i.selected } : i
          }),
        }))
      },

      /** 全选 / 取消全选 */
      toggleSelectAll: (selected) => {
        set((state) => ({
          items: state.items.map((i) => ({ ...i, selected })),
        }))
      },

      /** 清除已选中的商品（下单待支付 / 支付成功后） */
      removeSelected: () => {
        set((state) => ({
          items: state.items.filter((i) => !i.selected),
        }))
      },

      /** 用最新商品图覆盖购物车缓存（修复旧图） */
      syncItemImages: (products = []) => {
        const imageMap = new Map(products.map((p) => [p.id, p.image]))
        set((state) => ({
          items: state.items.map((item) =>
            imageMap.has(item.productId)
              ? { ...item, image: imageMap.get(item.productId) }
              : item,
          ),
        }))
      },

      /** 取消待支付时，将订单商品还原到购物车 */
      restoreFromOrderItems: (orderItems = []) => {
        if (!orderItems.length) return
        set((state) => {
          const additions = orderItems.map((item, idx) => ({
            lineKey: `restore-${item.productId}-${Date.now()}-${idx}`,
            productId: item.productId,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            selected: true,
            stock: 999,
            categoryId: null,
          }))
          return { items: [...state.items, ...additions] }
        })
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

      /** 按分类分组全选 / 取消 */
      toggleGroupSelect: (categoryId, selected) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.categoryId === categoryId ? { ...i, selected } : i,
          ),
        }))
      },

      /** 指定分类是否全选 */
      isGroupAllSelected: (categoryId) => {
        const groupItems = get().items.filter((i) => i.categoryId === categoryId)
        return groupItems.length > 0 && groupItems.every((i) => i.selected)
      },
    }),
    { name: 'mall-cart-storage' },
  ),
)

export default useCartStore
