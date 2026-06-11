import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShopbagOutline,
  MessageOutline,
  StarOutline,
  StarFill,
} from 'antd-mobile-icons'
import mallToast from '@/mall/utils/toast'

export default function DetailBottomBar({
  disabled,
  shopId,
  product,
  onAddCart,
  onBuyNow,
}) {
  const navigate = useNavigate()
  const [favorited, setFavorited] = useState(false)
  const [cartPulse, setCartPulse] = useState(false)

  const handleFavorite = () => {
    setFavorited((v) => !v)
    mallToast.info(favorited ? '已取消收藏' : '已加入收藏')
  }

  const handleAddCart = () => {
    setCartPulse(true)
    setTimeout(() => setCartPulse(false), 200)
    onAddCart?.()
  }

  const sideBtn = 'flex flex-col items-center gap-0.5 text-[10px] text-stone-500 min-w-[44px]'

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-200 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          className={sideBtn}
          onClick={() => {
            if (shopId) navigate(`/shop/${shopId}`)
            else mallToast.info('店铺信息加载中')
          }}
        >
          <ShopbagOutline fontSize={20} className="text-stone-600" />
          店铺
        </button>
        <button
          type="button"
          className={sideBtn}
          onClick={() => {
            if (shopId) {
              navigate(`/shop/${shopId}/chat`, {
                state: { product, productId: product?.id },
              })
            } else mallToast.info('客服连接中…')
          }}
        >
          <MessageOutline fontSize={20} className="text-stone-600" />
          客服
        </button>
        <button
          type="button"
          className={`${sideBtn} transition-transform active:scale-90`}
          onClick={handleFavorite}
        >
          <span className={`transition-all duration-200 ${favorited ? 'scale-125 text-[#FF5000]' : 'scale-100'}`}>
            {favorited ? <StarFill fontSize={20} /> : <StarOutline fontSize={20} />}
          </span>
          收藏
        </button>

        <div className="flex-1 flex gap-2 ml-1">
          <button
            type="button"
            disabled={disabled}
            onClick={handleAddCart}
            className={`flex-1 h-11 rounded-full bg-[#FFBE00] text-[#333333] text-sm font-bold active:scale-[0.98] transition-transform disabled:opacity-50 ${
              cartPulse ? 'scale-105' : ''
            }`}
          >
            加入购物车
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onBuyNow}
            className="flex-1 h-11 rounded-full bg-[#FF5000] text-white text-sm font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            立即购买
          </button>
        </div>
      </div>
    </footer>
  )
}
