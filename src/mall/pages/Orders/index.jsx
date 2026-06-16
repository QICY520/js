import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { NavBar, CapsuleTabs, Image, Button, Empty, Dialog } from 'antd-mobile'
import useOrderStore from '@/mall/store/useOrderStore'
import useCartStore from '@/mall/store/useCartStore'
import { getOrders, confirmOrderReceive, cancelOrder } from '@/utils/api'
import MallPageShell from '@/mall/components/MallPageShell'
import OrderReviewPopup from '@/mall/components/order/OrderReviewPopup'
import {
  ORDER_STATUS,
  ORDER_STATUS_TABS,
  ORDER_STATUS_MAP,
  normalizeOrder,
} from '@/mall/constants/order'
import { ListPageSkeleton } from '@/mall/components/PageSkeleton'
import mallToast from '@/mall/utils/toast'

export default function OrdersPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orders = useOrderStore((s) => s.orders)
  const syncOrders = useOrderStore((s) => s.syncOrders)
  const updateOrder = useOrderStore((s) => s.updateOrder)
  const removeOrder = useOrderStore((s) => s.removeOrder)
  const restoreFromOrderItems = useCartStore((s) => s.restoreFromOrderItems)

  const initialTab = searchParams.get('status')
  const isValidTab = ORDER_STATUS_TABS.some((t) => t.key === initialTab)
  const [activeTab, setActiveTab] = useState(isValidTab ? initialTab : 'all')
  const [loading, setLoading] = useState(true)
  const [reviewOrder, setReviewOrder] = useState(null)
  const [receivingId, setReceivingId] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    getOrders()
      .then((res) => syncOrders(res.data.list))
      .catch(() => mallToast.fail('加载订单失败'))
      .finally(() => setLoading(false))
  }, [syncOrders])

  const filteredOrders = useMemo(() => {
    const tab = ORDER_STATUS_TABS.find((t) => t.key === activeTab)
    if (!tab || tab.status === null) return orders
    return orders.filter((o) => o.status === tab.status)
  }, [orders, activeTab])

  const handleConfirmReceive = async (order, e) => {
    e?.stopPropagation()
    setReceivingId(order.id)
    try {
      const res = await confirmOrderReceive(order.id)
      updateOrder(normalizeOrder(res.data))
      mallToast.success('已确认收货，快来评价吧')
    } catch (err) {
      mallToast.fail(err.message || '操作失败')
    } finally {
      setReceivingId(null)
    }
  }

  const openReview = (order, e) => {
    e?.stopPropagation()
    setReviewOrder(order)
  }

  const handleCancelPay = async (order, e) => {
    e?.stopPropagation()
    const confirmed = await Dialog.confirm({
      content: '确定取消支付吗？未支付订单将被关闭',
      confirmText: '取消支付',
      cancelText: '继续支付',
    })
    if (!confirmed) return

    setCancellingId(order.id)
    try {
      await cancelOrder(order.id)
      removeOrder(order.id)
      restoreFromOrderItems(order.items)
      mallToast.success('已取消支付，商品已退回购物车')
    } catch (err) {
      mallToast.fail(err.message || '取消失败')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <MallPageShell>
      <NavBar className="bg-white/90 backdrop-blur-md">我的订单</NavBar>

      <div className="mall-main">
        <CapsuleTabs activeKey={activeTab} onChange={setActiveTab} className="bg-white px-2">
          {ORDER_STATUS_TABS.map((tab) => (
            <CapsuleTabs.Tab title={tab.label} key={tab.key} />
          ))}
        </CapsuleTabs>

        {loading ? (
          <ListPageSkeleton rows={4} />
        ) : filteredOrders.length === 0 ? (
          <Empty description="暂无订单" className="py-16">
            <Button color="primary" shape="rounded" onClick={() => navigate('/')}>
              去逛逛
            </Button>
          </Empty>
        ) : (
          <div className="p-4 space-y-3">
            {filteredOrders.map((order) => {
              const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP[0]
              return (
                <article
                  key={order.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/orders/${order.id}`)}
                  className="rounded-2xl bg-white border border-cream-200 shadow-md overflow-hidden active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-cream-100">
                    <span className="text-xs text-stone-500">订单号 {order.orderNo}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex gap-2 overflow-x-auto">
                    {order.items?.map((item) => (
                      <Image
                        key={item.productId}
                        src={item.image}
                        width={64}
                        height={64}
                        fit="cover"
                        className="rounded-lg shrink-0"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 bg-cream-50/50">
                    <span className="text-sm text-stone-600">
                      共 {order.items?.reduce((s, i) => s + i.quantity, 0)} 件 · 合计
                      <span className="text-olive-700 font-bold ml-1">¥{order.totalAmount}</span>
                    </span>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {order.status === ORDER_STATUS.PENDING_PAY && (
                        <>
                          <Button
                            size="mini"
                            color="primary"
                            shape="rounded"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            去支付
                          </Button>
                          <Button
                            size="mini"
                            fill="outline"
                            shape="rounded"
                            loading={cancellingId === order.id}
                            onClick={(e) => handleCancelPay(order, e)}
                          >
                            取消支付
                          </Button>
                        </>
                      )}
                      {order.status === ORDER_STATUS.PENDING_RECEIVE && (
                        <Button
                          size="mini"
                          color="primary"
                          shape="rounded"
                          loading={receivingId === order.id}
                          onClick={(e) => handleConfirmReceive(order, e)}
                        >
                          确认收货
                        </Button>
                      )}
                      {order.status === ORDER_STATUS.PENDING_REVIEW && (
                        <Button
                          size="mini"
                          color="primary"
                          shape="rounded"
                          onClick={(e) => openReview(order, e)}
                          style={{ '--background': '#ea580c' }}
                        >
                          去评价
                        </Button>
                      )}
                      <Button
                        size="mini"
                        fill="outline"
                        shape="rounded"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <OrderReviewPopup
        order={reviewOrder}
        visible={!!reviewOrder}
        onClose={() => setReviewOrder(null)}
      />
    </MallPageShell>
  )
}
