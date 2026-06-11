import useCountdown from '@/mall/hooks/useCountdown'

export default function PromoBanner({ title = '官方立减', endTime }) {
  const { hours, minutes, seconds, finished } = useCountdown(endTime)

  return (
    <section className="mx-4 mt-3">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-olive-50/80 border border-olive-100 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] text-olive-600/80 tracking-wide">限时活动</p>
          <p className="text-sm font-medium text-olive-800 truncate">{title}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] text-stone-400 mb-0.5">{finished ? '已结束' : '剩余'}</p>
          <div className="flex items-center gap-0.5 font-mono text-xs text-olive-700">
            <span className="bg-white/80 px-1 py-0.5 rounded">{hours}</span>
            <span className="text-stone-300">:</span>
            <span className="bg-white/80 px-1 py-0.5 rounded">{minutes}</span>
            <span className="text-stone-300">:</span>
            <span className="bg-white/80 px-1 py-0.5 rounded">{seconds}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
