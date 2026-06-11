import { useNavigate } from 'react-router-dom'
import {
  NavBar,
  Image,
  Checkbox,
  Stepper,
  SwipeAction,
  Button,
} from 'antd-mobile'
import useCartStore from '@/mall/store/useCartStore'
import MallPageShell from '@/mall/components/MallPageShell'
import mallToast from '@/mall/utils/toast'

export default function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const toggleSelect = useCartStore((s) => s.toggleSelect)
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const getSelectedCount = useCartStore((s) => s.getSelectedCount)
  const isAllSelected = useCartStore((s) => s.isAllSelected)

  const totalPrice = getTotalPrice()
  const selectedCount = getSelectedCount()
  const allSelected = isAllSelected()

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

  return (
    <MallPageShell className="bg-cream-50 flex flex-col">
      <NavBar onBack={() => navigate(-1)} className="bg-cream-50/80 backdrop-blur-md">
        购物车
      </NavBar>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
          <p className="text-sm mb-4">购物车是空的</p>
          <Button color="primary" fill="outline" onClick={() => navigate('/')}>
            去逛逛
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1 px-4 pt-2 space-y-3">
            {items.map((item) => {
              const lineKey = item.lineKey || String(item.productId)
              return (
              <SwipeAction
                key={lineKey}
                rightActions={[
                  {
                    key: 'delete',
                    text: '删除',
                    color: 'danger',
                    onClick: () => {
                      removeItem(lineKey)
                      mallToast.success('已从购物车移除')
                    },
                  },
                ]}
              >
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-cream-200 shadow-sm">
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
                    <p className="text-sm text-stone-800 line-clamp-2">{item.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-olive-700 font-bold">
                        <span className="text-xs">¥</span>
                        {item.price}
                      </span>
                      <Stepper
                        value={item.quantity}
                        min={1}
                        max={item.stock}
                        onChange={(val) => handleQuantityChange(item, val)}
                      />
                    </div>
                  </div>
                </div>
              </SwipeAction>
            )})}
          </div>

          <footer className="fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-cream-200 px-4 py-3 z-30">
            <div className="max-w-lg mx-auto flex items-center gap-3">
              <Checkbox
                checked={allSelected}
                onChange={(checked) => toggleSelectAll(checked)}
                style={{ '--icon-size': '20px' }}
              >
                <span className="text-sm text-stone-600">全选</span>
              </Checkbox>
              <div className="flex-1 text-right">
                <span className="text-xs text-stone-500">合计 </span>
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
