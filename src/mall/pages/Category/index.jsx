import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SideBar } from 'antd-mobile'
import MallPageShell from '@/mall/components/MallPageShell'
import ProductWaterfall from '@/mall/components/ProductWaterfall'
import { CategoryPageSkeleton } from '@/mall/components/PageSkeleton'
import { getCategories, getProducts } from '@/utils/api'
import mallToast from '@/mall/utils/toast'

export default function CategoryPage() {
  const [searchParams] = useSearchParams()
  const rightRef = useRef(null)

  const [categories, setCategories] = useState([])
  const [activeKey, setActiveKey] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then((res) => {
        const list = res.data || []
        setCategories(list)
        const catParam = searchParams.get('cat')
        const initial = catParam
          ? list.find((c) => String(c.id) === catParam)
          : list[0]
        if (initial) setActiveKey(String(initial.id))
      })
      .catch(() => mallToast.fail('加载分类失败'))
  }, [searchParams])

  const fetchProducts = useCallback(async (categoryId) => {
    setLoading(true)
    rightRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      const res = await getProducts({
        categoryId,
        status: 1,
        pageSize: 20,
      })
      setProducts(res.data.list)
    } catch {
      mallToast.fail('加载商品失败')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeKey) fetchProducts(Number(activeKey))
  }, [activeKey, fetchProducts])

  const activeCategory = categories.find((c) => String(c.id) === activeKey)

  return (
    <MallPageShell>
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-xl border-b border-cream-200 pt-safe">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-base font-semibold text-olive-800">商品分类</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto flex min-h-[calc(100vh-8rem)]">
        <div className="w-[88px] shrink-0 bg-cream-100 border-r border-cream-200 [&_.adm-side-bar]:--width:88px">
          <SideBar
            activeKey={activeKey}
            onChange={setActiveKey}
            style={{
              '--width': '88px',
              '--item-border-radius': '8px',
              '--background-color': '#f8f6f0',
            }}
          >
            {categories.map((cat) => (
              <SideBar.Item key={cat.id} title={cat.name} />
            ))}
          </SideBar>
        </div>

        <div ref={rightRef} className="flex-1 overflow-y-auto px-3 py-3">
          {loading && products.length === 0 ? (
            <CategoryPageSkeleton />
          ) : (
            <>
              {activeCategory?.children?.length > 0 && (
                <section className="mb-4">
                  <h3 className="text-xs font-semibold text-stone-500 mb-2">子分类</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => fetchProducts(child.id)}
                        className="px-3 py-1.5 rounded-full text-xs bg-white border border-cream-200 text-stone-600 active:bg-olive-50 active:border-olive-200 active:text-olive-700 transition-colors"
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-sm font-semibold text-stone-800">
                  {activeCategory?.name || '全部商品'}
                </h3>
                <span className="text-xs text-stone-400">{products.length} 件</span>
              </div>

              <ProductWaterfall products={products} loading={loading} />
            </>
          )}
        </div>
      </div>
    </MallPageShell>
  )
}
