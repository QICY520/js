import { DETAIL_COLORS } from '@/mall/constants/productDetail'

export default function PriceBlock({ product }) {
  const originalPrice = product.originalPrice || Math.round(product.price * 1.35)
  const soldText = product.soldCount
    ? `已售 ${product.soldCount > 9999 ? `${Math.floor(product.soldCount / 1000) / 10}万+` : `${product.soldCount}+`}`
    : '已售 4000+'

  return (
    <section className="bg-white px-4 py-4">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xs text-[#FF5000] font-medium">优惠后</span>
          <span className="text-[#FF5000] text-sm font-bold">¥</span>
          <span className="text-3xl font-bold text-[#FF5000] leading-none tracking-tight">
            {product.price}
          </span>
          {originalPrice > product.price && (
            <span
              className="text-sm line-through mb-0.5"
              style={{ color: DETAIL_COLORS.textSub }}
            >
              ¥{originalPrice}
            </span>
          )}
        </div>
        <span className="text-xs shrink-0" style={{ color: DETAIL_COLORS.textSub }}>
          {soldText}
        </span>
      </div>
      {product.discountLabel && (
        <span className="inline-block mt-2.5 px-2 py-0.5 rounded text-xs border border-[#FF5000] text-[#FF5000] font-medium">
          {product.discountLabel}
        </span>
      )}
    </section>
  )
}
