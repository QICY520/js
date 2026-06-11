import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  Image,
  Tag,
  message,
  Popconfirm,
  Typography,
} from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  getProducts,
  getCategories,
  getShops,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/utils/api'

const { Title } = Typography

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [shopFilter, setShopFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const flatCategories = categories.flatMap((parent) =>
    (parent.children || []).map((child) => ({
      value: child.id,
      label: `${parent.name} / ${child.name}`,
    })),
  )

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProducts({
        keyword,
        shopId: shopFilter || undefined,
        pageSize: 100,
      })
      setProducts(res.data.list)
    } catch {
      message.error('加载商品失败')
    } finally {
      setLoading(false)
    }
  }, [keyword, shopFilter])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories()
      setCategories(res.data)
    } catch {
      message.error('加载分类失败')
    }
  }, [])

  const fetchShops = useCallback(async () => {
    try {
      const res = await getShops()
      setShops(res.data)
    } catch {
      message.error('加载店铺失败')
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchShops()
  }, [fetchProducts, fetchCategories, fetchShops])

  const openCreate = () => {
    setEditingProduct(null)
    form.resetFields()
    form.setFieldsValue({ status: 1, stock: 0, shopId: shops[0]?.shopId })
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditingProduct(record)
    form.setFieldsValue({
      title: record.title,
      price: record.price,
      stock: record.stock,
      categoryId: record.categoryId,
      shopId: record.shopId,
      image: record.image,
      desc: record.desc,
      status: record.status,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      if (editingProduct) {
        await updateProduct(editingProduct.id, values)
        message.success('商品更新成功')
      } else {
        await createProduct(values)
        message.success('商品创建成功')
      }
      setModalOpen(false)
      fetchProducts()
    } catch (err) {
      if (err?.message) message.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      message.success('删除成功')
      fetchProducts()
    } catch {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '主图',
      dataIndex: 'image',
      width: 80,
      render: (src) => <Image src={src} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} />,
    },
    {
      title: '商品名称',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      render: (price) => <span className="text-olive-700 font-semibold">¥{price}</span>,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 80,
    },
    {
      title: '所属店铺',
      dataIndex: 'shopId',
      width: 120,
      render: (shopId) => shops.find((s) => s.shopId === shopId)?.shopName || shopId,
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      width: 120,
      render: (categoryId) => {
        const cat = flatCategories.find((c) => c.value === categoryId)
        return cat?.label || categoryId
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status) =>
        status === 1 ? (
          <Tag color="success">上架</Tag>
        ) : (
          <Tag color="default">下架</Tag>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该商品？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card bordered={false} className="shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Title level={4} className="!mb-0">
            商品管理
          </Title>
          <Space wrap>
            <Select
              allowClear
              placeholder="按店铺筛选"
              value={shopFilter || undefined}
              onChange={(val) => setShopFilter(val || '')}
              options={shops.map((s) => ({ value: s.shopId, label: s.shopName }))}
              style={{ width: 160 }}
            />
            <Input.Search
              placeholder="搜索商品名称"
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={(val) => setKeyword(val.trim())}
              style={{ width: 240 }}
              enterButton={<SearchOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              新增商品
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>

      <Modal
        title={editingProduct ? '编辑商品' : '新增商品'}
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
            name="title"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" maxLength={50} showCount />
          </Form.Item>

          <Space size={16} className="w-full">
            <Form.Item
              name="price"
              label="价格"
              rules={[{ required: true, message: '请输入价格' }]}
              className="flex-1"
            >
              <InputNumber min={0} precision={2} prefix="¥" className="w-full" placeholder="0.00" />
            </Form.Item>
            <Form.Item
              name="stock"
              label="库存"
              rules={[{ required: true, message: '请输入库存' }]}
              className="flex-1"
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>
          </Space>

          <Form.Item
            name="shopId"
            label="所属店铺"
            rules={[{ required: true, message: '请选择店铺' }]}
          >
            <Select
              placeholder="请选择店铺"
              options={shops.map((s) => ({ value: s.shopId, label: s.shopName }))}
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类" options={flatCategories} />
          </Form.Item>

          <Form.Item
            name="image"
            label="主图 URL"
            rules={[{ required: true, message: '请输入主图地址' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="desc" label="商品描述">
            <Input.TextArea rows={3} placeholder="商品描述" maxLength={200} showCount />
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 1, label: '上架' },
                { value: 0, label: '下架' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
