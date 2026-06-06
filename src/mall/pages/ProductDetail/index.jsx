import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NavBar, Image, DotLoading, Button } from 'antd-mobile'
import { ShopbagOutline } from 'antd-mobile-icons'
import { getProductById } from '@/utils/api'
import useCartStore from '@/mall/store/useCartStore'
import mallToast from '@/mall/utils/toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => mallToast.fail('商品不存在或已下架'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product || product.stock === 0) {
      mallToast.fail('商品已售罄，暂时无法购买')
      return
    }
    addItem(product, 1)
    mallToast.success(`「${product.title}」已加入购物车`)
  }

  const handleBuyNow = () => {
    if (!product || product.stock === 0) {
      mallToast.fail('商品已售罄，暂时无法购买')
      return
    }
    addItem(product, 1)
    mallToast.success('已加入购物车，正在跳转结算…')
    setTimeout(() => navigate('/checkout'), 400)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-olive-600">
        <DotLoading color="currentColor" />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <NavBar
        onBack={() => navigate(-1)}
        right={
          <ShopbagOutline fontSize={22} onClick={() => navigate('/cart')} />
        }
        className="bg-cream-50/80 backdrop-blur-md"
      >
        商品详情
      </NavBar>

      <div className="max-w-lg mx-auto">
        <Image src={product.image} fit="cover" className="w-full aspect-square" />
        <div className="p-5">
          <h1 className="text-xl font-semibold text-stone-800">{product.title}</h1>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed">{product.desc}</p>
          <div className="mt-4 flex items-end gap-2">
            <p className="text-2xl font-bold text-olive-700">
              <span className="text-sm">¥</span>
              {product.price}
            </p>
            <span className="text-xs text-stone-400 mb-1">
              {product.stock > 0 ? `库存 ${product.stock}` : '已售罄'}
            </span>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-cream-200 px-4 py-3 safe-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            block
            shape="rounded"
            fill="outline"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{ '--border-color': '#4a6340', '--text-color': '#4a6340' }}
          >
            加入购物车
          </Button>
          <Button
            block
            color="primary"
            shape="rounded"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            style={{ '--background': '#4a6340' }}
          >
            立即购买
          </Button>
        </div>
      </footer>
    </div>
  )
}
