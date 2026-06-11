import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'antd-mobile'
import SubPageShell from '@/mall/components/SubPageShell'
import { getZoneLifestyle } from '@/utils/api'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'

export default function LifestylePage() {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getZoneLifestyle()
      .then((res) => setList(res.data?.list || []))
      .finally(() => setLoading(false))
  }, [])

  const [left, right] = [
    list.filter((_, i) => i % 2 === 0),
    list.filter((_, i) => i % 2 === 1),
  ]

  const Card = ({ item }) => (
    <button
      type="button"
      onClick={() => navigate(`/product/${item.id}`, { state: { zoneTag: '品质生活' } })}
      className="mb-3 w-full rounded-2xl bg-white overflow-hidden shadow-md text-left active:scale-[0.98] transition-transform"
    >
      <Image src={item.sceneImage || item.image} fit="cover" lazy className="w-full" style={{ minHeight: 160 }} />
      <div className="p-3">
        <p className="text-[10px] text-olive-600 mb-1">达人推荐 · {item.recommendBy}</p>
        <p className="text-sm text-stone-700 line-clamp-2">{item.title}</p>
        <p className="text-base font-bold text-[#FF5000] mt-2">¥{item.price}</p>
      </div>
    </button>
  )

  return (
    <SubPageShell title="品质生活">
      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-teal-50 border-b border-cream-200">
        <p className="text-xs text-olive-700">精选家居好物，打造理想生活空间</p>
      </div>

      {loading ? (
        <HomePageSkeleton />
      ) : (
        <div className="p-4 flex gap-3">
          <div className="flex-1 min-w-0">{left.map((item) => <Card key={item.id} item={item} />)}</div>
          <div className="flex-1 min-w-0">{right.map((item) => <Card key={item.id} item={item} />)}</div>
        </div>
      )}
    </SubPageShell>
  )
}
