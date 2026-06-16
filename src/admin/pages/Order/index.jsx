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
  Modal,
  Form,
} from 'antd'
import { getOrders, updateOrderStatus } from '@/utils/api'
import useOrderStore from '@/mall/store/useOrderStore'
import { ORDER_STATUS, ORDER_STATUS_MAP } from '@/mall/constants/order'

const { Title } = Typography

const STATUS_FILTER_OPTIONS = [
  { value: '', label: '全部状态' },
  ...Object.entries(ORDER_STATUS_MAP).map(([value, info]) => ({
    value: Number(value),
    label: info.label,
  })),
]

const ADMIN_STATUS_OPTIONS = Object.entries(ORDER_STATUS_MAP).map(([value, info]) => ({
  value: Number(value),
  label: info.label,
}))

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [statusModal, setStatusModal] = useState({ open: false, order: null })
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()
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

  const applyStatus = async (id, status) => {
    await updateOrderStatus(id, status)
    updateOrderStatusStore(id, status)
    message.success('订单状态已更新')
    fetchOrders()
  }

  const handleShip = async (id) => {
    try {
      await applyStatus(id, ORDER_STATUS.PENDING_RECEIVE)
      message.success('发货成功，等待买家收货')
    } catch {
      message.error('发货失败')
    }
  }

  const openStatusModal = (order) => {
    setStatusModal({ open: true, order })
    form.setFieldsValue({ status: order.status })
  }

  const handleStatusSubmit = async () => {
    try {
      const { status } = await form.validateFields()
      setSubmitting(true)
      await applyStatus(statusModal.order.id, status)
      setStatusModal({ open: false, order: null })
    } catch (err) {
      if (err?.message) message.error(err.message)
    } finally {
      setSubmitting(false)
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
            <Image
              key={item.productId}
              src={item.image}
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: 6 }}
            />
          ))}
          {items?.length > 3 && <span className="text-stone-400">+{items.length - 3}</span>}
        </Space>
      ),
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      width: 100,
      render: (p, record) => (
        <span className="text-olive-700 font-semibold">
          ¥{record.totalAmount ?? p}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (status) => {
        const info = ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP[0]
        const colorMap = {
          0: 'warning',
          1: 'processing',
          2: 'blue',
          3: 'orange',
          4: 'default',
          5: 'success',
        }
        return <Tag color={colorMap[status] || 'default'}>{info.label}</Tag>
      },
    },
    { title: '下单时间', dataIndex: 'createTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.status === ORDER_STATUS.PENDING_SHIP && (
            <Popconfirm title="确认发货？" onConfirm={() => handleShip(record.id)}>
              <Button type="link" size="small">
                发货
              </Button>
            </Popconfirm>
          )}
          <Button type="link" size="small" onClick={() => openStatusModal(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card bordered={false} className="shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Title level={4} className="!mb-0">订单管理</Title>
          <Space wrap>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
              className="w-full sm:!w-40"
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

      <Modal
        title={`编辑订单 · ${statusModal.order?.orderNo || ''}`}
        open={statusModal.open}
        onCancel={() => setStatusModal({ open: false, order: null })}
        onOk={handleStatusSubmit}
        confirmLoading={submitting}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="status"
            label="订单状态"
            rules={[{ required: true, message: '请选择订单状态' }]}
          >
            <Select options={ADMIN_STATUS_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
