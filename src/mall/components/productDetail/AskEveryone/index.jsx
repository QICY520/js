import { RightOutline } from 'antd-mobile-icons'
import { DETAIL_COLORS } from '@/mall/constants/productDetail'

export default function AskEveryone({ qaList = [] }) {
  if (!qaList.length) return null

  return (
    <section className="bg-white px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold" style={{ color: DETAIL_COLORS.textMain }}>
          问大家
        </h3>
        <button type="button" className="flex items-center text-xs text-stone-400">
          查看全部 <RightOutline fontSize={12} />
        </button>
      </div>
      <div className="space-y-4">
        {qaList.map((item) => (
          <div key={item.id}>
            <div className="flex gap-2 items-start">
              <span className="shrink-0 w-5 h-5 rounded bg-[#FF5000] text-white text-[10px] font-bold flex items-center justify-center">
                问
              </span>
              <p className="text-sm font-medium flex-1" style={{ color: DETAIL_COLORS.textMain }}>
                {item.question}
              </p>
            </div>
            {item.answer && (
              <p className="text-xs mt-2 ml-7 leading-relaxed" style={{ color: DETAIL_COLORS.textSub }}>
                {item.answer}
                {item.answerCount > 1 && (
                  <span className="text-stone-400"> · {item.answerCount}个回答</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
