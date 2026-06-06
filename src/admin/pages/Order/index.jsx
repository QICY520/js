import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Select,
  Typography,
  message,
  Popconfirm,
  Image,
} from 'antd'
import { getOrders, updateOrderStatus } from '@/utils/api'
import useOrderStore from '@/mall/store/useOrderStore'
import { ORDER_STATUS_MAP } from '@/mall/constants/order'

const { Title } = Typography

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 0, label: '待支付' },
  { value: 1, label: '待发货' },
  { value: 2, label: '已完成' },
]

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const updateOrderStatusStore = useOrderStore((s) => s.updateOrderStatus)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = statusFilter !== '' ? { status: statusFilter } : {}
      const res = await getOrders(params)
      setOrders(res.data.list)
    } catch {
      message.error('加载订单失败')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleShip = async (id) => {
    try {
      await updateOrderStatus(id, 2)
      updateOrderStatusStore(id, 2)
      message.success('发货成功，订单已完成')
      fetchOrders()
    } catch {
      message.error('操作失败')
    }
  }

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 140 },
    {
      title: '商品',
      dataIndex: 'items',
      render: (items) => (
        <Space>
          {items?.slice(0, 3).map((item) => (
            <Image key={item.productId} src={item.image} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 6 }} />
          ))}
          {items?.length > 3 && <span className="text-stone-400">+{items.length - 3}</span>}
        </Space>
      ),
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      width: 100,
      render: (p) => <span className="text-olive-700 font-semibold">¥{p}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        const info = ORDER_STATUS_MAP[status]
        const color = status === 0 ? 'warning' : status === 1 ? 'processing' : 'success'
        return <Tag color={color}>{info?.label || status}</Tag>
      },
    },
    { title: '下单时间', dataIndex: 'createTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) =>
        record.status === 1 ? (
          <Popconfirm title="确认发货？" onConfirm={() => handleShip(record.id)}>
            <Button type="link" size="small">
              发货
            </Button>
          </Popconfirm>
        ) : (
          <span className="text-stone-400 text-xs">—</span>
        ),
    },
  ]

  return (
    <Card bordered={false} className="shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Title level={4} className="!mb-0">订单管理</Title>
        <Space>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            style={{ width: 140 }}
          />
          <Button onClick={fetchOrders}>刷新</Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
      />
    </Card>
  )
}
