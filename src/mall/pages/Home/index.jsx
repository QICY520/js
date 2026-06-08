import { useState, useEffect, useCallback } from 'react'
import mallToast from '@/mall/utils/toast'
import MallPageShell from '@/mall/components/MallPageShell'
import GlassSearchNav from '@/mall/components/GlassSearchNav'
import HeroCarousel from '@/mall/components/HeroCarousel'
import CategoryGrid from '@/mall/components/CategoryGrid'
import ProductWaterfall from '@/mall/components/ProductWaterfall'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'
import { getProducts } from '@/utils/api'

export default function MallHome() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState(null)

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const res = await getProducts({
        status: 1,
        pageSize: 20,
        ...params,
      })
      setProducts(res.data.list)
    } catch {
      mallToast.fail('加载商品失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (categoryId) params.categoryId = categoryId
    fetchProducts(params)
  }, [fetchProducts, keyword, categoryId])

  const handleSearch = (value) => {
    setKeyword(value.trim())
    setCategoryId(null)
  }

  const handleCategoryClick = (id) => {
    setCategoryId(id)
    setKeyword('')
    const name = ['男装', '女装', '配饰', '手机', '电脑', '配件', '家具', '家纺', '护肤', '彩妆']
      .find((_, i) => [101, 102, 103, 201, 202, 203, 301, 302, 401, 402][i] === id)
    mallToast.success(`已筛选分类：${name}`)
  }

  return (
    <MallPageShell className="bg-cream-50">
      <GlassSearchNav onSearch={handleSearch} />

      <main className="max-w-lg mx-auto">
        <HeroCarousel />
        <CategoryGrid onCategoryClick={handleCategoryClick} />

        <section className="px-4 mt-8">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-800">
              {categoryId ? '分类好物' : keyword ? '搜索结果' : '热门推荐'}
            </h3>
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
