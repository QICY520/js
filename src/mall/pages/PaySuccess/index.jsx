import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { NavBar, Button, DotLoading, Result } from 'antd-mobile'
import { getOrderById } from '@/utils/api'
import useOrderStore from '@/mall/store/useOrderStore'
import { normalizeOrder, PAYMENT_LABELS } from '@/mall/constants/order'
import mallToast from '@/mall/utils/toast'

export default function PaySuccessPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const addOrder = useOrderStore((s) => s.addOrder)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const toastedRef = useRef(false)

  const paymentMethod = location.state?.paymentMethod || order?.paymentMethod

  useEffect(() => {
    getOrderById(orderId)
      .then((res) => {
        const normalized = normalizeOrder(res.data)
        setOrder(normalized)
        addOrder(normalized)
      })
      .catch(() => mallToast.fail('订单信息加载失败'))
      .finally(() => setLoading(false))
  }, [orderId, addOrder])

  useEffect(() => {
    if (!loading && order && !toastedRef.current && location.state?.fromPayment) {
      toastedRef.current = true
      mallToast.success(`支付成功！订单 ${order.orderNo} 已生成`, 3000)
    }
  }, [loading, order, location.state?.fromPayment])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-olive-600">
        <DotLoading color="currentColor" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar back={null} className="bg-white/90 backdrop-blur-md">
        支付结果
      </NavBar>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <Result
          status="success"
          title="支付成功"
          description="感谢您的购买，商品将尽快为您发货"
        />

        {order && (
          <div className="rounded-2xl bg-white border border-cream-200 p-5 shadow-md space-y-3 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">订单编号</span>
              <span className="text-stone-800 font-medium">{order.orderNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">支付金额</span>
              <span className="text-olive-700 font-bold">¥{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">支付方式</span>
              <span>{PAYMENT_LABELS[paymentMethod] || '微信支付'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">支付时间</span>
              <span>{order.payTime}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
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
            查看订单
          </Button>
        </div>
      </div>
    </div>
  )
}
