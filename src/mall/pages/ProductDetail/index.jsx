import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getProductById } from '@/utils/api'
import useCartStore from '@/mall/store/useCartStore'
import useAuthHydration from '@/mall/hooks/useAuthHydration'
import { buildLoginPath } from '@/mall/constants/auth'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'
import ImmersiveHeader from '@/mall/components/productDetail/ImmersiveHeader'
import ProductGallery from '@/mall/components/productDetail/ProductGallery'
import PromotionBar from '@/mall/components/productDetail/PromotionBar'
import PriceBlock from '@/mall/components/productDetail/PriceBlock'
import TitleBlock from '@/mall/components/productDetail/TitleBlock'
import ReviewSection from '@/mall/components/productDetail/ReviewSection'
import AskEveryone from '@/mall/components/productDetail/AskEveryone'
import DetailBottomBar from '@/mall/components/productDetail/DetailBottomBar'
import SkuPickerPopup from '@/mall/components/productDetail/SkuPickerPopup'
import SectionDivider from '@/mall/components/productDetail/SectionDivider'
import { buildCartLineKey } from '@/mall/utils/sku'
import useFootprint from '@/mall/hooks/useFootprint'
import mallToast from '@/mall/utils/toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const zoneState = location.state || {}
  const { isLoggedIn } = useAuthHydration()
  useFootprint(id)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [skuVisible, setSkuVisible] = useState(false)
  const [skuAction, setSkuAction] = useState('cart')
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    setLoading(true)
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => mallToast.fail('商品不存在或已下架'))
      .finally(() => setLoading(false))
  }, [id])

  const requireAuth = () => {
    if (!isLoggedIn) {
      mallToast.info('请先登录')
      const redirectTo = location.pathname + location.search
      navigate(buildLoginPath(redirectTo))
      return false
    }
    return true
  }

  const openSkuPicker = (action) => {
    if (!requireAuth()) return
    if (!product || product.stock === 0) {
      mallToast.fail('商品已售罄，暂时无法购买')
      return
    }
    setSkuAction(action)
    setSkuVisible(true)
  }

  const handleSkuConfirm = ({ sku, quantity, specLabel, selected }) => {
    const specKeys = (product.specs || []).map((s) => s.key)
    const lineKey = buildCartLineKey(product.id, selected, specKeys)

    const finalPrice = zoneState.flashPrice ?? sku.price

    addItem(product, quantity, {
      lineKey,
      price: finalPrice,
      image: sku.img || product.image,
      stock: sku.stock,
      specLabel,
      skuId: sku.id,
    })

    if (skuAction === 'buy') {
      mallToast.success('正在跳转结算…')
      setTimeout(() => navigate('/checkout'), 400)
    } else {
      mallToast.success(`「${product.title}」已加入购物车`)
    }
  }

  const handleCartNav = () => {
    if (!isLoggedIn) {
      mallToast.info('请先登录')
      navigate(buildLoginPath(location.pathname + location.search))
      return
    }
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <ImmersiveHeader onCartClick={handleCartNav} />
        <HomePageSkeleton />
      </div>
    )
  }

  if (!product) return null

  const soldOut = product.stock === 0
  const displayProduct = {
    ...product,
    price: zoneState.flashPrice ?? product.price,
    zoneTag: zoneState.zoneTag,
    zoneRank: zoneState.rank,
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <ImmersiveHeader onCartClick={handleCartNav} />

      <div className="mall-main">
        <div className="relative">
          <ProductGallery images={product.images || [product.image]} />
        </div>
        <PromotionBar promotion={product.promotion} />
        <PriceBlock product={displayProduct} />

        <SectionDivider />
        <TitleBlock product={displayProduct} />
        <SectionDivider />
        <ReviewSection reviews={product.reviews} />
        <SectionDivider />
        <AskEveryone qaList={product.qa} />
        <SectionDivider />

        <section className="bg-white px-4 py-4 rounded-b-2xl">
          <h3 className="text-sm font-bold text-[#333333] mb-2">商品详情</h3>
          <p className="text-sm text-[#999999] leading-relaxed">{product.desc}</p>
          <div className="mt-4 rounded-xl overflow-hidden">
            <img
              src={product.images?.[1] || product.image}
              alt={product.title}
              className="w-full rounded-xl"
            />
          </div>
        </section>
      </div>

      <DetailBottomBar
        disabled={soldOut}
        shopId={product.shopId || product.shop?.shopId}
        product={product}
        onAddCart={() => openSkuPicker('cart')}
        onBuyNow={() => openSkuPicker('buy')}
      />

      <SkuPickerPopup
        visible={skuVisible}
        product={product}
        action={skuAction}
        onClose={() => setSkuVisible(false)}
        onConfirm={handleSkuConfirm}
      />
    </div>
  )
}

