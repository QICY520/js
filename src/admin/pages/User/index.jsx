import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Image,
  Tag,
  message,
  Popconfirm,
  Typography,
  Checkbox,
  Alert,
} from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CrownOutlined } from '@ant-design/icons'
import { getUsers, createUser, updateUser, deleteUser } from '@/utils/api'
import useAdminStore from '@/admin/store/useAdminStore'
import {
  ROLES,
  PERMISSIONS,
  getRoleLabel,
  getRoleColor,
} from '@/admin/constants/user'
import { PASSWORD_RULE, USERNAME_RULES } from '@/mall/constants/validation'

const { Title, Text } = Typography

const ROLE_FILTER_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'user', label: '普通用户' },
  { value: 'admin', label: '管理员' },
]

const DEFAULT_ADMIN_PERMISSIONS = ['product', 'shop', 'order', 'user']

export default function UserManagement() {
  const currentAdmin = useAdminStore((s) => s.user)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()
  const watchedRole = Form.useWatch('role', form)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUsers({ keyword, role: roleFilter || undefined, pageSize: 100 })
      setUsers(res.data.list)
    } catch {
      message.error('加载用户失败')
    } finally {
      setLoading(false)
    }
  }, [keyword, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const syncSelfIfNeeded = (updated) => {
    if (currentAdmin?.id === updated.id) {
      useAdminStore.setState({
        user: { ...currentAdmin, ...updated, role: updated.role, permissions: updated.permissions },
      })
    }
  }

  const openCreate = () => {
    setEditingUser(null)
    form.resetFields()
    form.setFieldsValue({ role: 'user', permissions: [] })
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditingUser(record)
    form.setFieldsValue({
      username: record.username,
      nickname: record.nickname,
      role: record.role,
      permissions: record.permissions || [],
      password: '',
    })
    setModalOpen(true)
  }

  const openPromote = (record) => {
    setEditingUser(record)
    form.setFieldsValue({
      username: record.username,
      nickname: record.nickname,
      role: 'admin',
      permissions: DEFAULT_ADMIN_PERMISSIONS,
      password: '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      const payload = {
        nickname: values.nickname,
        role: values.role,
        permissions: values.role === 'admin' ? values.permissions || [] : [],
      }
      if (values.password?.trim()) {
        payload.password = values.password.trim()
      }

      if (editingUser) {
        const res = await updateUser(editingUser.id, payload)
        message.success('用户更新成功')
        syncSelfIfNeeded(res.data)
      } else {
        await createUser({
          username: values.username,
          password: values.password,
          ...payload,
        })
        message.success('用户创建成功')
      }

      setModalOpen(false)
      fetchUsers()
    } catch (err) {
      if (err?.message) message.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteUser(id)
      message.success('删除成功')
      fetchUsers()
    } catch (err) {
      message.error(err?.message || '删除失败')
    }
  }

  const renderPermissions = (record) => {
    if (record.role !== 'admin' || !record.permissions?.length) {
      return <Text type="secondary">—</Text>
    }
    return (
      <Space size={[4, 4]} wrap>
        {record.permissions.map((p) => {
          const label = PERMISSIONS.find((item) => item.value === p)?.label || p
          return (
            <Tag key={p} color="olive">
              {label}
            </Tag>
          )
        })}
      </Space>
    )
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 72,
      render: (src) => (
        <Image src={src} width={40} height={40} style={{ objectFit: 'cover', borderRadius: '50%' }} />
      ),
    },
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '昵称', dataIndex: 'nickname', width: 120, ellipsis: true },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      render: (role) => <Tag color={getRoleColor(role)}>{getRoleLabel(role)}</Tag>,
    },
    {
      title: '权限',
      key: 'permissions',
      width: 220,
      render: (_, record) => renderPermissions(record),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (val) => val || '—',
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap>
          {record.role === 'user' && (
            <Button
              type="link"
              size="small"
              icon={<CrownOutlined />}
              onClick={() => openPromote(record)}
            >
              设为管理员
            </Button>
          )}
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该用户？"
            description="删除后不可恢复"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            disabled={record.id === currentAdmin?.id}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.id === currentAdmin?.id}
            >
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
            用户管理
          </Title>
          <Space wrap>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              options={ROLE_FILTER_OPTIONS}
              style={{ width: 120 }}
            />
            <Input.Search
              placeholder="搜索用户名 / 昵称"
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={(val) => setKeyword(val.trim())}
              style={{ width: 220 }}
              enterButton={<SearchOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              新增用户
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          scroll={{ x: 1100 }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
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
          {!editingUser && (
            <>
              <Form.Item name="username" label="用户名" rules={USERNAME_RULES}>
                <Input placeholder="3-20 位字母、数字、下划线" maxLength={20} />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }, PASSWORD_RULE]}
              >
                <Input.Password placeholder="至少 6 位，含字母和数字" autoComplete="new-password" />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="显示名称" maxLength={20} />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
            extra={
              watchedRole === 'user'
                ? '普通用户仅可登录商城前台'
                : '管理员可勾选可访问的后台模块'
            }
          >
            <Select options={ROLES} />
          </Form.Item>

          {watchedRole === 'admin' && (
            <Form.Item
              name="permissions"
              label="后台权限"
              rules={[
                {
                  validator: (_, value) =>
                    value?.length ? Promise.resolve() : Promise.reject(new Error('请至少选择一项权限')),
                },
              ]}
            >
              <Checkbox.Group className="flex flex-col gap-2">
                {PERMISSIONS.map((p) => (
                  <Checkbox key={p.value} value={p.value}>
                    {p.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          )}

          {watchedRole === 'admin' && (
            <Alert
              type="info"
              showIcon
              message="管理员按勾选的权限访问对应后台功能"
              className="mb-4"
            />
          )}

          {editingUser && (
            <Form.Item name="password" label="重置密码" extra="留空则不修改密码">
              <Input.Password placeholder="新密码（可选）" autoComplete="new-password" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  )
}
