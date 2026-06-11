import { useNavigate } from 'react-router-dom'
import { SearchBar } from 'antd-mobile'
import { LinkOutline, ShopbagOutline, UserCircleOutline } from 'antd-mobile-icons'
import useCartStore from '@/mall/store/useCartStore'
import useMallUserStore from '@/mall/store/useMallUserStore'
import useAuthHydration from '@/mall/hooks/useAuthHydration'
import mallToast from '@/mall/utils/toast'

export default function GlassSearchNav({ onSearch }) {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuthHydration()
  const logout = useMallUserStore((s) => s.logout)
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  )

  const handleCartClick = () => {
    if (!isLoggedIn) {
      mallToast.info('请先登录后查看购物车')
      navigate('/login', { state: { from: '/cart' } })
      return
    }
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
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-cream-50/70 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_24px_rgba(43,55,40,0.06)]" />
      <div className="relative max-w-lg mx-auto px-4 pt-safe pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-base font-semibold tracking-tight text-olive-800 shrink-0">
            LUMIÈRE
          </h1>
          <button
            type="button"
            onClick={handleUserClick}
            className="flex items-center gap-1 text-[10px] text-stone-500 hover:text-olive-600 transition-colors"
          >
            <UserCircleOutline fontSize={14} />
            {isLoggedIn ? user?.nickname : '登录'}
          </button>
          <button
            type="button"
            onClick={handleCartClick}
            className="ml-auto relative text-stone-500 hover:text-olive-600 transition-colors mr-3"
            aria-label="购物车"
          >
            <ShopbagOutline fontSize={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-olive-600 text-cream-50 text-[10px] flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="text-stone-400 hover:text-olive-600 transition-colors"
            aria-label="管理后台"
          >
            <LinkOutline fontSize={18} />
          </button>
        </div>

        <div className="rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-inner overflow-hidden [&_.adm-search-bar]:bg-transparent [&_.adm-search-bar-input-box]:bg-white/60 [&_.adm-search-bar-input-box]:border-0 [&_.adm-search-bar-input-box]:rounded-xl [&_.adm-search-bar-input-box]:shadow-sm">
          <SearchBar
            placeholder="搜索心仪好物"
            style={{ '--background': 'transparent', '--height': '40px' }}
            onSearch={onSearch}
            onClear={() => onSearch('')}
          />
        </div>
      </div>
    </header>
  )
}
