import { useNavigate, useLocation } from 'react-router-dom'
import { AppOutline, UnorderedListOutline, MessageOutline } from 'antd-mobile-icons'

const TABS = [
  { key: 'home', label: '首页', icon: AppOutline, path: (id) => `/shop/${id}` },
  { key: 'products', label: '全部宝贝', icon: UnorderedListOutline, path: (id) => `/shop/${id}/products` },
  { key: 'chat', label: '联系客服', icon: MessageOutline, path: (id) => `/shop/${id}/chat` },
]

export default function ShopTabBar({ shopId }) {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = (() => {
    if (location.pathname.endsWith('/chat')) return 'chat'
    if (location.pathname.endsWith('/products')) return 'products'
    return 'home'
  })()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-md border-t border-cream-200 safe-bottom">
      <div className="mall-main flex">
        {TABS.map(({ key, label, icon: Icon, path }) => {
          const active = activeKey === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => navigate(path(shopId))}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
                active ? 'text-olive-700 font-medium' : 'text-stone-400'
              }`}
            >
              <Icon fontSize={20} />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
