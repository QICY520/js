import { useNavigate } from 'react-router-dom'

export default function GuessProductCard({ product }) {
  const navigate = useNavigate()
  const soldCount = 3200 + product.id * 487

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
      className="mb-3 break-inside-avoid rounded-2xl bg-white overflow-hidden border border-cream-200 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {product.originalPrice > product.price && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-[#FF5000] text-white">
            立减
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs text-stone-700 line-clamp-2 leading-snug min-h-[2rem]">
          {product.title}
        </p>
        <div className="mt-1.5 flex items-baseline justify-between gap-1">
          <span className="text-[#FF5000] font-bold text-sm">¥{product.price}</span>
          <span className="text-[9px] text-stone-400 shrink-0">已售{soldCount}</span>
        </div>
      </div>
    </article>
  )
}
