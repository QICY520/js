import useCountdown from '@/mall/hooks/useCountdown'

export default function PromotionBar({ promotion }) {
  if (!promotion) return null

  const { hours, minutes, seconds, finished } = useCountdown(promotion.endTime)

  return (
    <div
      className="flex items-center justify-between px-4 py-2 text-white text-xs"
      style={{ background: 'linear-gradient(90deg, #FF5000 0%, #FF2D20 100%)' }}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm">{promotion.title || '618品类周'}</span>
        <span className="opacity-90">{promotion.label || '热销爆款'}</span>
      </div>
      {!finished ? (
        <span className="font-mono tabular-nums opacity-95">
          距结束 {hours}:{minutes}:{seconds}
        </span>
      ) : (
        <span className="opacity-80">活动已结束</span>
      )}
    </div>
  )
}
