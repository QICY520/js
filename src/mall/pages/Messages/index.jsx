import { NavBar, List } from 'antd-mobile'
import MallPageShell from '@/mall/components/MallPageShell'
import useUserStore from '@/mall/store/useUserStore'
import { useEffect } from 'react'

const MOCK_MESSAGES = [
  { id: 1, title: '订单发货通知', content: '您的订单已发货，请注意查收。', time: '今天 10:30' },
  { id: 2, title: '优惠券到账', content: '满299减50优惠券已放入账户。', time: '昨天 18:20' },
  { id: 3, title: '店铺上新', content: '云间丝语发布了 12 件新品。', time: '06-08' },
  { id: 4, title: '活动提醒', content: '618 狂欢即将开始，提前加购享优惠。', time: '06-07' },
  { id: 5, title: '系统通知', content: '欢迎加入 LUMIÈRE 极简生活美学。', time: '06-01' },
]

export default function MessagesPage() {
  const clearUnread = useUserStore((s) => s.clearUnreadMessages)

  useEffect(() => {
    clearUnread()
  }, [clearUnread])

  return (
    <MallPageShell className="bg-gray-100">
      <NavBar className="bg-white">消息</NavBar>
      <div className="max-w-lg mx-auto mt-2">
        <List className="rounded-2xl overflow-hidden mx-3">
          {MOCK_MESSAGES.map((msg) => (
            <List.Item
              key={msg.id}
              description={msg.content}
              extra={<span className="text-[10px] text-stone-400">{msg.time}</span>}
            >
              {msg.title}
            </List.Item>
          ))}
        </List>
      </div>
    </MallPageShell>
  )
}
