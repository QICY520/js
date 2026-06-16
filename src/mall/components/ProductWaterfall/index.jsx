import { useMemo } from 'react'
import ProductCard from '@/mall/components/ProductCard'
import Bone from '@/mall/components/PageSkeleton'

export default function ProductWaterfall({ products, loading }) {
  const gridClass = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'

  const [leftCol, rightCol] = useMemo(() => {
    const left = []
    const right = []
    products.forEach((item, index) => {
      if (index % 2 === 0) left.push(item)
      else right.push(item)
    })
    return [left, right]
  }, [products])

  if (loading && products.length === 0) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white overflow-hidden border border-cream-200/80">
            <Bone className="h-40 w-full rounded-none" />
            <div className="p-3 space-y-2">
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-2/3" />
              <Bone className="h-5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!loading && !products.length) {
    return (
      <div className="text-center py-16 text-stone-400 text-sm">
        暂无商品，换个关键词试试
      </div>
    )
  }

  return (
    <>
      {/* 手机：双列瀑布流 */}
      <div className="flex gap-3 md:hidden">
        <div className="flex-1 min-w-0">
          {leftCol.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex-1 min-w-0">
          {rightCol.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      {/* 平板 / PC：多列网格 */}
      <div className={`${gridClass} hidden md:grid`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
