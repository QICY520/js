import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NavBar,
  Image,
  Radio,
  Button,
  Popup,
  Input,
  SpinLoading,
  Form,
  Dialog,
} from 'antd-mobile'
import {
  EnvironmentOutline,
  AlipayCircleFill,
  PayCircleOutline,
  RightOutline,
  AddOutline,
  CheckShieldOutline,
} from 'antd-mobile-icons'
import useCartStore from '@/mall/store/useCartStore'
import useOrderStore from '@/mall/store/useOrderStore'
import useAddressStore from '@/mall/store/useAddressStore'
import { createOrder, payOrder } from '@/utils/api'
import { normalizeOrder } from '@/mall/constants/order'
import { ADDRESS_TAGS, ADDRESS_TAG_COLORS } from '@/mall/constants/address'
import mallToast from '@/mall/utils/toast'

const PAYMENT_METHODS = [
  { value: 'wechat', label: '微信支付', icon: PayCircleOutline, color: '#07c160' },
  { value: 'alipay', label: '支付宝', icon: AlipayCircleFill, color: '#1677ff' },
]

const EMPTY_FORM = { name: '', phone: '', region: '', detail: '', tag: '家' }

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const getSelectedItems = useCartStore((s) => s.getSelectedItems)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const removeSelected = useCartStore((s) => s.removeSelected)
  const addOrder = useOrderStore((s) => s.addOrder)
  const addresses = useAddressStore((s) => s.addresses)
  const addAddress = useAddressStore((s) => s.addAddress)
  const updateAddress = useAddressStore((s) => s.updateAddress)
  const setDefaultAddress = useAddressStore((s) => s.setDefault)

  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('wechat')
  const [payPopupVisible, setPayPopupVisible] = useState(false)
  const [pendingOrder, setPendingOrder] = useState(null)
  const [payPassword, setPayPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(false)

  // 地址相关弹窗
  const [addressListVisible, setAddressListVisible] = useState(false)
  const [addressFormVisible, setAddressFormVisible] = useState(false)
  const [editingAddrId, setEditingAddrId] = useState(null)
  const [addressForm, setAddressForm] = useState(EMPTY_FORM)

  const selectedItems = getSelectedItems()
  const totalPrice = getTotalPrice()

  /** 当前选中的地址（默认地址兜底） */
  const selectedAddress = useMemo(() => {
    if (selectedAddressId) {
      return addresses.find((a) => a.id === selectedAddressId) || null
    }
    return addresses.find((a) => a.isDefault) || addresses[0] || null
  }, [addresses, selectedAddressId])

  /** 初始化选中地址 */
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0]
      setSelectedAddressId(def?.id || null)
    }
  }, [addresses, selectedAddressId])

  useEffect(() => {
    if (selectedItems.length === 0 && !pendingOrder) {
      mallToast.info('请先选择要结算的商品')
      navigate('/cart', { replace: true })
    }
  }, [selectedItems.length, pendingOrder, navigate])

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      mallToast.info('请选择收货地址')
      return
    }
    setSubmitting(true)
    mallToast.loading('订单创建中...')
    try {
      const addressStr = `${selectedAddress.name} ${selectedAddress.phone} ${selectedAddress.region} ${selectedAddress.detail}`
      const res = await createOrder({
        address: addressStr,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
      mallToast.clear()
      mallToast.success('订单创建成功，请完成支付')
      setPendingOrder(res.data)
      setPayPopupVisible(true)
    } catch (err) {
      mallToast.clear()
      if (err.message?.includes('登录') || err.code === 401) {
        mallToast.fail('登录已失效，请重新登录')
        setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 800)
      } else {
        mallToast.fail(err.message || '创建订单失败')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmPay = async () => {
    if (!pendingOrder) return

    // 强制校验支付密码
    if (!payPassword || payPassword.trim() === '') {
      mallToast.fail('请输入支付密码')
      return
    }
    if (payPassword !== '123456') {
      mallToast.fail('支付密码错误')
      return
    }

    setPaying(true)
    mallToast.loading('支付处理中...')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const payRes = await payOrder(pendingOrder.id, { paymentMethod })
      const paidOrder = normalizeOrder(payRes.data)

      addOrder(paidOrder)
      removeSelected()
      mallToast.clear()
      setPayPopupVisible(false)
      mallToast.success('支付成功！')

      setTimeout(() => {
        navigate(`/pay/success/${pendingOrder.id}`, {
          replace: true,
          state: { paymentMethod, fromPayment: true },
        })
      }, 500)
    } catch (err) {
      mallToast.clear()
      if (err.message?.includes('登录') || err.code === 401) {
        mallToast.fail('登录已失效，请重新登录')
        setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 800)
      } else {
        mallToast.fail(err.message || '支付失败')
      }
    } finally {
      setPaying(false)
    }
  }

  /** 打开添加地址表单 */
  const openAddForm = () => {
    setEditingAddrId(null)
    setAddressForm(EMPTY_FORM)
    setAddressFormVisible(true)
  }

  /** 打开编辑地址表单 */
  const openEditForm = (addr) => {
    setEditingAddrId(addr.id)
    setAddressForm({
      name: addr.name,
      phone: addr.phone,
      region: addr.region,
      detail: addr.detail,
      tag: addr.tag || '家',
    })
    setAddressFormVisible(true)
  }

  /** 提交地址表单 */
  const handleAddressFormSubmit = () => {
    const { name, phone, region, detail } = addressForm
    if (!name || name.length < 2) { mallToast.fail('收货人姓名至少 2 位'); return }
    if (!/^1[3-9]\d{9}$/.test(phone)) { mallToast.fail('请输入正确的手机号'); return }
    if (!region) { mallToast.fail('请填写所在地区'); return }
    if (!detail || detail.length < 5) { mallToast.fail('详细地址至少 5 个字'); return }

    if (editingAddrId) {
      updateAddress(editingAddrId, addressForm)
      mallToast.success('地址已更新')
    } else {
      addAddress({ ...addressForm, isDefault: addresses.length === 0 })
      mallToast.success('地址已添加')
    }
    setAddressFormVisible(false)
  }

  /** 选中地址并关闭列表 */
  const selectAddress = (id) => {
    setSelectedAddressId(id)
    setDefaultAddress(id)
    setAddressListVisible(false)
  }

  const tagStyle = (tag) => {
    const c = ADDRESS_TAG_COLORS[tag] || ADDRESS_TAG_COLORS['其他']
    return `${c.bg} ${c.text}`
  }

  if (selectedItems.length === 0 && !pendingOrder) return null

  const displayItems = pendingOrder?.items || selectedItems.map((i) => ({
    productId: i.productId,
    title: i.title,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
  }))
  const displayTotal = pendingOrder?.totalPrice ?? totalPrice

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <NavBar onBack={() => navigate(-1)} className="bg-white/90 backdrop-blur-md">
        确认下单
      </NavBar>

      <div className="max-w-lg mx-auto px-4 space-y-4 pt-3">
        {/* 地址选择区 */}
        <section
          className="rounded-2xl bg-white p-4 shadow-sm flex items-center gap-3 active:bg-cream-50 transition-colors"
          role="button"
          onClick={() => setAddressListVisible(true)}
        >
          <EnvironmentOutline fontSize={22} className="text-olive-600 shrink-0" />
          {selectedAddress ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-800">{selectedAddress.name}</span>
                <span className="text-xs text-stone-500">{selectedAddress.phone}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tagStyle(selectedAddress.tag)}`}>
                  {selectedAddress.tag}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 truncate">
                {selectedAddress.region} {selectedAddress.detail}
              </p>
            </div>
          ) : (
            <div className="flex-1 text-sm text-stone-400">请选择收货地址</div>
          )}
          <RightOutline className="text-stone-300 shrink-0" />
        </section>

        {/* 商品清单 */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-800 mb-3">商品清单</h3>
          <div className="space-y-3">
            {displayItems.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <Image src={item.image} width={72} height={72} fit="cover" className="rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-700 line-clamp-2">{item.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-olive-700 font-bold">¥{item.price}</span>
                    <span className="text-xs text-stone-400">×{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 支付方式 */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-800 mb-3">支付方式</h3>
          <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ value, label, icon: Icon, color }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                    paymentMethod === value ? 'bg-gray-50 border border-cream-300' : ''
                  }`}
                >
                  <Radio value={value} />
                  <Icon fontSize={22} style={{ color }} />
                  <span className="text-sm text-stone-700">{label}</span>
                </label>
              ))}
            </div>
          </Radio.Group>
        </section>
      </div>

      {/* 底部结算栏 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 px-4 py-3 safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="flex-1">
            <span className="text-xs text-stone-500">合计 </span>
            <span className="text-xl font-bold text-stone-900">
              <span className="text-sm">¥</span>
              {Number(displayTotal).toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            disabled={submitting || !!pendingOrder}
            onClick={handleSubmitOrder}
            className="px-8 py-3 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-500/30 disabled:opacity-60 transition-colors"
          >
            {submitting ? '提交中…' : pendingOrder ? '待支付' : '提交订单'}
          </button>
        </div>
      </footer>

      {/* 支付半屏弹窗 */}
      <Popup
        visible={payPopupVisible}
        onMaskClick={() => !paying && setPayPopupVisible(false)}
        bodyStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: '45vh',
          padding: '20px 20px 32px',
        }}
      >
        <h3 className="text-lg font-semibold text-center text-stone-800 mb-1">确认支付</h3>
        <p className="text-center text-2xl font-bold text-stone-900 mb-6">
          <span className="text-base">¥</span>
          {Number(displayTotal).toFixed(2)}
        </p>

        <div className="rounded-2xl bg-gray-50 p-4 mb-4">
          <div className="flex items-center gap-1 mb-2">
            <CheckShieldOutline fontSize={14} className="text-red-400" />
            <p className="text-xs text-stone-500">请输入支付密码（测试密码：123456）</p>
          </div>
          <Input
            type="password"
            placeholder="请输入 6 位支付密码"
            value={payPassword}
            onChange={setPayPassword}
            maxLength={6}
            className="bg-white rounded-xl"
          />
        </div>

        <Button
          block
          color="danger"
          shape="rounded"
          size="large"
          loading={paying}
          onClick={handleConfirmPay}
          className="!rounded-full"
        >
          确认支付
        </Button>
        <p className="text-center text-xs text-stone-400 mt-4">支付即表示同意《用户购买协议》</p>
      </Popup>

      {/* 地址选择弹窗 */}
      <Popup
        visible={addressListVisible}
        onClose={() => setAddressListVisible(false)}
        bodyStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: '50vh',
          padding: '20px 20px 32px',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stone-800">选择收货地址</h3>
          <Button size="mini" shape="rounded" onClick={openAddForm}>
            <AddOutline fontSize={14} className="mr-1" />
            新增
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            暂无地址，请点击新增
          </div>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`rounded-xl border p-3 active:bg-cream-50 transition-colors ${
                  (selectedAddressId || addresses.find((a) => a.isDefault)?.id) === addr.id
                    ? 'border-olive-400 bg-olive-50/50'
                    : 'border-cream-200'
                }`}
                role="button"
                onClick={() => selectAddress(addr.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-stone-800">{addr.name}</span>
                  <span className="text-xs text-stone-500">{addr.phone}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tagStyle(addr.tag)}`}>
                    {addr.tag}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-olive-50 text-olive-600 border border-olive-200">
                      默认
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {addr.region} {addr.detail}
                </p>
                <div className="flex gap-2 mt-2 pt-2 border-t border-cream-100">
                  <button
                    type="button"
                    className="text-xs text-olive-600"
                    onClick={(e) => { e.stopPropagation(); openEditForm(addr) }}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="text-xs text-stone-400"
                    onClick={(e) => { e.stopPropagation(); selectAddress(addr.id) }}
                  >
                    选择此地址
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Popup>

      {/* 地址编辑弹窗 */}
      <Popup
        visible={addressFormVisible}
        onClose={() => setAddressFormVisible(false)}
        bodyStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: '60vh',
          padding: '20px 20px 32px',
        }}
      >
        <h3 className="text-lg font-semibold text-stone-800 mb-5">
          {editingAddrId ? '编辑地址' : '新增地址'}
        </h3>

        <Form layout="vertical">
          <Form.Item label="收货人" required>
            <Input
              placeholder="请输入收货人姓名"
              value={addressForm.name}
              onChange={(v) => setAddressForm((f) => ({ ...f, name: v }))}
              maxLength={20}
            />
          </Form.Item>
          <Form.Item label="手机号" required>
            <Input
              placeholder="请输入手机号"
              value={addressForm.phone}
              onChange={(v) => setAddressForm((f) => ({ ...f, phone: v }))}
              maxLength={11}
              type="tel"
            />
          </Form.Item>
          <Form.Item label="所在地区" required>
            <Input
              placeholder="如：上海市 浦东新区"
              value={addressForm.region}
              onChange={(v) => setAddressForm((f) => ({ ...f, region: v }))}
            />
          </Form.Item>
          <Form.Item label="详细地址" required>
            <Input
              placeholder="街道、楼栋、门牌号等"
              value={addressForm.detail}
              onChange={(v) => setAddressForm((f) => ({ ...f, detail: v }))}
              maxLength={120}
            />
          </Form.Item>
          <Form.Item label="标签">
            <Radio.Group
              value={addressForm.tag}
              onChange={(v) => setAddressForm((f) => ({ ...f, tag: v }))}
            >
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
          onClick={handleAddressFormSubmit}
          className="mt-4"
          style={{ '--background': '#4a6340' }}
        >
          {editingAddrId ? '保存修改' : '添加地址'}
        </Button>
      </Popup>

      {paying && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
          <SpinLoading color="white" style={{ '--size': '48px' }} />
        </div>
      )}
    </div>
  )
}
