import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'antd-mobile'
import SubPageShell from '@/mall/components/SubPageShell'
import useCountdown from '@/mall/hooks/useCountdown'
import { getZoneFlashSale } from '@/utils/api'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'

export default function FlashSalePage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { hours, minutes, seconds } = useCountdown(data?.endTime)

  useEffect(() => {
    getZoneFlashSale()
      .then((res) => setData(res.data))
      .catch(() => setData({ list: [], endTime: Date.now() }))
      .finally(() => setLoading(false))
  }, [])

  const list = data?.list || []

  return (
    <SubPageShell title="限时秒杀">
      <div
        className="mx-4 mt-3 mb-4 px-4 py-3 rounded-2xl text-white flex items-center justify-between shadow-sm"
        style={{ background: 'linear-gradient(90deg, #FF5000 0%, #FF2D20 100%)' }}
      >
        <span className="text-sm font-bold">⚡ 秒杀进行中</span>
        <span className="font-mono text-sm tabular-nums bg-white/20 px-2 py-0.5 rounded-full">
          {hours}:{minutes}:{seconds}
        </span>
      </div>

      {loading ? (
        <HomePageSkeleton />
      ) : list.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-16">暂无秒杀商品</p>
      ) : (
        <div className="px-4 pb-6 space-y-3">
          {list.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                navigate(`/product/${item.id}`, {
                  state: { zoneTag: '限时秒杀', flashPrice: item.flashPrice },
                })
              }
              className="w-full flex gap-3 p-3 rounded-2xl bg-white border border-cream-200 shadow-md active:scale-[0.99] transition-transform text-left"
            >
              <Image src={item.image} width={96} height={96} fit="cover" className="rounded-xl shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <p className="text-sm font-medium text-stone-800 line-clamp-2">{item.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#FF5000]">¥{item.flashPrice}</span>
                  <span className="text-xs text-stone-400 line-through">¥{item.price}</span>
                </div>
                <div className="mt-1">
                  <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full"
                      style={{ width: `${item.soldPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">已抢 {item.soldPercent}%</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </SubPageShell>
  )
}
