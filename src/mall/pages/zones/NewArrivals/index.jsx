import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'antd-mobile'
import SubPageShell from '@/mall/components/SubPageShell'
import { getZoneNewArrivals } from '@/utils/api'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'

export default function NewArrivalsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState({ launched: [], upcoming: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getZoneNewArrivals()
      .then((res) => setData(res.data || { launched: [], upcoming: [] }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SubPageShell title="新品首发" headerClassName="bg-slate-50/95">
      <div className="bg-gradient-to-b from-slate-100 to-cream-50 px-4 py-6 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-olive-600 text-cream-50 text-xs font-bold tracking-widest">
          NEW
        </span>
        <p className="text-sm text-stone-500 mt-2">发现最新上架好物</p>
      </div>

      {loading ? (
        <HomePageSkeleton />
      ) : (
        <div className="px-4 pb-6 space-y-6">
          <section>
            <h3 className="text-sm font-bold text-stone-800 mb-3">已上架</h3>
            <div className="space-y-3">
              {data.launched?.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    navigate(`/product/${item.id}`, { state: { zoneTag: '新品首发' } })
                  }
                  className="w-full flex gap-3 p-3 rounded-2xl bg-white shadow-md text-left active:scale-[0.99]"
                >
                  <Image src={item.image} width={80} height={80} fit="cover" className="rounded-xl" />
                  <div className="flex-1">
                    <span className="text-[10px] text-olive-600 bg-olive-50 px-1.5 py-0.5 rounded">NEW</span>
                    <p className="text-sm font-medium text-stone-800 mt-1 line-clamp-2">{item.title}</p>
                    <p className="text-xs text-stone-400 mt-1">上架 {item.launchDate}</p>
                    <p className="text-[#FF5000] font-bold mt-1">¥{item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-stone-800 mb-3">新品预告</h3>
            <div className="relative pl-4 border-l-2 border-olive-200 space-y-4">
              {data.upcoming?.map((item) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-olive-400 border-2 border-white" />
                  <div className="rounded-2xl bg-white overflow-hidden shadow-md">
                    <Image src={item.image} fit="cover" className="w-full h-32" />
                    <div className="p-3">
                      <p className="text-sm font-medium text-stone-800">{item.title}</p>
                      <p className="text-xs text-stone-400 mt-1">预计 {item.launchDate} 开售</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </SubPageShell>
  )
}
