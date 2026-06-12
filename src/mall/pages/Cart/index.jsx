import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NavBar,
  Image,
  Checkbox,
  Stepper,
  SwipeAction,
  Button,
  Empty,
  Dialog,
} from 'antd-mobile'
import { DeleteOutline } from 'antd-mobile-icons'
import useCartStore from '@/mall/store/useCartStore'
import MallPageShell from '@/mall/components/MallPageShell'
import { getCategories } from '@/utils/api'
import mallToast from '@/mall/utils/toast'

const FALLBACK_CATEGORY_NAME = '精选好物'

/**
 * 购物车页面（第三模块改造）
 * - 按商品分类(categoryId)分组展示，仿京东店铺分组
 * - 品类全选 / 全站全选
 * - 侧滑删除 + 数量调整
 */
export default function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const toggleSelect = useCartStore((s) => s.toggleSelect)
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll)
  const toggleGroupSelect = useCartStore((s) => s.toggleGroupSelect)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const getSelectedCount = useCartStore((s) => s.getSelectedCount)
  const isAllSelected = useCartStore((s) => s.isAllSelected)
  const isGroupAllSelected = useCartStore((s) => s.isGroupAllSelected)

  const [categoryMap, setCategoryMap] = useState({})

  const totalPrice = getTotalPrice()
  const selectedCount = getSelectedCount()
  const allSelected = isAllSelected()

  /** 按 categoryId 分组（在组件内 useMemo，避免 zustand selector 无限渲染） */
  const groupedItems = useMemo(() => {
    const groups = new Map()
    items.forEach((item) => {
      const key = item.categoryId ?? 0
      if (!groups.has(key)) {
        groups.set(key, { categoryId: key, items: [] })
      }
      groups.get(key).items.push(item)
    })
    return Array.from(groups.values())
  }, [items])

  /** 构建分类 ID → 分类名映射 */
  useEffect(() => {
    getCategories()
      .then((res) => {
        const map = {}
        const parents = res.data || []
        parents.forEach((parent) => {
          map[parent.id] = parent.name
          parent.children?.forEach((child) => {
            map[child.id] = `${parent.name} · ${child.name}`
          })
        })
        setCategoryMap(map)
      })
      .catch(() => setCategoryMap({}))
  }, [])

  const getGroupName = (catId) => {
    if (!catId || catId === 0) return FALLBACK_CATEGORY_NAME
    return categoryMap[catId] || FALLBACK_CATEGORY_NAME
  }

  const handleCheckout = () => {
    if (selectedCount === 0) {
      mallToast.info('请先勾选要结算的商品')
      return
    }
    mallToast.success(`已选择 ${selectedCount} 件商品，前往结算`)
    setTimeout(() => navigate('/checkout'), 300)
  }

  const handleQuantityChange = (item, val) => {
    if (val >= item.stock) {
      mallToast.info(`「${item.title}」已达库存上限`)
    }
    setQuantity(item.lineKey || String(item.productId), val)
  }

  const handleRemoveItem = (item, { confirm = true } = {}) => {
    const lineKey = item.lineKey || String(item.productId)
    const doRemove = () => {
      removeItem(lineKey)
      mallToast.success('已从购物车移除')
    }
    if (confirm) {
      Dialog.confirm({
        content: `确定将「${item.title}」移出购物车？`,
        confirmText: '删除',
        cancelText: '取消',
        onConfirm: doRemove,
      })
    } else {
      doRemove()
    }
  }

  return (
    <MallPageShell className="bg-cream-50 flex flex-col">
      <NavBar onBack={() => navigate(-1)} className="bg-cream-50/80 backdrop-blur-md">
        购物车
      </NavBar>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Empty description="购物车是空的" className="py-8" />
          <Button
            color="primary"
            shape="rounded"
            onClick={() => navigate('/')}
            style={{ '--background': '#4a6340' }}
          >
            去逛逛
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-4">
            {groupedItems.map((group) => {
              const groupSelected = isGroupAllSelected(group.categoryId)
              return (
                <section
                  key={group.categoryId}
                  className="rounded-2xl bg-white border border-cream-200 shadow-sm"
                >
                  {/* 分组头：品类名 + 全选 */}
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-cream-50/80 border-b border-cream-100">
                    <Checkbox
                      checked={groupSelected}
                      onChange={(checked) => toggleGroupSelect(group.categoryId, checked)}
                      style={{ '--icon-size': '18px' }}
                    />
                    <span className="text-xs font-semibold text-stone-600 flex-1">
                      {getGroupName(group.categoryId)}
                    </span>
                    <span className="text-[10px] text-stone-400">{group.items.length} 件</span>
                  </div>

                  {/* 分组内商品 */}
                  <div className="divide-y divide-cream-50">
                    {group.items.map((item) => {
                      const lineKey = item.lineKey || String(item.productId)
                      return (
                        <SwipeAction
                          key={lineKey}
                          rightActions={[
                            {
                              key: 'delete',
                              text: '删除',
                              color: 'danger',
                              onClick: () => handleRemoveItem(item, { confirm: false }),
                            },
                          ]}
                        >
                          <div className="flex items-center gap-3 p-3 active:bg-cream-50/50 transition-colors bg-white">
                            <Checkbox
                              checked={item.selected}
                              onChange={() => toggleSelect(lineKey)}
                              style={{ '--icon-size': '20px' }}
                            />
                            <Image
                              src={item.image}
                              width={80}
                              height={80}
                              fit="cover"
                              className="rounded-xl shrink-0"
                              onClick={() => navigate(`/product/${item.productId}`)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-stone-800 line-clamp-2 pr-1">{item.title}</p>
                              <div className="flex items-center justify-between mt-2 gap-2">
                                <span className="text-olive-700 font-bold shrink-0">
                                  <span className="text-xs">¥</span>
                                  {item.price}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Stepper
                                    value={item.quantity}
                                    min={1}
                                    max={item.stock}
                                    onChange={(val) => handleQuantityChange(item, val)}
                                  />
                                  <button
                                    type="button"
                                    aria-label="删除"
                                    onClick={() => handleRemoveItem(item)}
                                    className="p-1.5 text-stone-400 hover:text-red-500 active:text-red-600 transition-colors"
                                  >
                                    <DeleteOutline fontSize={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SwipeAction>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>

          {/* 底部结算栏 */}
          <footer className="fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-cream-200 px-4 py-3 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
            <div className="max-w-lg mx-auto flex items-center gap-3">
              <Checkbox
                checked={allSelected}
                onChange={(checked) => toggleSelectAll(checked)}
                style={{ '--icon-size': '20px' }}
              >
                <span className="text-sm text-stone-600">全选</span>
              </Checkbox>
              <div className="flex-1 text-right">
                <span className="text-xs text-stone-500">
                  已选 <span className="text-olive-700 font-semibold">{selectedCount}</span> 件 · 合计{' '}
                </span>
                <span className="text-lg font-bold text-olive-700">
                  <span className="text-xs">¥</span>
                  {totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                color="primary"
                shape="rounded"
                disabled={selectedCount === 0}
                onClick={handleCheckout}
                style={{ '--background': '#4a6340', minWidth: 100 }}
              >
                结算({selectedCount})
              </Button>
            </div>
          </footer>
        </>
      )}
    </MallPageShell>
  )
}
