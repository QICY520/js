import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'antd-mobile'
import { getHomeFlashSale } from '@/utils/api'
import useCountdown from '@/mall/hooks/useCountdown'

export default function FlashSale() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [endTime, setEndTime] = useState(null)
  const [products, setProducts] = useState([])
  const { hours, minutes, seconds, finished } = useCountdown(endTime)

  useEffect(() => {
    getHomeFlashSale()
      .then((res) => {
        setEndTime(res.data.endTime)
        setProducts(res.data.products || [])
      })
      .catch(() => {})
  }, [])

  if (!products.length) return null

  return (
    <section id="flash-sale" className="px-4 mt-5">
      <div className="rounded-2xl bg-gradient-to-br from-red-50 to-cream-50 border border-red-100/80 overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-red-600 tracking-tight">限时秒杀</span>
            {!finished && (
              <div className="flex items-center gap-0.5 text-xs font-mono">
                {[hours, minutes, seconds].map((unit, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    {i > 0 && <span className="text-red-400 font-bold">:</span>}
                    <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1 rounded bg-red-600 text-white font-semibold tabular-nums">
                      {unit}
                    </span>
                  </span>
                ))}
              </div>
            )}
            {finished && (
              <span className="text-xs text-stone-400">本场已结束</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => scrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' })}
            className="text-xs text-stone-400"
          >
            更多 ›
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {products.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/product/${item.id}`)}
              className="shrink-0 w-24 text-left active:scale-95 transition-transform"
            >
              <div className="relative rounded-xl overflow-hidden bg-cream-100 aspect-square w-24">
                <Image src={item.image} fit="cover" className="!w-full !h-full" lazy />
              </div>
              <p className="mt-1.5 text-sm font-bold text-red-600">
                ¥{item.price}
              </p>
              {item.originalPrice && (
                <p className="text-[10px] text-stone-400 line-through">
                  ¥{item.originalPrice}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
