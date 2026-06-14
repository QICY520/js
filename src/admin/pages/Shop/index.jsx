import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Image,
  message,
  Typography,
  Rate,
} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { getShops, updateShop } from '@/utils/api'
import { IMAGE_URL_RULES, TEXT_REQUIRED_RULES } from '@/mall/constants/validation'

const { Title } = Typography

export default function ShopManagement() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingShop, setEditingShop] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const fetchShops = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getShops()
      setShops(res.data)
    } catch {
      message.error('加载店铺失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchShops()
  }, [fetchShops])

  const openEdit = (record) => {
    setEditingShop(record)
    form.setFieldsValue({
      shopLogo: record.shopLogo,
      promoNotice: record.promoNotice,
      shopDescription: record.shopDescription,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      await updateShop(editingShop.shopId, values)
      message.success('店铺更新成功')
      setModalOpen(false)
      fetchShops()
    } catch (err) {
      if (err?.message) message.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'shopId', width: 60 },
    {
      title: 'Logo',
      dataIndex: 'shopLogo',
      width: 80,
      render: (src) => (
        <Image src={src} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} />
      ),
    },
    { title: '店铺名称', dataIndex: 'shopName', width: 140 },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 140,
      render: (rating) => <Rate disabled allowHalf defaultValue={rating} className="text-sm" />,
    },
    {
      title: '粉丝数',
      dataIndex: 'fansCount',
      width: 100,
      render: (n) => n?.toLocaleString(),
    },
    {
      title: '在售商品',
      dataIndex: 'productCount',
      width: 90,
    },
    {
      title: '营销公告',
      dataIndex: 'promoNotice',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
          编辑
        </Button>
      ),
    },
  ]

  return (
    <>
      <Card bordered={false} className="shadow-sm">
        <Title level={4} className="!mb-6">
          店铺管理
        </Title>
        <Table
          rowKey="shopId"
          columns={columns}
          dataSource={shops}
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 家店铺` }}
        />
      </Card>

      <Modal
        title={`编辑店铺 · ${editingShop?.shopName}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText="保存"
        cancelText="取消"
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="shopLogo"
            label="店铺 Logo URL"
            rules={IMAGE_URL_RULES}
          >
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item
            name="promoNotice"
            label="营销公告"
            rules={TEXT_REQUIRED_RULES('营销公告', 2, 40)}
          >
            <Input placeholder="如：官方立减 · 丝纺节狂欢" maxLength={40} showCount />
          </Form.Item>
          <Form.Item
            name="shopDescription"
            label="店铺简介"
            rules={TEXT_REQUIRED_RULES('店铺简介', 5, 120)}
          >
            <Input.TextArea rows={3} placeholder="店铺介绍" maxLength={120} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
