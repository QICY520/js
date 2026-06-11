import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'antd-mobile'

/**
 * 热门榜单：横向 Tabs + 三列排名卡片，点击跳转商品详情
 */
export default function HotRankingList({ tabs = [] }) {
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState(tabs[0]?.key || '')

  if (!tabs.length) return null

  const activeTab = tabs.find((t) => t.key === activeKey) || tabs[0]
  const list = activeTab?.list || []

  return (
    <section className="rounded-2xl bg-cream-100/80 border border-cream-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-stone-800">LUMIÈRE 热榜</h3>
        <span className="text-[10px] text-stone-400">实时更新</span>
      </div>

      {/* 横向滚动 Tabs */}
      <div
        className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide -mx-1 px-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveKey(tab.key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeKey === tab.key
                ? 'bg-olive-600 text-cream-50'
                : 'bg-white text-stone-500 border border-cream-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 三列榜单卡片 */}
      <div className="grid grid-cols-3 gap-2.5">
        {list.map((item) => (
          <button
            key={`${activeTab.key}-${item.rank}`}
            type="button"
            onClick={() => navigate(`/product/${item.productId}`)}
            className="text-left bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="relative aspect-square">
              <Image src={item.image} fit="cover" className="w-full h-full" lazy />
              <span className="absolute bottom-0 left-0 right-0 py-0.5 text-center text-[10px] font-semibold bg-amber-100/95 text-amber-800">
                第 {item.rank} 名
              </span>
            </div>
            <p className="px-1.5 py-2 text-[11px] font-semibold text-stone-800 line-clamp-2 leading-snug min-h-[2.5rem]">
              {item.title}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}
