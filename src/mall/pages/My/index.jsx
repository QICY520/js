import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Badge, Button, Tabs, Rate } from 'antd-mobile'
import {
  PayCircleOutline,
  TruckOutline,
  SendOutline,
  ChatCheckOutline,
  ExclamationCircleOutline,
  HeartOutline,
  ShopbagOutline,
  ClockCircleOutline,
  SetOutline,
  UserOutline,
  RightOutline,
} from 'antd-mobile-icons'
import useMallUserStore from '@/mall/store/useMallUserStore'
import useUserStore from '@/mall/store/useUserStore'
import useOrderStore from '@/mall/store/useOrderStore'
import { getOrders, getProducts, getShops } from '@/utils/api'
import { ORDER_STATUS } from '@/mall/constants/order'
import { MY_TABS } from '@/mall/constants/userCenter'
import MallPageShell from '@/mall/components/MallPageShell'
import EmptyState from '@/mall/components/my/EmptyState'
import GuessProductCard from '@/mall/components/my/GuessProductCard'
import mallToast from '@/mall/utils/toast'

/** 图标按钮悬浮态 */
const iconBtnClass =
  'rounded-xl px-3 py-2 transition-all duration-200 hover:bg-cream-50 hover:scale-105 hover:shadow-sm active:scale-95'
/** 文字链悬浮态 */
const textLinkClass =
  'transition-colors duration-200 hover:text-olive-600'
/** 列表行悬浮态 */
const rowHoverClass =
  'transition-colors duration-200 hover:bg-cream-50 active:bg-cream-100'

const TOP_SHORTCUTS = [
  { key: 'express', label: '快递', icon: TruckOutline, color: '#4a6340' },
  { key: 'favorites', label: '收藏', icon: HeartOutline, color: '#ef4444' },
  { key: 'follows', label: '关注店铺', icon: ShopbagOutline, color: '#2563eb' },
  { key: 'footprints', label: '足迹', icon: ClockCircleOutline, color: '#f59e0b' },
]

const ORDER_ENTRIES = [
  { key: 'pay', status: ORDER_STATUS.PENDING_PAY, label: '待付款', icon: PayCircleOutline, color: '#f59e0b' },
  { key: 'ship', status: ORDER_STATUS.PENDING_SHIP, label: '待发货', icon: TruckOutline, color: '#2563eb' },
  { key: 'receive', status: ORDER_STATUS.PENDING_RECEIVE, label: '待收货', icon: SendOutline, color: '#4a6340' },
  { key: 'review', status: ORDER_STATUS.PENDING_REVIEW, label: '待评价', icon: ChatCheckOutline, color: '#ea580c' },
  { key: 'refund', status: ORDER_STATUS.REFUND, label: '退款/售后', icon: ExclamationCircleOutline, color: '#78716c' },
]

function shuffleProducts(list) {
  return [...list].sort(() => Math.random() - 0.5)
}

export default function MyPage() {
  const navigate = useNavigate()
  const user = useMallUserStore((s) => s.user)
  const logout = useMallUserStore((s) => s.logout)
  const orders = useOrderStore((s) => s.orders)
  const syncOrders = useOrderStore((s) => s.syncOrders)

  const favorites = useUserStore((s) => s.favorites)
  const followedShops = useUserStore((s) => s.followedShops)
  const footprints = useUserStore((s) => s.footprints)
  const reviews = useUserStore((s) => s.reviews)

  const [activeTab, setActiveTab] = useState('guess')
  const [panel, setPanel] = useState(null)
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getOrders().then((res) => syncOrders(res.data.list)).catch(() => {}),
      getProducts({ status: 1, pageSize: 80 }).then((res) => setProducts(res.data.list)),
      getShops().then((res) => setShops(res.data)),
    ]).finally(() => setLoading(false))
  }, [syncOrders])

  const orderCountMap = useMemo(() => {
    const map = {}
    ORDER_ENTRIES.forEach((e) => { map[e.status] = 0 })
    orders.forEach((o) => {
      if (map[o.status] !== undefined) map[o.status] += 1
    })
    return map
  }, [orders])

  const guessProducts = useMemo(() => shuffleProducts(products).slice(0, 20), [products])
  const favoriteProducts = useMemo(
    () => favorites.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [favorites, products],
  )
  const footprintProducts = useMemo(
    () => footprints.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [footprints, products],
  )
  const followedShopList = useMemo(
    () => followedShops.map((id) => shops.find((s) => s.shopId === id)).filter(Boolean),
    [followedShops, shops],
  )

  const handleShortcut = (key) => {
    if (key === 'express') {
      navigate(`/orders?status=${ORDER_STATUS.PENDING_RECEIVE}`)
      return
    }
    if (key === 'favorites') {
      setPanel('favorites')
      return
    }
    if (key === 'follows') {
      setPanel('follows')
      return
    }
    if (key === 'footprints') {
      setPanel('footprints')
    }
  }

  const handleLogout = () => {
    logout()
    mallToast.success('已退出登录')
    navigate('/login', { replace: true })
  }

  const renderGuessGrid = () => {
    if (loading) return <p className="text-center text-stone-400 py-8 text-sm">加载中…</p>
    if (!guessProducts.length) return <EmptyState description="暂无推荐商品" />
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-3">
        {guessProducts.map((p) => (
          <GuessProductCard key={p.id} product={p} />
        ))}
      </div>
    )
  }

  const renderReviews = () => {
    if (!reviews.length) {
      return <EmptyState description="暂无评价，完成订单后可评价" actionLabel="去看看" />
    }
    return (
      <div className="px-3 space-y-3">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-2xl bg-white p-3 border border-cream-200 transition-all duration-200 hover:border-olive-200 hover:shadow-md">
            <button
              type="button"
              onClick={() => navigate(`/product/${review.productId}`)}
              className={`flex gap-3 w-full text-left rounded-xl ${rowHoverClass}`}
            >
              <Image src={review.productImage} width={64} height={64} fit="cover" className="rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-800 line-clamp-1">{review.productTitle}</p>
                <Rate readOnly value={review.rating} className="text-xs mt-1" />
                <p className="text-xs text-stone-600 mt-2 leading-relaxed line-clamp-2">{review.content}</p>
                <p className="text-[10px] text-stone-400 mt-1">{review.createTime}</p>
              </div>
            </button>
          </article>
        ))}
      </div>
    )
  }

  const renderPanel = () => {
    if (panel === 'favorites') {
      if (!favoriteProducts.length) {
        return (
          <section className="mx-4 mt-3 rounded-2xl bg-white border border-cream-200 p-2">
            <EmptyState description="还没有收藏商品，去逛逛吧" />
          </section>
        )
      }
      return (
        <section className="mx-4 mt-3 rounded-2xl bg-white border border-cream-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-cream-100">
            <h3 className="text-sm font-semibold text-stone-800">我的收藏</h3>
            <button type="button" onClick={() => setPanel(null)} className={`text-xs text-stone-400 px-2 py-1 rounded-lg ${textLinkClass}`}>收起</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-3 py-3">
            {favoriteProducts.map((p) => (
              <GuessProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )
    }

    if (panel === 'follows') {
      if (!followedShopList.length) {
        return (
          <section className="mx-4 mt-3 rounded-2xl bg-white border border-cream-200 p-2">
            <EmptyState description="还没有关注店铺" />
          </section>
        )
      }
      return (
        <section className="mx-4 mt-3 rounded-2xl bg-white border border-cream-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-cream-100">
            <h3 className="text-sm font-semibold text-stone-800">关注的店铺</h3>
            <button type="button" onClick={() => setPanel(null)} className={`text-xs text-stone-400 px-2 py-1 rounded-lg ${textLinkClass}`}>收起</button>
          </div>
          {followedShopList.map((shop) => (
            <button
              key={shop.shopId}
              type="button"
              onClick={() => navigate(`/shop/${shop.shopId}`)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-cream-50 last:border-0 ${rowHoverClass}`}
            >
              <img src={shop.shopLogo} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm text-stone-800 truncate">{shop.shopName}</p>
                <p className="text-[10px] text-stone-400">{shop.productCount} 件宝贝</p>
              </div>
              <RightOutline fontSize={14} className="text-stone-300" />
            </button>
          ))}
        </section>
      )
    }

    if (panel === 'footprints') {
      if (!footprintProducts.length) {
        return (
          <section className="mx-4 mt-3 rounded-2xl bg-white border border-cream-200">
            <EmptyState description="还没有浏览足迹" />
          </section>
        )
      }
      return (
        <section className="mx-4 mt-3 rounded-2xl bg-white border border-cream-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-cream-100">
            <h3 className="text-sm font-semibold text-stone-800">浏览足迹</h3>
            <button type="button" onClick={() => setPanel(null)} className={`text-xs text-stone-400 px-2 py-1 rounded-lg ${textLinkClass}`}>收起</button>
          </div>
          <div className="flex gap-2 overflow-x-auto px-3 py-3">
            {footprintProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/product/${p.id}`)}
                className="group shrink-0 w-20 text-left rounded-lg p-1 transition-all duration-200 hover:bg-cream-50 hover:scale-105 active:scale-95"
              >
                <img src={p.image} alt="" className="w-20 h-20 rounded-lg object-cover transition-shadow duration-200 group-hover:shadow-md" />
                <p className="text-[10px] text-stone-600 mt-1 line-clamp-2">¥{p.price}</p>
              </button>
            ))}
          </div>
        </section>
      )
    }

    return null
  }

  return (
    <MallPageShell>
      {/* 用户信息 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-olive-700/90 via-olive-600/60 to-gray-100" />
        <div className="relative px-5 pt-10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar ? (
                <Image src={user.avatar} width={56} height={56} fit="cover" className="rounded-full" />
              ) : (
                <UserOutline fontSize={24} className="text-white/80" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white truncate">
                {user?.nickname || user?.username || '商城用户'}
              </h2>
              <p className="text-[11px] text-white/70 mt-0.5">LUMIÈRE 极简生活美学</p>
            </div>
            <button
              type="button"
              onClick={() => mallToast.info('设置功能开发中')}
              className="p-2 rounded-full text-white/80 transition-all duration-200 hover:bg-white/15 hover:text-white hover:scale-110 active:scale-95"
            >
              <SetOutline fontSize={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 顶部四宫格 */}
      <section className="mx-4 -mt-2 relative z-10">
        <div className="rounded-2xl bg-white shadow-md border border-cream-200 px-2 py-4">
          <div className="flex justify-around">
            {TOP_SHORTCUTS.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleShortcut(key)}
                className={`group flex flex-col items-center gap-1.5 ${iconBtnClass}`}
              >
                <span className="relative transition-transform duration-200 group-hover:scale-110">
                  <Icon fontSize={24} style={{ color }} />
                  {key === 'favorites' && favorites.length > 0 && (
                    <Badge content={favorites.length} style={{ '--color': '#ef4444', position: 'absolute', top: -4, right: -10 }} />
                  )}
                  {key === 'follows' && followedShops.length > 0 && (
                    <Badge content={followedShops.length} style={{ '--color': '#2563eb', position: 'absolute', top: -4, right: -10 }} />
                  )}
                </span>
                <span className="text-[11px] text-stone-600 group-hover:text-olive-700 transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 订单状态 */}
      <section className="mx-4 mt-3">
        <div className="rounded-2xl bg-white border border-cream-200 px-3 py-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-semibold text-stone-800">我的订单</h3>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className={`flex items-center gap-0.5 text-xs text-stone-400 px-2 py-1 rounded-lg ${textLinkClass}`}
            >
              全部订单 <RightOutline fontSize={12} />
            </button>
          </div>
          <div className="flex justify-between">
            {ORDER_ENTRIES.map((entry) => {
              const Icon = entry.icon
              const count = orderCountMap[entry.status] ?? 0
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => navigate(`/orders?status=${entry.status}`)}
                  className={`group flex flex-col items-center gap-1 py-1 flex-1 rounded-xl ${iconBtnClass}`}
                >
                  <span className="relative transition-transform duration-200 group-hover:scale-110">
                    <Icon fontSize={22} style={{ color: entry.color }} />
                    {count > 0 && (
                      <Badge content={count > 99 ? '99+' : count} style={{ '--color': '#ef4444', position: 'absolute', top: -6, right: -10 }} />
                    )}
                  </span>
                  <span className="text-[10px] text-stone-600 whitespace-nowrap group-hover:text-olive-700 transition-colors">{entry.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {renderPanel()}

      {/* Tab 内容区 */}
      <section className="mx-4 mt-3 mb-4 rounded-2xl bg-white border border-cream-200 overflow-hidden">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {MY_TABS.map((tab) => (
            <Tabs.Tab title={tab.label} key={tab.key} />
          ))}
        </Tabs>
        <div className="py-3 min-h-[200px]">
          {activeTab === 'guess' && renderGuessGrid()}
          {activeTab === 'reviews' && renderReviews()}
        </div>
      </section>

      <section className="mx-4 pb-4">
        <Button
          block
          fill="outline"
          shape="rounded"
          onClick={handleLogout}
          className="transition-all duration-200 hover:!border-stone-400 hover:!text-stone-700 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
          style={{ '--border-color': '#d6d3d1', '--text-color': '#78716c' }}
        >
          退出登录
        </Button>
      </section>
    </MallPageShell>
  )
}
