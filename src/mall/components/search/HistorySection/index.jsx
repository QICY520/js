import { DeleteOutline } from 'antd-mobile-icons'

/**
 * 历史搜索：localStorage 药丸标签，支持清空
 */
export default function HistorySection({ history = [], onSelect, onClear, onRemove }) {
  if (!history.length) return null

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-800">历史搜索</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-stone-400 active:text-stone-600 p-1"
          aria-label="清空历史"
        >
          <DeleteOutline fontSize={18} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((tag) => (
          <span key={tag} className="inline-flex items-center">
            <button
              type="button"
              onClick={() => onSelect?.(tag)}
              className="px-3.5 py-1.5 rounded-full bg-stone-100 text-xs text-stone-600 active:bg-stone-200 transition-colors"
            >
              {tag}
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="ml-0.5 -mr-1 px-1 text-stone-300 text-xs active:text-stone-500"
                aria-label={`删除 ${tag}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
    </section>
  )
}
