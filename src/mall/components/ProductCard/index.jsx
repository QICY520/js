import { useNavigate } from 'react-router-dom'
import { Image } from 'antd-mobile'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
      className="mb-3 break-inside-avoid rounded-2xl bg-white overflow-hidden shadow-md shadow-stone-900/8 hover:shadow-xl hover:shadow-olive-900/12 active:scale-[0.98] transition-all duration-300 cursor-pointer border border-cream-200/80"
    >
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          fit="cover"
          lazy
          className="w-full"
          style={{ minHeight: product.id % 3 === 0 ? 180 : product.id % 2 === 0 ? 150 : 165 }}
        />
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-stone-800/70 text-cream-50 text-[10px] backdrop-blur-sm">
            售罄
          </span>
        )}
      </div>

      <div className="p-3">
        <h4 className="text-sm text-stone-700 leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h4>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <span className="text-[10px] text-olive-500 font-medium">¥</span>
            <span className="text-lg font-bold text-olive-700 tracking-tight">
              {product.price}
            </span>
          </div>
          <span className="text-[10px] text-stone-400">
            {product.stock > 0 ? `库存 ${product.stock}` : '补货中'}
          </span>
        </div>
      </div>
    </article>
  )
}
