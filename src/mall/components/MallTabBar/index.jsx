import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppOutline,
  UnorderedListOutline,
  ShopbagOutline,
  AppstoreOutline,
  MessageOutline,
} from 'antd-mobile-icons'
import useCartStore from '@/mall/store/useCartStore'
import useUserStore from '@/mall/store/useUserStore'
import useAuthHydration from '@/mall/hooks/useAuthHydration'
import mallToast from '@/mall/utils/toast'

const TABS = [
  { key: '/', label: '首页', icon: AppOutline, match: (p) => p === '/' || p === '/mall', auth: false },
  { key: '/category', label: '分类', icon: AppstoreOutline, match: (p) => p === '/category', auth: false },
  { key: '/messages', label: '消息', icon: MessageOutline, match: (p) => p === '/messages', auth: true },
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
  const unreadMessages = useUserStore((s) => s.unreadMessages)

  const handleTabClick = (tab) => {
    if (tab.auth && !isLoggedIn) {
      mallToast.info('请先登录')
      navigate('/login', { state: { from: tab.key } })
      return
    }
    navigate(tab.key)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-t border-cream-200/60 safe-bottom"
      style={{ boxShadow: '0 -0.5px 0 rgba(0,0,0,0.05)' }}>
      <div className="max-w-lg mx-auto flex">
        {TABS.map((tab) => {
          const { key, label, icon: Icon, match } = tab
          const active = match(location.pathname)
          const badgeCount = key === '/cart' ? cartCount : key === '/messages' ? unreadMessages : 0

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`flex-1 flex flex-col items-center pt-1.5 pb-1 gap-0 transition-all duration-200 relative group ${
                active ? 'text-olive-700' : 'text-stone-400'
              }`}
            >
              <span className="relative transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                <Icon fontSize={22} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-semibold">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-medium tracking-wide transition-transform duration-200 group-hover:scale-110 ${
                active ? 'font-semibold' : ''
              }`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
