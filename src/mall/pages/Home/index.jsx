import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import mallToast from '@/mall/utils/toast'
import MallPageShell from '@/mall/components/MallPageShell'
import SearchBar from '@/mall/components/home/SearchBar'
import HomeSwiper from '@/mall/components/home/HomeSwiper'
import NavGrid from '@/mall/components/home/NavGrid'
import FlashSale from '@/mall/components/home/FlashSale'
import ProductWaterfall from '@/mall/components/ProductWaterfall'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'
import useScrollY from '@/mall/hooks/useScrollY'
import { getProducts } from '@/utils/api'

const HEADER_OFFSET = 'pt-[120px]'

export default function MallHome() {
  const navigate = useNavigate()
  const { progress } = useScrollY(50)
  const [theme, setTheme] = useState({ themeRgb: '74, 99, 64' })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProducts({ status: 1, pageSize: 50 })
      setProducts(res.data.list)
    } catch {
      mallToast.fail('加载商品失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleThemeChange = useCallback((banner) => {
    if (banner?.themeRgb) setTheme(banner)
  }, [])

  return (
    <MallPageShell className="bg-cream-50">
      <SearchBar
        scrollProgress={progress}
        themeRgb={theme.themeRgb}
        onSearchClick={() => navigate('/search')}
      />

      <main className={`max-w-lg mx-auto ${HEADER_OFFSET}`}>
        <HomeSwiper onThemeChange={handleThemeChange} />
        <NavGrid />
        <FlashSale />

        <section className="px-4 mt-8 pb-4">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-800">热门推荐</h3>
            <span className="text-xs text-stone-400">
              {loading ? '加载中…' : `${products.length} 件商品`}
            </span>
          </div>

          {loading && products.length === 0 ? (
            <HomePageSkeleton />
          ) : (
            <ProductWaterfall products={products} loading={loading} />
          )}
        </section>
      </main>
    </MallPageShell>
  )
}
