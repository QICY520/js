import { useMemo } from 'react'
import { DotLoading } from 'antd-mobile'
import ProductCard from '@/mall/components/ProductCard'

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

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-olive-600">
        <DotLoading color="currentColor" />
      </div>
    )
  }

  if (!products.length) {
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
