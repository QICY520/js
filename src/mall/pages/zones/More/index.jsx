import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppOutline,
  HeartOutline,
  CouponOutline,
  PayCircleOutline,
  MessageOutline,
  ClockCircleOutline,
} from 'antd-mobile-icons'
import SubPageShell from '@/mall/components/SubPageShell'
import { getZoneMore } from '@/utils/api'

const TOOL_ICONS = {
  footprint: ClockCircleOutline,
  favorite: HeartOutline,
  coupon: CouponOutline,
  wallet: PayCircleOutline,
  feedback: MessageOutline,
  service: MessageOutline,
}

export default function MorePage() {
  const navigate = useNavigate()
  const [data, setData] = useState({ categories: [], tools: [] })

  useEffect(() => {
    getZoneMore().then((res) => setData(res.data || { categories: [], tools: [] }))
  }, [])

  return (
    <SubPageShell title="更多">
      <section className="p-4">
        <h3 className="text-sm font-semibold text-stone-800 mb-3">全部分类</h3>
        <div className="grid grid-cols-4 gap-3">
          {data.categories?.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(cat.link)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white shadow-sm active:scale-95 transition-transform"
            >
              <span className="w-10 h-10 rounded-xl bg-olive-100 text-olive-700 flex items-center justify-center text-sm font-bold">
                {cat.icon}
              </span>
              <span className="text-[11px] text-stone-600">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="h-2 bg-gray-100" />

      <section className="p-4">
        <h3 className="text-sm font-semibold text-stone-800 mb-3">常用工具</h3>
        <div className="grid grid-cols-3 gap-3">
          {data.tools?.map((tool) => {
            const Icon = TOOL_ICONS[tool.id] || AppOutline
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => navigate(tool.link)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-sm active:scale-95 transition-transform"
              >
                <Icon fontSize={24} className="text-olive-600" />
                <span className="text-xs text-stone-600">{tool.name}</span>
              </button>
            )
          })}
        </div>
      </section>
    </SubPageShell>
  )
}
