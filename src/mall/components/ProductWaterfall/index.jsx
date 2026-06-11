import { useMemo } from 'react'
import ProductCard from '@/mall/components/ProductCard'
import Bone from '@/mall/components/PageSkeleton'

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
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

export default function ProductWaterfall({ products, loading }) {
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
    return <ProductGridSkeleton />
  }

  if (!loading && !products.length) {
    return (
      <div className="text-center py-16 text-stone-400 text-sm">
        暂无商品，换个关键词试试
      </div>
    )
  }

  return (
    <div className="flex gap-3">
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
  )
}
