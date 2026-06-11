import { ShopbagOutline } from 'antd-mobile-icons'
import { DETAIL_COLORS } from '@/mall/constants/productDetail'

export default function TitleBlock({ product }) {
  const tags = product.serviceTags || []

  return (
    <section className="bg-white px-4 pb-4">
      <div className="flex gap-2 items-start flex-wrap">
        {product.zoneTag && (
          <span className="shrink-0 mt-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-white font-medium">
            {product.zoneTag}
            {product.zoneRank ? ` TOP${product.zoneRank}` : ''}
          </span>
        )}
        {product.badge && (
          <span className="shrink-0 mt-1 px-1.5 py-0.5 rounded text-[10px] bg-[#FF5000] text-white font-medium">
            {product.badge}
          </span>
        )}
        <h1
          className="text-base font-bold leading-snug line-clamp-2 flex-1"
          style={{ color: DETAIL_COLORS.textMain }}
        >
          <ShopbagOutline fontSize={14} className="inline mr-1 text-olive-600 -mt-0.5" />
          {product.title}
        </h1>
      </div>
      {product.desc && (
        <p className="text-xs mt-2 leading-relaxed" style={{ color: DETAIL_COLORS.textSub }}>
          {product.desc}
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md text-xs bg-olive-50 text-olive-700 border border-olive-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
