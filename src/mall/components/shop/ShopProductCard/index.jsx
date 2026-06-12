import { useNavigate } from 'react-router-dom'

export default function ShopProductCard({ product, compact = false }) {
  const navigate = useNavigate()
  const soldCount = 3200 + product.id * 487

  return (
    <button
      type="button"
      onClick={() => navigate(`/product/${product.id}`)}
      className="text-left w-full bg-white rounded-xl overflow-hidden border border-cream-200/90 shadow-md shadow-stone-900/5 active:scale-[0.98] transition-transform"
    >
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-[4/5]'}`}>
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        {product.originalPrice > product.price && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-olive-600/90 text-cream-50">
            立减
          </span>
        )}
      </div>
      <div className="px-2 py-2">
        <p className="text-[11px] text-stone-600 line-clamp-2 leading-snug min-h-[2rem]">
          {product.title}
        </p>
        <div className="flex items-baseline justify-between mt-1.5 gap-1">
          <span className="text-olive-700 font-semibold text-xs">
            ¥{product.price}
          </span>
          <span className="text-[9px] text-stone-400 shrink-0">已售{soldCount}</span>
        </div>
      </div>
    </button>
  )
}
