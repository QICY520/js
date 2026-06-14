import { memo } from 'react'
import { PAYMENT_LABELS, PAY_QR_CODE_URL } from '@/mall/constants/order'

/** 支付二维码展示（使用 public/pay-qrcode.jpg） */
function PayQrMock({ paymentMethod = 'wechat', amount }) {
  const label = PAYMENT_LABELS[paymentMethod] || '扫码支付'
  const accent = paymentMethod === 'alipay' ? '#1677ff' : '#07c160'

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div
        className="relative w-40 h-40 rounded-2xl border-2 bg-white p-2 shadow-inner overflow-hidden"
        style={{ borderColor: `${accent}33` }}
      >
        <img
          src={PAY_QR_CODE_URL}
          alt={`${label}收款码`}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <p className="text-xs text-stone-500">{label} · 请扫码或输入密码完成支付</p>
      {amount != null && (
        <p className="text-sm font-semibold text-stone-800">
          应付 ¥{Number(amount).toFixed(2)}
        </p>
      )}
    </div>
  )
}

export default memo(PayQrMock)
