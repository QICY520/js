/** 订单状态：0 待支付 | 1 待发货 | 2 待收货 | 3 待评价 | 4 退款/售后 | 5 已完成 */
export const ORDER_STATUS = {
  PENDING_PAY: 0,
  PENDING_SHIP: 1,
  PENDING_RECEIVE: 2,
  PENDING_REVIEW: 3,
  REFUND: 4,
  COMPLETED: 5,
}

export const ORDER_STATUS_TABS = [
  { key: 'all', label: '全部', status: null },
  { key: '0', label: '待支付', status: 0 },
  { key: '1', label: '待发货', status: 1 },
  { key: '2', label: '待收货', status: 2 },
  { key: '3', label: '待评价', status: 3 },
  { key: '4', label: '退款/售后', status: 4 },
]

export const ORDER_STATUS_MAP = {
  0: { label: '待支付', color: 'text-amber-600', bg: 'bg-amber-50' },
  1: { label: '待发货', color: 'text-sea-600', bg: 'bg-sea-50' },
  2: { label: '待收货', color: 'text-blue-600', bg: 'bg-blue-50' },
  3: { label: '待评价', color: 'text-orange-600', bg: 'bg-orange-50' },
  4: { label: '退款/售后', color: 'text-stone-600', bg: 'bg-stone-100' },
  5: { label: '已完成', color: 'text-olive-600', bg: 'bg-olive-50' },
}

export const PAYMENT_LABELS = {
  wechat: '微信支付',
  alipay: '支付宝',
  balance: '余额支付',
}

export function normalizeOrder(raw) {
  if (!raw) return null
  return {
    id: raw.id,
    orderNo: raw.orderNo,
    items: raw.items || [],
    totalAmount: raw.totalAmount ?? raw.totalPrice ?? 0,
    status: raw.status,
    createTime: raw.createTime,
    payTime: raw.payTime || null,
    address: raw.address || '',
    paymentMethod: raw.paymentMethod || 'wechat',
    reviewed: raw.reviewed ?? false,
    review: raw.review || null,
  }
}
