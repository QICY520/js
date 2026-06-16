import { useState } from 'react'
import { LeftOutline, StarFill } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import { followShop } from '@/utils/api'
import useUserStore from '@/mall/store/useUserStore'
import mallToast from '@/mall/utils/toast'

export default function ShopHeader({ shop, onFollowChange }) {
  const navigate = useNavigate()
  const isFollowed = useUserStore((s) => s.isFollowedShop(shop?.shopId))
  const toggleFollowShop = useUserStore((s) => s.toggleFollowShop)
  const [loading, setLoading] = useState(false)

  if (!shop) return null

  const handleFollow = async () => {
    setLoading(true)
    try {
      const next = !isFollowed
      await followShop(shop.shopId, next)
      toggleFollowShop(shop.shopId)
      onFollowChange?.(next)
      mallToast.success(next ? '关注成功' : '已取消关注')
    } catch (err) {
      mallToast.fail(err.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-cream-50/95 backdrop-blur-md border-b border-cream-200">
      <div className="mall-container pt-safe">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 py-2.5 text-sm text-stone-500 hover:text-olive-700 transition-colors"
        >
          <LeftOutline fontSize={18} />
          返回
        </button>

        <div className="flex items-center gap-3 pb-3">
          <img
            src={shop.shopLogo}
            alt={shop.shopName}
            className="w-11 h-11 rounded-xl border border-cream-200 object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-olive-800 truncate">{shop.shopName}</h1>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
              <span className="flex items-center gap-0.5 text-olive-600">
                <StarFill fontSize={10} />
                {shop.rating}
              </span>
              <span>{(shop.fansCount / 10000).toFixed(1)}万粉</span>
              <span>{shop.productCount ?? 0}件</span>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleFollow}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isFollowed
                ? 'bg-cream-200 text-stone-500'
                : 'bg-olive-600 text-cream-50 active:bg-olive-700'
            }`}
          >
            {isFollowed ? '已关注' : '+ 关注'}
          </button>
        </div>
      </div>
    </header>
  )
}
