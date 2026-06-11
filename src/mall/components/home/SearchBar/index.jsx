import { useNavigate } from 'react-router-dom'
import { SearchOutline, ShopbagOutline, UserCircleOutline, LinkOutline } from 'antd-mobile-icons'
import useCartStore from '@/mall/store/useCartStore'
import useMallUserStore from '@/mall/store/useMallUserStore'
import useAdminStore from '@/admin/store/useAdminStore'
import useAuthHydration from '@/mall/hooks/useAuthHydration'
import mallToast from '@/mall/utils/toast'

/**
 * 沉浸式顶部搜索栏
 * scrollProgress 0→1：透明/白字 → 实色毛玻璃/深色字
 * themeRgb 与轮播主题色联动
 */
export default function SearchBar({ scrollProgress = 0, themeRgb = '74, 99, 64', onSearchClick }) {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuthHydration()
  const logout = useMallUserStore((s) => s.logout)
  const adminUser = useAdminStore((s) => s.user)
  const adminLoggedIn = useAdminStore((s) => !!(s.token && s.user))
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  )

  const p = Math.min(Math.max(scrollProgress, 0), 1)
  const isSolid = p > 0.5

  const headerStyle = {
    backgroundColor: isSolid
      ? `rgba(253, 252, 249, ${0.88 + p * 0.1})`
      : `rgba(${themeRgb}, ${0.15 + p * 0.25})`,
    backdropFilter: `blur(${8 + p * 12}px)`,
    WebkitBackdropFilter: `blur(${8 + p * 12}px)`,
    boxShadow: p > 0.3 ? '0 4px 24px rgba(43, 55, 40, 0.08)' : 'none',
    borderBottom: p > 0.3 ? '1px solid rgba(255,255,255,0.6)' : '1px solid transparent',
  }

  const textClass = isSolid ? 'text-olive-800' : 'text-cream-50'
  const subTextClass = isSolid ? 'text-stone-500' : 'text-cream-50/80'
  const iconClass = isSolid ? 'text-stone-500 hover:text-olive-600' : 'text-cream-50/90 hover:text-white'

  const handleCartClick = () => {
    navigate('/cart')
  }

  const handleUserClick = () => {
    if (isLoggedIn) {
      logout()
      mallToast.info('已退出登录')
      navigate('/login', { replace: true })
    } else {
      navigate('/login', { state: { from: '/' } })
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow] duration-300"
      style={headerStyle}
    >
      <div className="max-w-lg mx-auto px-4 pt-safe pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <h1 className={`text-base font-semibold tracking-tight shrink-0 transition-colors ${textClass}`}>
            LUMIÈRE
          </h1>
          <button
            type="button"
            onClick={handleUserClick}
            className={`flex items-center gap-1 text-[10px] transition-colors ${subTextClass}`}
          >
            <UserCircleOutline fontSize={14} />
            {isLoggedIn ? user?.nickname : adminLoggedIn ? adminUser?.nickname : '登录'}
          </button>
          {adminLoggedIn && (
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className={`flex items-center gap-0.5 text-[10px] px-2 py-1 rounded-full transition-colors ${
                isSolid ? 'bg-olive-100 text-olive-700' : 'bg-white/20 text-cream-50'
              }`}
            >
              <LinkOutline fontSize={12} />
              后台
            </button>
          )}
          <button
            type="button"
            onClick={handleCartClick}
            className={`ml-auto relative transition-colors mr-1 ${iconClass}`}
            aria-label="购物车"
          >
            <ShopbagOutline fontSize={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-cream-50 text-[10px] flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onSearchClick}
          className={`w-full flex items-center gap-2 h-10 px-4 rounded-2xl transition-all ${
            isSolid
              ? 'bg-white/70 border border-cream-200 shadow-sm'
              : 'bg-white/20 border border-white/30 backdrop-blur-md'
          }`}
        >
          <SearchOutline fontSize={16} className={isSolid ? 'text-stone-400' : 'text-cream-50/80'} />
          <span className={`text-sm flex-1 text-left ${isSolid ? 'text-stone-400' : 'text-cream-50/70'}`}>
            搜索心仪好物
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              isSolid ? 'bg-olive-100 text-olive-600' : 'bg-white/20 text-cream-50'
            }`}
          >
            AI
          </span>
        </button>
      </div>
    </header>
  )
}
