import { CheckOutline, CloseOutline } from 'antd-mobile-icons'
import { SpinLoading } from 'antd-mobile'
import useToastStore from '@/mall/store/useToastStore'

const ICON_MAP = {
  success: { Icon: CheckOutline, className: 'text-emerald-400' },
  fail: { Icon: CloseOutline, className: 'text-red-400' },
  info: { Icon: null, className: '' },
  loading: { Icon: null, className: '', spin: true },
}

export default function MallToastHost() {
  const visible = useToastStore((s) => s.visible)
  const type = useToastStore((s) => s.type)
  const message = useToastStore((s) => s.message)

  if (!visible) return null

  const { Icon, className, spin } = ICON_MAP[type] || ICON_MAP.info

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none px-6"
      role="alert"
      aria-live="polite"
    >
      <div className="min-w-[140px] max-w-[280px] px-5 py-4 rounded-2xl bg-stone-900/88 backdrop-blur-md text-cream-50 text-center shadow-2xl shadow-stone-900/30 animate-toast-in">
        {spin && <SpinLoading color="white" className="mx-auto" style={{ '--size': '36px' }} />}
        {Icon && !spin && (
          <Icon fontSize={36} className={`mx-auto ${className}`} />
        )}
        <p className={`text-sm leading-relaxed ${Icon || spin ? 'mt-2' : ''}`}>{message}</p>
      </div>
    </div>
  )
}
