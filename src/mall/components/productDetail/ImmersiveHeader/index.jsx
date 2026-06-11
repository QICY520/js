import { useNavigate } from 'react-router-dom'
import { LeftOutline, SendOutline, ShopbagOutline } from 'antd-mobile-icons'
import useCartStore from '@/mall/store/useCartStore'
import mallToast from '@/mall/utils/toast'

export default function ImmersiveHeader({ onCartClick }) {
  const navigate = useNavigate()
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  )

  const iconBtn =
    'w-9 h-9 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center text-white active:scale-95 transition-transform'

  const handleShare = () => {
    mallToast.success('分享链接已复制')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe pointer-events-none">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between pointer-events-auto">
        <button type="button" onClick={() => navigate(-1)} className={iconBtn} aria-label="返回">
          <LeftOutline fontSize={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={handleShare} className={iconBtn} aria-label="分享">
            <SendOutline fontSize={18} />
          </button>
          <button type="button" onClick={onCartClick} className={`${iconBtn} relative`} aria-label="购物车">
            <ShopbagOutline fontSize={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#FF5000] text-white text-[10px] flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
