import { Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

export default function EmptyState({ description = '暂无内容', actionLabel = '去逛逛' }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center py-12 px-6">
      <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center text-3xl mb-4">
        🛍️
      </div>
      <p className="text-sm text-stone-400 mb-4">{description}</p>
      <Button
        color="primary"
        shape="rounded"
        size="small"
        onClick={() => navigate('/')}
        className="transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
        style={{ '--background': '#4a6340' }}
      >
        {actionLabel}
      </Button>
    </div>
  )
}
