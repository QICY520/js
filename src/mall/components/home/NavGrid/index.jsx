import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClockCircleOutline,
  CouponOutline,
  GiftOutline,
  FireFill,
  StarOutline,
  AppOutline,
  MoreOutline,
  ShopbagOutline,
} from 'antd-mobile-icons'
import { getHomeNavGrid } from '@/utils/api'

const ICON_MAP = {
  flash: ClockCircleOutline,
  coupon: CouponOutline,
  sale: FireFill,
  new: StarOutline,
  rank: AppOutline,
  farm: ShopbagOutline,
  gift: GiftOutline,
  more: MoreOutline,
}

/** 8 宫格：2 行 × 4 列 */
const FALLBACK_NAV = [
  { id: 'flash', name: '限时秒杀', icon: 'flash', color: 'from-red-500 to-red-700', link: '/flash-sale' },
  { id: 'sale', name: '特价', icon: 'sale', color: 'from-amber-400 to-orange-500', link: '/value-sale' },
  { id: 'rank', name: '排行榜', icon: 'rank', color: 'from-yellow-400 to-amber-500', link: '/ranking' },
  { id: 'coupon', name: '领券中心', icon: 'coupon', color: 'from-orange-400 to-red-500', link: '/coupon' },
  { id: 'new', name: '新品首发', icon: 'new', color: 'from-olive-400 to-olive-600', link: '/new-arrivals' },
  { id: 'farm', name: '品质生活', icon: 'farm', color: 'from-green-400 to-teal-600', link: '/lifestyle' },
  { id: 'gift', name: '礼品卡', icon: 'gift', color: 'from-pink-400 to-rose-500', link: '/gift-card' },
  { id: 'more', name: '更多', icon: 'more', color: 'from-stone-400 to-stone-600', link: '/more' },
]

export default function NavGrid({ onItemClick }) {
  const navigate = useNavigate()
  const [items, setItems] = useState(FALLBACK_NAV)

  useEffect(() => {
    getHomeNavGrid()
      .then((res) => {
        if (res.data?.length) setItems(res.data)
      })
      .catch(() => {})
  }, [])

  const handleClick = (item) => {
    onItemClick?.(item)
    navigate(item.link || '/more')
  }

  return (
    <section className="px-4 mt-4">
      <div className="grid grid-cols-4 grid-rows-2 gap-y-5 gap-x-2">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon] || AppOutline
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item)}
              className="group flex flex-col items-center gap-2 active:scale-95 transition-transform duration-300"
            >
              <div
                className={`nav-icon-shine w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md shadow-stone-900/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-lg`}
              >
                <Icon fontSize={22} color="#fdfcf9" />
              </div>
              <span className="text-[11px] text-stone-600 font-medium text-center leading-tight">
                {item.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
