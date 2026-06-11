import { Image } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
import { DETAIL_COLORS } from '@/mall/constants/productDetail'

export default function ReviewSection({ reviews }) {
  if (!reviews?.preview?.length) return null

  return (
    <section className="bg-white px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold" style={{ color: DETAIL_COLORS.textMain }}>
          评价 {reviews.total > 0 ? `(${reviews.total})` : ''}
        </h3>
        <button type="button" className="flex items-center text-xs text-stone-400">
          查看全部 <RightOutline fontSize={12} />
        </button>
      </div>
      <div className="space-y-4">
        {reviews.preview.map((item) => (
          <div key={item.id} className="flex gap-3">
            <Image
              src={item.avatar}
              fit="cover"
              className="w-8 h-8 rounded-full shrink-0"
              lazy
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-stone-600">{item.user}</p>
              <p className="text-sm text-stone-700 mt-1 leading-relaxed line-clamp-2">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
