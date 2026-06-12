import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'antd-mobile'
import SubPageShell from '@/mall/components/SubPageShell'
import { getZoneValueSale } from '@/utils/api'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'

export default function ValueSalePage() {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getZoneValueSale()
      .then((res) => setList(res.data?.list || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SubPageShell title="特价">
      <div className="fixed right-4 top-24 z-30 px-3 py-1.5 rounded-full bg-[#FF5000] text-white text-xs font-bold shadow-lg">
        全场包邮
      </div>

      {loading ? (
        <HomePageSkeleton />
      ) : (
        <div className="p-4 grid grid-cols-2 gap-3">
          {list.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                navigate(`/product/${item.id}`, {
                  state: { zoneTag: '特价', flashPrice: item.salePrice },
                })
              }
              className="rounded-2xl bg-white overflow-hidden shadow-md active:scale-[0.98] transition-transform text-left"
            >
              <div className="relative aspect-square">
                <Image src={item.image} fit="cover" className="w-full h-full" lazy />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-bold">
                  特价
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-stone-700 line-clamp-2 min-h-[2rem]">{item.title}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-bold text-[#FF5000]">¥{item.salePrice}</span>
                  <span className="text-[10px] text-stone-400 line-through">¥{item.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </SubPageShell>
  )
}
