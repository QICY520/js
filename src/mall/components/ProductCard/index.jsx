import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'antd-mobile'

const FALLBACK_IMAGE = '/product-assets/shirt.jpg'

const BADGE_STYLES = {
  self: 'bg-olive-600 text-cream-50',
  sale: 'bg-red-500 text-white',
  hot: 'bg-orange-500 text-white',
  promo: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
  flash: 'bg-red-600 text-white',
}

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_IMAGE)
  const badgeClass = BADGE_STYLES[product.badgeType] || 'bg-olive-600/90 text-cream-50'

  useEffect(() => {
    setImgSrc(product.image || FALLBACK_IMAGE)
  }, [product.image])

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
      className="mb-3 break-inside-avoid rounded-2xl bg-white overflow-hidden shadow-lg shadow-stone-900/8 hover:shadow-xl hover:shadow-olive-900/12 active:scale-[0.98] transition-all duration-300 cursor-pointer border border-cream-200/80"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <Image
          src={imgSrc}
          fit="cover"
          lazy
          className="!w-full !h-full"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        {product.badge && (
          <span
            className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-medium shadow-sm ${badgeClass}`}
          >
            {product.badge}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-stone-800/70 text-cream-50 text-[10px] backdrop-blur-sm">
            售罄
          </span>
        )}
      </div>

      <div className="p-3">
        <h4 className="text-sm text-stone-700 leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h4>
        <div className="mt-2 flex items-end justify-between gap-1">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-[10px] text-red-500 font-medium">¥</span>
            <span className="text-lg font-bold text-red-600 tracking-tight">
              {product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-stone-400 line-through">
                ¥{product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 shrink-0">
            {product.stock > 0 ? `${product.stock}+` : '补货中'}
          </span>
        </div>
      </div>
    </article>
  )
}
