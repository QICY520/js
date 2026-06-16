import { useState, useEffect } from 'react'
import { Popup, Button, Input, CapsuleTabs } from 'antd-mobile'
import { CheckShieldOutline } from 'antd-mobile-icons'
import PayQrMock from '@/mall/components/order/PayQrMock'

const PAY_TYPES = [
  { key: 'qrcode', label: '扫码支付' },
  { key: 'password', label: '密码支付' },
]

export default function PayOrderPopup({
  visible,
  amount,
  paymentMethod = 'wechat',
  payExpired,
  payCountdown,
  paying,
  cancelling,
  onClose,
  onConfirmPay,
  onCancelPay,
}) {
  const [payType, setPayType] = useState('qrcode')
  const [payPassword, setPayPassword] = useState('')

  useEffect(() => {
    if (visible) {
      setPayType('qrcode')
      setPayPassword('')
    }
  }, [visible])

  const handleConfirm = () => {
    onConfirmPay?.({ payType, payPassword })
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={() => !paying && !cancelling && onClose?.()}
      bodyStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: '45vh',
        padding: '20px 20px 32px',
      }}
    >
      <h3 className="text-lg font-semibold text-center text-stone-800 mb-1">确认支付</h3>
      <p className="text-center text-2xl font-bold text-stone-900 mb-2">
        <span className="text-base">¥</span>
        {Number(amount).toFixed(2)}
      </p>
      <p className={`text-center text-sm mb-4 ${payExpired ? 'text-red-500 font-medium' : 'text-amber-600'}`}>
        {payExpired ? '支付已超时，请关闭后重新下单' : `请在 ${payCountdown} 内完成支付`}
      </p>

      <CapsuleTabs activeKey={payType} onChange={setPayType} className="mb-4">
        {PAY_TYPES.map((tab) => (
          <CapsuleTabs.Tab title={tab.label} key={tab.key} />
        ))}
      </CapsuleTabs>

      {payType === 'qrcode' ? (
        <div className="mb-4">
          <PayQrMock paymentMethod={paymentMethod} amount={amount} />
          <p className="text-center text-xs text-stone-400 -mt-2 mb-2">
            请使用{paymentMethod === 'alipay' ? '支付宝' : '微信'}扫码完成支付
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 p-4 mb-4">
          <div className="flex items-center gap-1 mb-2">
            <CheckShieldOutline fontSize={14} className="text-red-400" />
            <p className="text-xs text-stone-500">请输入 6 位支付密码</p>
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
      )}

      <div className="flex items-center justify-center gap-3 pt-1">
        {payType === 'password' && (
          <Button
            color="danger"
            shape="rounded"
            loading={paying}
            disabled={payExpired || cancelling}
            onClick={handleConfirm}
            className="!h-10 !px-6 !text-sm !rounded-xl !min-w-[108px]"
          >
            确认支付
          </Button>
        )}
        <Button
          fill="outline"
          shape="rounded"
          loading={cancelling}
          disabled={paying}
          onClick={onCancelPay}
          className="!h-10 !px-6 !text-sm !rounded-xl !min-w-[108px]"
        >
          取消支付
        </Button>
      </div>
      <p className="text-center text-xs text-stone-400 mt-4">支付即表示同意《用户购买协议》</p>
    </Popup>
  )
}
