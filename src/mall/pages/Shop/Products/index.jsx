import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getShopById, getProducts } from '@/utils/api'
import ShopHeader from '@/mall/components/shop/ShopHeader'
import ShopProductCard from '@/mall/components/shop/ShopProductCard'
import ShopTabBar from '@/mall/components/shop/ShopTabBar'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'
import mallToast from '@/mall/utils/toast'

export default function ShopProducts() {
  const { shopId } = useParams()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getShopById(shopId),
      getProducts({ shopId, pageSize: 100 }),
    ])
      .then(([shopRes, prodRes]) => {
        setShop(shopRes.data)
        setProducts(prodRes.data.list.filter((p) => p.status === 1))
      })
      .catch(() => mallToast.fail('加载失败'))
      .finally(() => setLoading(false))
  }, [shopId])

  if (loading) {
    return (
      <div className="min-h-screen pb-16">
        <HomePageSkeleton />
      </div>
    )
  }

  if (!shop) return null

  return (
    <div className="min-h-screen pb-16 max-w-lg mx-auto">
      <ShopHeader shop={shop} />
      <section className="px-4 pt-4">
        <p className="text-xs text-stone-400 mb-3">共 {products.length} 件宝贝</p>
        <div className="grid grid-cols-3 gap-2.5">
          {products.map((p) => (
            <ShopProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>
      <ShopTabBar shopId={shopId} />
    </div>
  )
}
