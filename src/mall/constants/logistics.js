import { ORDER_STATUS } from '@/mall/constants/order'

/** 根据订单状态生成物流轨迹（与订单状态严格对应） */
export function buildLogisticsTimeline(order) {
  if (!order || order.status < ORDER_STATUS.PENDING_SHIP) return []

  const baseTime = order.payTime || order.createTime || '2026-06-08 10:00:00'

  // 待发货：仅提示备货，不展示快递轨迹
  if (order.status === ORDER_STATUS.PENDING_SHIP) {
    return [
      {
        time: baseTime,
        status: '待发货',
        detail: '商家已收到您的订单，正在备货打包，暂未交给快递公司',
      },
    ]
  }

  const carrier = order.id % 2 === 0 ? '顺丰速运' : '中通快递'
  const trackingNo = `SF${String(order.id).padStart(10, '0')}`

  const steps = [
    {
      time: baseTime,
      status: '已揽收',
      detail: `【${carrier}】快件已由揽收网点收取，运单号 ${trackingNo}`,
    },
    {
      time: addHours(baseTime, 2),
      status: '运输中',
      detail: '快件已到达【上海转运中心】，正发往目的地',
    },
    {
      time: addHours(baseTime, 8),
      status: '派送中',
      detail: '快件已到达【目的地城市】，快递员正在派送',
    },
  ]

  if (order.status >= ORDER_STATUS.PENDING_REVIEW) {
    steps.push({
      time: addHours(baseTime, 12),
      status: '已签收',
      detail: '本人签收，感谢使用 LUMIÈRE 商城',
    })
  }

  return steps.reverse()
}

function addHours(dateStr, hours) {
  const d = new Date(dateStr.replace(/-/g, '/'))
  if (Number.isNaN(d.getTime())) {
    return dateStr
  }
  d.setHours(d.getHours() + hours)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
