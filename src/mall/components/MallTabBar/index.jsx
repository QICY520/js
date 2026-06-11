import { useNavigate, useLocation } from 'react-router-dom'
import { AppOutline, UnorderedListOutline, ShopbagOutline, AppstoreOutline } from 'antd-mobile-icons'
import useCartStore from '@/mall/store/useCartStore'
import useAuthHydration from '@/mall/hooks/useAuthHydration'
import mallToast from '@/mall/utils/toast'

const TABS = [
  { key: '/', label: '首页', icon: AppOutline, match: (p) => p === '/' || p === '/mall', auth: false },
  { key: '/category', label: '分类', icon: AppstoreOutline, match: (p) => p === '/category', auth: false },
  { key: '/cart', label: '购物车', icon: ShopbagOutline, match: (p) => p === '/cart', auth: true },
  { key: '/my', label: '我的', icon: UnorderedListOutline, match: (p) => p === '/my' || p.startsWith('/orders') || p.startsWith('/addresses'), auth: true },
]

export default function MallTabBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuthHydration()
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  )

  const handleTabClick = (tab) => {
    if (tab.auth && !isLoggedIn) {
      mallToast.info('请先登录')
      navigate('/login', { state: { from: tab.key } })
      return
    }
    navigate(tab.key)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-cream-200 safe-bottom">
      <div className="max-w-lg mx-auto flex">
        {TABS.map((tab) => {
          const { key, label, icon: Icon, match } = tab
          const active = match(location.pathname)
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors relative ${
                active ? 'text-olive-700' : 'text-stone-400'
              }`}
            >
              <span className="relative">
                <Icon fontSize={22} />
                {key === '/cart' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
