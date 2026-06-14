import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getShopById, getProducts } from '@/utils/api'
import ShopHeader from '@/mall/components/shop/ShopHeader'
import PromoBanner from '@/mall/components/shop/PromoBanner'
import ShopProductCard from '@/mall/components/shop/ShopProductCard'
import ShopTabBar from '@/mall/components/shop/ShopTabBar'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'
import mallToast from '@/mall/utils/toast'

export default function ShopHome() {
  const { shopId } = useParams()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getShopById(shopId),
      getProducts({ shopId, status: 1, pageSize: 18 }),
    ])
      .then(([shopRes, prodRes]) => {
        setShop(shopRes.data)
        setProducts(prodRes.data.list)
      })
      .catch(() => mallToast.fail('店铺加载失败'))
      .finally(() => setLoading(false))
  }, [shopId])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pb-16">
        <HomePageSkeleton />
      </div>
    )
  }

  if (!shop) return null

  return (
    <div className="min-h-screen bg-cream-50 pb-16 mall-main">
      <ShopHeader shop={shop} />
      <PromoBanner title={shop.promoNotice} endTime={shop.promoEndTime} />

      {shop.shopDescription && (
        <p className="mx-4 mt-3 text-xs text-stone-500 leading-relaxed line-clamp-2">
          {shop.shopDescription}
        </p>
      )}

      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-olive-800">店铺热卖</h2>
          <span className="text-[10px] text-stone-400">{products.length} 件</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {products.map((p) => (
            <ShopProductCard key={p.id} product={p} compact />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-stone-400 text-sm py-16">暂无在售商品</p>
        )}
      </section>

      <ShopTabBar shopId={shopId} />
    </div>
  )
}
