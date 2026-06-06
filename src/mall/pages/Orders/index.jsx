import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, CapsuleTabs, Image, Button, DotLoading, Empty } from 'antd-mobile'
import useOrderStore from '@/mall/store/useOrderStore'
import { getOrders } from '@/utils/api'
import MallPageShell from '@/mall/components/MallPageShell'
import {
  ORDER_STATUS_TABS,
  ORDER_STATUS_MAP,
} from '@/mall/constants/order'
import mallToast from '@/mall/utils/toast'

export default function OrdersPage() {
  const navigate = useNavigate()
  const orders = useOrderStore((s) => s.orders)
  const syncOrders = useOrderStore((s) => s.syncOrders)
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

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

  return (
    <MallPageShell className="bg-gray-50">
      <NavBar className="bg-white/90 backdrop-blur-md">我的订单</NavBar>

      <div className="max-w-lg mx-auto">
        <CapsuleTabs activeKey={activeTab} onChange={setActiveTab} className="bg-white px-2">
          {ORDER_STATUS_TABS.map((tab) => (
            <CapsuleTabs.Tab title={tab.label} key={tab.key} />
          ))}
        </CapsuleTabs>

        {loading ? (
          <div className="flex justify-center py-20 text-olive-600">
            <DotLoading color="currentColor" />
          </div>
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
                  className="rounded-2xl bg-white border border-cream-200 shadow-sm overflow-hidden active:scale-[0.99] transition-transform"
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
                      {order.status === 0 && (
                        <Button
                          size="mini"
                          color="primary"
                          shape="rounded"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          去支付
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
    </MallPageShell>
  )
}
