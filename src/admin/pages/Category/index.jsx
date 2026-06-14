import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Typography,
  Tag,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/utils/api'
import { TEXT_REQUIRED_RULES } from '@/mall/constants/validation'

const { Title } = Typography

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getCategories()
      setCategories(res.data || [])
    } catch {
      message.error('加载分类失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const parentOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories],
  )

  const tableData = useMemo(() => {
    const rows = []
    categories.forEach((parent) => {
      rows.push({
        key: `p-${parent.id}`,
        id: parent.id,
        name: parent.name,
        level: '一级分类',
        parentName: '—',
        isParent: true,
      })
      ;(parent.children || []).forEach((child) => {
        rows.push({
          key: `c-${child.id}`,
          id: child.id,
          name: child.name,
          level: '二级分类',
          parentName: parent.name,
          parentId: parent.id,
          isParent: false,
        })
      })
    })
    return rows
  }, [categories])

  const openCreate = (parentId = 0) => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ parentId: parentId || undefined })
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditing(record)
    form.setFieldsValue({
      name: record.name,
      parentId: record.isParent ? undefined : record.parentId,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      const payload = {
        name: values.name.trim(),
        parentId: values.parentId || 0,
      }
      if (editing) {
        await updateCategory(editing.id, payload)
        message.success('分类已更新')
      } else {
        await createCategory(payload)
        message.success('分类已创建')
      }
      setModalOpen(false)
      fetchCategories()
    } catch (err) {
      if (err?.message) message.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (record) => {
    try {
      await deleteCategory(record.id)
      message.success('分类已删除')
      fetchCategories()
    } catch (err) {
      message.error(err?.message || '删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 72 },
    { title: '分类名称', dataIndex: 'name' },
    {
      title: '层级',
      dataIndex: 'level',
      width: 100,
      render: (level) => (
        <Tag color={level === '一级分类' ? 'green' : 'blue'}>{level}</Tag>
      ),
    },
    { title: '所属一级', dataIndex: 'parentName', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          {record.isParent && (
            <Button type="link" size="small" onClick={() => openCreate(record.id)}>
              添加子类
            </Button>
          )}
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该分类？" onConfirm={() => handleDelete(record)}>
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
            分类管理
          </Title>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate(0)}>
              新增一级分类
            </Button>
            <Button onClick={fetchCategories}>刷新</Button>
          </Space>
        </div>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>

      <Modal
        title={editing ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          {!editing?.isParent && (
            <Form.Item name="parentId" label="所属一级分类" extra="不选则为一级分类">
              <Select
                allowClear
                placeholder="选择一级分类（可选）"
                options={parentOptions}
                disabled={!!editing && !editing.isParent}
              />
            </Form.Item>
          )}
          <Form.Item name="name" label="分类名称" rules={TEXT_REQUIRED_RULES('分类名称', 2, 20)}>
            <Input placeholder="请输入分类名称" maxLength={20} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
