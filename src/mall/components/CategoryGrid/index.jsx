import {
  AppOutline,
  ShopbagOutline,
  GiftOutline,
  PhoneFill,
  AppstoreOutline,
  SetOutline,
  ContentOutline,
  HeartOutline,
  SmileOutline,
  StarOutline,
} from 'antd-mobile-icons'

const categories = [
  { id: 101, name: '男装', icon: AppOutline, color: 'from-olive-400 to-olive-600' },
  { id: 102, name: '女装', icon: ShopbagOutline, color: 'from-rose-300 to-rose-500' },
  { id: 103, name: '配饰', icon: GiftOutline, color: 'from-amber-300 to-amber-500' },
  { id: 201, name: '手机', icon: PhoneFill, color: 'from-sea-400 to-sea-600' },
  { id: 202, name: '电脑', icon: AppstoreOutline, color: 'from-indigo-300 to-indigo-500' },
  { id: 203, name: '配件', icon: SetOutline, color: 'from-cyan-300 to-cyan-500' },
  { id: 301, name: '家具', icon: ContentOutline, color: 'from-stone-400 to-stone-600' },
  { id: 302, name: '家纺', icon: HeartOutline, color: 'from-pink-300 to-pink-400' },
  { id: 401, name: '护肤', icon: SmileOutline, color: 'from-teal-300 to-teal-500' },
  { id: 402, name: '彩妆', icon: StarOutline, color: 'from-fuchsia-300 to-fuchsia-500' },
]

export default function CategoryGrid({ onCategoryClick }) {
  return (
    <section className="px-4 mt-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold text-stone-800">精选分类</h3>
        <span className="text-xs text-stone-400">探索更多</span>
      </div>

      <div className="grid grid-cols-5 gap-y-5 gap-x-2">
        {categories.map(({ id, name, icon: Icon, color }) => (
          <button
            key={id}
            type="button"
            onClick={() => onCategoryClick?.(id)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md shadow-stone-900/10 group-active:scale-95 transition-transform`}
            >
              <Icon fontSize={20} color="#fdfcf9" />
            </div>
            <span className="text-[11px] text-stone-600 font-medium">{name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
