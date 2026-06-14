import { useNavigate } from 'react-router-dom'
import {
  LeftOutline,
  SearchOutline,
  CameraOutline,
  AudioOutline,
} from 'antd-mobile-icons'

/**
 * 搜索页头部：返回、大圆角搜索框、橙色搜索按钮
 */
export default function SearchBarHeader({
  searchKey = '',
  onSearchKeyChange,
  onSearch,
}) {
  const navigate = useNavigate()

  const handleSubmit = () => {
    onSearch?.(searchKey)
  }

  return (
    <header className="bg-white pt-safe border-b border-cream-200">
      <div className="mall-container pb-3">
        <div className="flex items-center gap-3 py-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-stone-600 shrink-0 active:opacity-60"
            aria-label="返回"
          >
            <LeftOutline fontSize={22} />
          </button>
          <h1 className="text-sm font-semibold text-stone-800">搜索</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center h-11 pl-3 pr-2 rounded-full bg-cream-100 border border-cream-200">
            <SearchOutline fontSize={18} className="text-stone-400 shrink-0" />
            <input
              type="search"
              value={searchKey}
              onChange={(e) => onSearchKeyChange?.(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="搜索商品、品牌"
              className="flex-1 min-w-0 mx-2 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 outline-none"
            />
            <button type="button" className="p-1 text-stone-400 active:text-stone-600" aria-label="拍照搜索">
              <CameraOutline fontSize={20} />
            </button>
            <button type="button" className="p-1 text-stone-400 active:text-stone-600" aria-label="语音搜索">
              <AudioOutline fontSize={20} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="shrink-0 h-11 px-4 rounded-full bg-orange-500 text-white text-sm font-semibold active:bg-orange-600 active:scale-95 transition-all shadow-sm"
          >
            搜索
          </button>
        </div>
      </div>
    </header>
  )
}
