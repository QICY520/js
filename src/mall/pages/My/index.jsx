import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Image,
  Badge,
  Button,
  DotLoading,
} from 'antd-mobile'
import {
  PayCircleOutline,
  TruckOutline,
  CheckCircleOutline,
  RightOutline,
  UnorderedListOutline,
  EnvironmentOutline,
  SetOutline,
  UserOutline,
} from 'antd-mobile-icons'
import useMallUserStore from '@/mall/store/useMallUserStore'
import useOrderStore from '@/mall/store/useOrderStore'
import { getOrders } from '@/utils/api'
import { ORDER_STATUS } from '@/mall/constants/order'
import MallPageShell from '@/mall/components/MallPageShell'
import mallToast from '@/mall/utils/toast'

/**
 * 「我的」页面
 *
 * 仿京东个人中心布局：
 * - 顶部用户信息区：头像、昵称
 * - 订单状态入口：待付款 / 待发货 / 已完成，各带数量角标
 * - 功能菜单：我的订单、收货地址、设置
 */

const ORDER_ENTRIES = [
  {
    key: 'pendingPay',
    status: ORDER_STATUS.PENDING_PAY,
    label: '待付款',
    icon: PayCircleOutline,
    color: '#f59e0b',
  },
  {
    key: 'pendingShip',
    status: ORDER_STATUS.PENDING_SHIP,
    label: '待发货',
    icon: TruckOutline,
    color: '#2563eb',
  },
  {
    key: 'completed',
    status: ORDER_STATUS.COMPLETED,
    label: '已完成',
    icon: CheckCircleOutline,
    color: '#4a6340',
  },
]

const MENU_LIST = [
  {
    key: 'orders',
    label: '我的订单',
    icon: UnorderedListOutline,
    path: '/orders',
    badge: null,
  },
  {
    key: 'address',
    label: '收货地址',
    icon: EnvironmentOutline,
    path: '/addresses',
    badge: null,
  },
  {
    key: 'settings',
    label: '设置',
    icon: SetOutline,
    path: null,
    badge: null,
  },
]

export default function MyPage() {
  const navigate = useNavigate()
  const user = useMallUserStore((s) => s.user)
  const logout = useMallUserStore((s) => s.logout)
  const orders = useOrderStore((s) => s.orders)
  const syncOrders = useOrderStore((s) => s.syncOrders)
  const [loading, setLoading] = useState(true)

  /** 加载订单数据以统计各状态数量 */
  useEffect(() => {
    getOrders()
      .then((res) => syncOrders(res.data.list))
      .catch(() => {
        // 静默失败，使用 store 缓存
      })
      .finally(() => setLoading(false))
  }, [syncOrders])

  /** 按状态统计订单数 */
  const orderCountMap = useMemo(() => {
    const map = { [ORDER_STATUS.PENDING_PAY]: 0, [ORDER_STATUS.PENDING_SHIP]: 0, [ORDER_STATUS.COMPLETED]: 0 }
    orders.forEach((o) => {
      if (map[o.status] !== undefined) {
        map[o.status] += 1
      }
    })
    return map
  }, [orders])

  const handleLogout = () => {
    logout()
    mallToast.success('已退出登录')
    navigate('/login', { replace: true })
  }

  const handleMenuClick = (menu) => {
    if (menu.path) {
      navigate(menu.path)
    } else {
      mallToast.info(`${menu.label}功能开发中`)
    }
  }

  const handleOrderEntryClick = (entry) => {
    // 跳转到订单列表并预选对应状态 tab
    navigate(`/orders?status=${entry.status}`)
  }

  return (
    <MallPageShell className="bg-cream-50">
      {/* 用户信息头 */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-olive-700/90 via-olive-600/60 to-cream-50" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative px-5 pt-10 pb-8">
          <div className="flex items-center gap-4">
            {/* 头像 */}
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar ? (
                <Image src={user.avatar} width={64} height={64} fit="cover" className="rounded-full" />
              ) : (
                <UserOutline fontSize={28} className="text-white/80" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">
                {user?.nickname || user?.username || '商城用户'}
              </h2>
              <p className="text-xs text-white/70 mt-0.5">
                LUMIÈRE 极简生活美学
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleMenuClick({ path: null, label: '设置' })}
              className="text-white/80 hover:text-white transition-colors"
            >
              <SetOutline fontSize={22} />
            </button>
          </div>
        </div>
      </section>

      {/* 订单状态入口 */}
      <section className="mx-4 -mt-4 relative z-10">
        <div className="rounded-2xl bg-white shadow-lg shadow-stone-900/5 border border-cream-200 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-800">我的订单</h3>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-olive-600 transition-colors"
            >
              全部订单
              <RightOutline fontSize={12} />
            </button>
          </div>

          <div className="flex justify-around">
            {ORDER_ENTRIES.map((entry) => {
              const Icon = entry.icon
              const count = orderCountMap[entry.status] ?? 0
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => handleOrderEntryClick(entry)}
                  className="flex flex-col items-center gap-2 py-1 px-4 active:scale-95 transition-transform"
                >
                  <span className="relative inline-flex">
                    <Icon fontSize={26} style={{ color: entry.color }} />
                    {count > 0 && (
                      <Badge
                        content={count > 99 ? '99+' : count}
                        style={{
                          '--color': '#ef4444',
                          position: 'absolute',
                          top: -6,
                          right: -12,
                        }}
                      />
                    )}
                  </span>
                  <span className="text-xs text-stone-600">{entry.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 功能菜单 */}
      <section className="mx-4 mt-4">
        <div className="rounded-2xl bg-white border border-cream-200 shadow-sm overflow-hidden">
          {MENU_LIST.map((menu, idx) => {
            const Icon = menu.icon
            return (
              <button
                key={menu.key}
                type="button"
                onClick={() => handleMenuClick(menu)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-cream-50 transition-colors ${
                  idx < MENU_LIST.length - 1 ? 'border-b border-cream-100' : ''
                }`}
              >
                <Icon fontSize={20} className="text-olive-600 shrink-0" />
                <span className="flex-1 text-sm text-stone-700">{menu.label}</span>
                <RightOutline fontSize={14} className="text-stone-300" />
              </button>
            )
          })}
        </div>
      </section>

      {/* 退出登录 */}
      <section className="mx-4 mt-6 pb-4">
        <Button
          block
          fill="outline"
          shape="rounded"
          onClick={handleLogout}
          style={{ '--border-color': '#d6d3d1', '--text-color': '#78716c' }}
        >
          退出登录
        </Button>
      </section>
    </MallPageShell>
  )
}
