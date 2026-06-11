/**
 * 猜你想搜：两列布局，部分关键词带淡色小字提示
 */
export default function GuessSection({ items = [], onSelect }) {
  if (!items.length) return null

  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-stone-800 mb-3">猜你想搜</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {items.map((item) => {
          const keyword = typeof item === 'string' ? item : item.keyword
          const hint = typeof item === 'string' ? null : item.hint
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => onSelect?.(keyword)}
              className="text-left active:opacity-70 transition-opacity"
            >
              <p className="text-sm text-stone-700 font-medium leading-snug">{keyword}</p>
              {hint && (
                <p className="text-[11px] text-stone-400 mt-0.5">{hint}</p>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
