import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

function GuessProductCard({ product }) {
  const navigate = useNavigate()
  const soldCount = 3200 + product.id * 487

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
      className="group mb-3 break-inside-avoid rounded-2xl bg-white overflow-hidden border border-cream-200 shadow-md cursor-pointer transition-all duration-200 hover:border-olive-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.originalPrice > product.price && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-[#FF5000] text-white">
            立减
          </span>
        )}
      </div>
      <div className="px-3 py-3">
        <p className="text-sm text-stone-800 line-clamp-2 leading-snug min-h-[2.5rem] font-medium">
          {product.title}
        </p>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="text-[#FF5000] font-bold text-base">¥{product.price}</span>
          <span className="text-[11px] text-stone-400 shrink-0">已售{soldCount}</span>
        </div>
      </div>
    </article>
  )
}

export default memo(GuessProductCard)
