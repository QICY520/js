import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NavBar, Image, Button, DotLoading, Steps } from 'antd-mobile'
import useOrderStore from '@/mall/store/useOrderStore'
import { getOrderById } from '@/utils/api'
import {
  ORDER_STATUS_MAP,
  PAYMENT_LABELS,
  normalizeOrder,
} from '@/mall/constants/order'
import mallToast from '@/mall/utils/toast'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addOrder = useOrderStore((s) => s.addOrder)
  const storeOrder = useOrderStore((s) => s.getOrderById(id))
  const [order, setOrder] = useState(storeOrder || null)
  const [loading, setLoading] = useState(!storeOrder)

  useEffect(() => {
    getOrderById(id)
      .then((res) => {
        const normalized = normalizeOrder(res.data)
        setOrder(normalized)
        addOrder(normalized)
      })
      .catch(() => mallToast.fail('订单不存在'))
      .finally(() => setLoading(false))
  }, [id, addOrder])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-olive-600">
        <DotLoading color="currentColor" />
      </div>
    )
  }

  if (!order) return null

  const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP[0]
  const stepCurrent = order.status === 0 ? 0 : order.status === 1 ? 1 : 2

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <NavBar onBack={() => navigate(-1)} className="bg-white/90 backdrop-blur-md">
        订单详情
      </NavBar>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className="text-xs text-stone-400">{order.orderNo}</span>
          </div>
          <Steps current={stepCurrent} direction="horizontal">
            <Steps.Step title="下单" />
            <Steps.Step title="付款" />
            <Steps.Step title="完成" />
          </Steps>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-stone-800">商品清单</h3>
          {order.items?.map((item) => (
            <div key={item.productId} className="flex gap-3">
              <Image src={item.image} width={72} height={72} fit="cover" className="rounded-xl" />
              <div className="flex-1">
                <p className="text-sm text-stone-800 line-clamp-2">{item.title}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-olive-700 font-semibold">¥{item.price}</span>
                  <span className="text-xs text-stone-400">×{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">下单时间</span>
            <span>{order.createTime}</span>
          </div>
          {order.payTime && (
            <div className="flex justify-between">
              <span className="text-stone-500">支付时间</span>
              <span>{order.payTime}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-stone-500">支付方式</span>
            <span>{PAYMENT_LABELS[order.paymentMethod] || '微信支付'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">实付金额</span>
            <span className="text-olive-700 font-bold text-base">¥{order.totalAmount}</span>
          </div>
          <div className="pt-2 border-t border-cream-200">
            <p className="text-stone-500 mb-1">收货地址</p>
            <p className="text-stone-700 leading-relaxed">{order.address}</p>
          </div>
        </section>

        <div className="flex gap-3">
          <Button block shape="rounded" onClick={() => navigate('/')}>
            返回首页
          </Button>
          <Button
            block
            color="primary"
            shape="rounded"
            onClick={() => navigate('/orders')}
            style={{ '--background': '#4a6340' }}
          >
            我的订单
          </Button>
        </div>
      </div>
    </div>
  )
}
