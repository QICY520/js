import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NavBar,
  Image,
  Radio,
  Button,
  Popup,
  Input,
  SpinLoading,
} from 'antd-mobile'
import {
  EnvironmentOutline,
  AlipayCircleFill,
  PayCircleOutline,
  RightOutline,
} from 'antd-mobile-icons'
import useCartStore from '@/mall/store/useCartStore'
import useOrderStore from '@/mall/store/useOrderStore'
import { createOrder, payOrder } from '@/utils/api'
import { normalizeOrder } from '@/mall/constants/order'
import mallToast from '@/mall/utils/toast'

const MOCK_ADDRESS = {
  name: '张三',
  phone: '138****8888',
  detail: '上海市浦东新区张江路 88 号 LUMIÈRE 公寓 3 栋 1201',
}

const PAYMENT_METHODS = [
  { value: 'wechat', label: '微信支付', icon: PayCircleOutline, color: '#07c160' },
  { value: 'alipay', label: '支付宝', icon: AlipayCircleFill, color: '#1677ff' },
]

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const getSelectedItems = useCartStore((s) => s.getSelectedItems)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const removeSelected = useCartStore((s) => s.removeSelected)
  const addOrder = useOrderStore((s) => s.addOrder)

  const [paymentMethod, setPaymentMethod] = useState('wechat')
  const [payPopupVisible, setPayPopupVisible] = useState(false)
  const [pendingOrder, setPendingOrder] = useState(null)
  const [payPassword, setPayPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(false)

  const selectedItems = getSelectedItems()
  const totalPrice = getTotalPrice()

  useEffect(() => {
    if (selectedItems.length === 0 && !pendingOrder) {
      mallToast.info('请先选择要结算的商品')
      navigate('/cart', { replace: true })
    }
  }, [selectedItems.length, pendingOrder, navigate])

  const handleSubmitOrder = async () => {
    setSubmitting(true)
    mallToast.loading('订单创建中...')
    try {
      const address = `${MOCK_ADDRESS.name} ${MOCK_ADDRESS.phone} ${MOCK_ADDRESS.detail}`
      const res = await createOrder({
        address,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
      mallToast.clear()
      mallToast.success('订单创建成功，请完成支付')
      setPendingOrder(res.data)
      setPayPopupVisible(true)
    } catch (err) {
      mallToast.clear()
      if (err.message?.includes('登录') || err.code === 401) {
        mallToast.fail('登录已失效，请重新登录')
        setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 800)
      } else {
        mallToast.fail(err.message || '创建订单失败')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmPay = async () => {
    if (!pendingOrder) return
    if (payPassword && payPassword !== '123456') {
      mallToast.fail('支付密码错误')
      return
    }

    setPaying(true)
    mallToast.loading('支付处理中...')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const payRes = await payOrder(pendingOrder.id, { paymentMethod })
      const paidOrder = normalizeOrder(payRes.data)

      addOrder(paidOrder)
      removeSelected()
      mallToast.clear()
      setPayPopupVisible(false)
      mallToast.success('支付成功！')

      setTimeout(() => {
        navigate(`/pay/success/${pendingOrder.id}`, {
          replace: true,
          state: { paymentMethod, fromPayment: true },
        })
      }, 500)
    } catch (err) {
      mallToast.clear()
      if (err.message?.includes('登录') || err.code === 401) {
        mallToast.fail('登录已失效，请重新登录')
        setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 800)
      } else {
        mallToast.fail(err.message || '支付失败')
      }
    } finally {
      setPaying(false)
    }
  }

  if (selectedItems.length === 0 && !pendingOrder) return null

  const displayItems = pendingOrder?.items || selectedItems.map((i) => ({
    productId: i.productId,
    title: i.title,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
  }))
  const displayTotal = pendingOrder?.totalPrice ?? totalPrice

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <NavBar onBack={() => navigate(-1)} className="bg-white/90 backdrop-blur-md">
        确认下单
      </NavBar>

      <div className="max-w-lg mx-auto px-4 space-y-4 pt-3">
        {/* 地址条 */}
        <section className="rounded-2xl bg-white p-4 shadow-sm flex items-center gap-3">
          <EnvironmentOutline fontSize={22} className="text-olive-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-stone-800">{MOCK_ADDRESS.name}</span>
              <span className="text-xs text-stone-500">{MOCK_ADDRESS.phone}</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 truncate">{MOCK_ADDRESS.detail}</p>
          </div>
          <RightOutline className="text-stone-300" />
        </section>

        {/* 商品清单 */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-800 mb-3">商品清单</h3>
          <div className="space-y-3">
            {displayItems.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <Image src={item.image} width={72} height={72} fit="cover" className="rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-700 line-clamp-2">{item.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-olive-700 font-bold">¥{item.price}</span>
                    <span className="text-xs text-stone-400">×{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 支付方式 */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-800 mb-3">支付方式</h3>
          <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ value, label, icon: Icon, color }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                    paymentMethod === value ? 'bg-gray-50 border border-cream-300' : ''
                  }`}
                >
                  <Radio value={value} />
                  <Icon fontSize={22} style={{ color }} />
                  <span className="text-sm text-stone-700">{label}</span>
                </label>
              ))}
            </div>
          </Radio.Group>
        </section>
      </div>

      {/* 底部结算栏 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 px-4 py-3 safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="flex-1">
            <span className="text-xs text-stone-500">合计 </span>
            <span className="text-xl font-bold text-stone-900">
              <span className="text-sm">¥</span>
              {Number(displayTotal).toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            disabled={submitting || !!pendingOrder}
            onClick={handleSubmitOrder}
            className="px-8 py-3 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-500/30 disabled:opacity-60 transition-colors"
          >
            {submitting ? '提交中…' : pendingOrder ? '待支付' : '提交订单'}
          </button>
        </div>
      </footer>

      {/* 支付半屏弹窗 */}
      <Popup
        visible={payPopupVisible}
        onMaskClick={() => !paying && setPayPopupVisible(false)}
        bodyStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: '45vh',
          padding: '20px 20px 32px',
        }}
      >
        <h3 className="text-lg font-semibold text-center text-stone-800 mb-1">确认支付</h3>
        <p className="text-center text-2xl font-bold text-stone-900 mb-6">
          <span className="text-base">¥</span>
          {Number(displayTotal).toFixed(2)}
        </p>

        <div className="rounded-2xl bg-gray-50 p-4 mb-4">
          <p className="text-xs text-stone-500 mb-2">支付密码（演示可输入 123456，或直接点确认）</p>
          <Input
            type="password"
            placeholder="请输入支付密码"
            value={payPassword}
            onChange={setPayPassword}
            maxLength={6}
            className="bg-white rounded-xl"
          />
        </div>

        <Button
          block
          color="danger"
          shape="rounded"
          size="large"
          loading={paying}
          onClick={handleConfirmPay}
          className="!rounded-full"
        >
          确认支付
        </Button>
        <p className="text-center text-xs text-stone-400 mt-4">支付即表示同意《用户购买协议》</p>
      </Popup>

      {paying && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
          <SpinLoading color="white" style={{ '--size': '48px' }} />
        </div>
      )}
    </div>
  )
}
