import { useNavigate } from 'react-router-dom'
import { LeftOutline } from 'antd-mobile-icons'

/** 金刚区二级页统一壳：返回 + 标题 */
export default function SubPageShell({ title, children, headerClassName = '', dark = false }) {
  const navigate = useNavigate()

  return (
    <div className={`min-h-screen pb-6 ${dark ? 'bg-stone-900' : 'bg-cream-50'}`}>
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b pt-safe ${
          dark
            ? 'bg-stone-900/90 border-stone-800 text-cream-50'
            : 'bg-cream-50/95 border-cream-200 text-olive-800'
        } ${headerClassName}`}
      >
        <div className="mall-container py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={dark ? 'text-cream-50' : 'text-stone-600'}
            aria-label="返回"
          >
            <LeftOutline fontSize={22} />
          </button>
          <h1 className="text-base font-semibold">{title}</h1>
        </div>
      </header>
      <main className="mall-main">{children}</main>
    </div>
  )
}
