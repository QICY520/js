import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NavBar,
  Button,
  Popup,
  Form,
  Input,
  Radio,
  SwipeAction,
  Dialog,
} from 'antd-mobile'
import { AddOutline, EnvironmentOutline } from 'antd-mobile-icons'
import useAddressStore from '@/mall/store/useAddressStore'
import { ADDRESS_TAGS, ADDRESS_TAG_COLORS } from '@/mall/constants/address'
import {
  ADDRESS_NAME_RULES,
  ADDRESS_PHONE_RULES,
  ADDRESS_REGION_RULES,
  ADDRESS_DETAIL_RULES,
} from '@/mall/constants/validation'
import mallToast from '@/mall/utils/toast'

const EMPTY_FORM = { name: '', phone: '', region: '', detail: '', tag: '家', isDefault: false }

/**
 * 收货地址管理页面
 *
 * - 列表展示所有地址，默认地址带标签
 * - 侧滑删除 + 确认弹窗
 * - 点击设为默认
 * - 底部新增按钮 → Popup 表单
 * - 编辑：点击地址卡片 → Popup 表单预填
 */
export default function AddressesPage() {
  const navigate = useNavigate()
  const addresses = useAddressStore((s) => s.addresses)
  const addAddress = useAddressStore((s) => s.addAddress)
  const updateAddress = useAddressStore((s) => s.updateAddress)
  const deleteAddress = useAddressStore((s) => s.deleteAddress)
  const setDefault = useAddressStore((s) => s.setDefault)

  const [formVisible, setFormVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [addressForm] = Form.useForm()

  /** 打开新增表单 */
  const openAdd = () => {
    setEditingId(null)
    addressForm.resetFields()
    addressForm.setFieldsValue(EMPTY_FORM)
    setFormVisible(true)
  }

  /** 打开编辑表单 */
  const openEdit = (addr) => {
    setEditingId(addr.id)
    addressForm.setFieldsValue({
      name: addr.name,
      phone: addr.phone,
      region: addr.region,
      detail: addr.detail,
      tag: addr.tag || '家',
      isDefault: addr.isDefault,
    })
    setFormVisible(true)
  }

  /** 提交表单 */
  const handleSubmit = async () => {
    try {
      const values = await addressForm.validateFields()
      if (editingId) {
        updateAddress(editingId, values)
        mallToast.success('地址已更新')
      } else {
        addAddress(values)
        mallToast.success('地址已添加')
      }
      setFormVisible(false)
    } catch {
      mallToast.info('请完善地址信息')
    }
  }

  /** 删除确认 */
  const handleDelete = (id) => {
    Dialog.confirm({
      content: '确定删除该地址吗？',
      confirmText: '删除',
      cancelText: '取消',
      onConfirm: () => {
        deleteAddress(id)
        mallToast.success('地址已删除')
      },
    })
  }

  /** 设置默认 */
  const handleSetDefault = (id) => {
    setDefault(id)
    mallToast.success('已设为默认地址')
  }

  const tagStyle = (tag) => {
    const c = ADDRESS_TAG_COLORS[tag] || ADDRESS_TAG_COLORS['其他']
    return `${c.bg} ${c.text} ${c.border}`
  }

  return (
    <div className="min-h-screen pb-20">
      <NavBar onBack={() => navigate(-1)} className="bg-white/90 backdrop-blur-md">
        收货地址
      </NavBar>

      <div className="mall-container pt-3 space-y-3">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <EnvironmentOutline fontSize={48} className="mb-3" />
            <p className="text-sm">暂无收货地址</p>
          </div>
        ) : (
          addresses.map((addr) => {
            const tagColors = tagStyle(addr.tag)
            return (
              <SwipeAction
                key={addr.id}
                rightActions={[
                  {
                    key: 'delete',
                    text: '删除',
                    color: 'danger',
                    onClick: () => handleDelete(addr.id),
                  },
                ]}
              >
                <div
                  className={`relative rounded-2xl bg-white border p-4 shadow-md active:bg-cream-50 transition-colors ${
                    addr.isDefault ? 'border-olive-300' : 'border-cream-200'
                  }`}
                  onClick={() => openEdit(addr)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-stone-800">{addr.name}</span>
                    <span className="text-xs text-stone-500">{addr.phone}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-olive-50 text-olive-600 border border-olive-200">
                        默认
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {addr.region} {addr.detail}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-cream-100">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tagColors}`}>
                      {addr.tag}
                    </span>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSetDefault(addr.id)
                        }}
                        className="text-xs text-olive-600 hover:text-olive-700 transition-colors"
                      >
                        设为默认
                      </button>
                    )}
                  </div>
                </div>
              </SwipeAction>
            )
          })
        )}
      </div>

      {/* 新增按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-cream-200 px-4 py-3 safe-bottom">
        <div className="mall-main">
          <Button
            block
            shape="rounded"
            onClick={openAdd}
            style={{ '--background': '#4a6340' }}
          >
            <AddOutline className="mr-1" />
            新增收货地址
          </Button>
        </div>
      </div>

      {/* 地址表单弹窗 */}
      <Popup
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        bodyStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: '60vh',
          padding: '20px 20px 32px',
        }}
      >
        <h3 className="text-lg font-semibold text-stone-800 mb-5">
          {editingId ? '编辑地址' : '新增地址'}
        </h3>

        <Form form={addressForm} layout="vertical" initialValues={EMPTY_FORM}>
          <Form.Item name="name" label="收货人" rules={ADDRESS_NAME_RULES}>
            <Input placeholder="请输入收货人姓名" maxLength={20} />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={ADDRESS_PHONE_RULES}>
            <Input placeholder="请输入手机号" maxLength={11} type="tel" />
          </Form.Item>
          <Form.Item name="region" label="所在地区" rules={ADDRESS_REGION_RULES}>
            <Input placeholder="如：上海市 浦东新区" />
          </Form.Item>
          <Form.Item name="detail" label="详细地址" rules={ADDRESS_DETAIL_RULES}>
            <Input placeholder="街道、楼栋、门牌号等" maxLength={120} />
          </Form.Item>
          <Form.Item name="tag" label="标签">
            <Radio.Group>
              <div className="flex gap-2">
                {ADDRESS_TAGS.map((tag) => (
                  <Radio key={tag} value={tag}>{tag}</Radio>
                ))}
              </div>
            </Radio.Group>
          </Form.Item>
        </Form>

        <Button
          block
          shape="rounded"
          onClick={handleSubmit}
          className="mt-4"
          style={{ '--background': '#4a6340' }}
        >
          {editingId ? '保存修改' : '添加地址'}
        </Button>
      </Popup>
    </div>
  )
}
