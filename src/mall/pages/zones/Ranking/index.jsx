import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, Image } from 'antd-mobile'
import { getZoneRanking } from '@/utils/api'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'

const MEDAL = {
  1: { bg: 'from-yellow-300 to-amber-500', label: '🥇', glow: 'shadow-amber-200' },
  2: { bg: 'from-stone-200 to-stone-400', label: '🥈', glow: 'shadow-stone-200' },
  3: { bg: 'from-orange-200 to-orange-400', label: '🥉', glow: 'shadow-orange-200' },
}

function RankCard({ item, onClick }) {
  const medal = MEDAL[item.rank]
  const isTop3 = item.rank <= 3

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex gap-3 p-3 rounded-2xl bg-white text-left active:scale-[0.99] transition-all ${
        isTop3 ? `shadow-lg ${medal?.glow}` : 'shadow-sm'
      }`}
    >
      <div className="relative shrink-0">
        <Image src={item.image} width={72} height={72} fit="cover" className="rounded-xl" />
        {isTop3 ? (
          <span
            className={`absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br ${medal.bg} text-white text-xs flex items-center justify-center font-bold shadow`}
          >
            {item.rank}
          </span>
        ) : (
          <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-stone-200 text-stone-600 text-[10px] flex items-center justify-center font-bold">
            {item.rank}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-800 line-clamp-2">{item.title}</p>
        <p className="text-xs text-stone-400 mt-1">月销 {item.soldCount}+</p>
        <p className="text-base font-bold text-[#FF5000] mt-1">¥{item.price}</p>
      </div>
    </button>
  )
}

export default function RankingPage() {
  const navigate = useNavigate()
  const [tabs, setTabs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getZoneRanking()
      .then((res) => setTabs(res.data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-cream-50 pb-6">
      <div
        className="relative h-36 bg-gradient-to-br from-olive-700 via-olive-600 to-olive-800 flex items-end px-4 pb-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-0 pt-safe mt-3 text-cream-50 text-sm"
        >
          ← 返回
        </button>
        <div>
          <h1 className="text-xl font-bold text-cream-50">LUMIÈRE 热榜</h1>
          <p className="text-xs text-cream-50/70 mt-1">真实销量排序 · 每日更新</p>
        </div>
      </div>

      {loading ? (
        <HomePageSkeleton />
      ) : (
        <Tabs className="px-2 pt-2">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.key} title={tab.label}>
              <div className="p-4 space-y-3">
                {tab.list?.map((item) => (
                  <RankCard
                    key={item.id}
                    item={item}
                    onClick={() =>
                      navigate(`/product/${item.id}`, {
                        state: { zoneTag: '热榜推荐', rank: item.rank },
                      })
                    }
                  />
                ))}
              </div>
            </Tabs.Tab>
          ))}
        </Tabs>
      )}
    </div>
  )
}
