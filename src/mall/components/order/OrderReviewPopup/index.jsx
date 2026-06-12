import { useState } from 'react'
import { Popup, Rate, TextArea, Button } from 'antd-mobile'
import useUserStore from '@/mall/store/useUserStore'
import useOrderStore from '@/mall/store/useOrderStore'
import { submitOrderReview } from '@/utils/api'
import { normalizeOrder } from '@/mall/constants/order'
import mallToast from '@/mall/utils/toast'

export default function OrderReviewPopup({ order, visible, onClose }) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const addReview = useUserStore((s) => s.addReview)
  const updateOrder = useOrderStore((s) => s.updateOrder)

  const item = order?.items?.[0]

  const handleClose = () => {
    setRating(5)
    setContent('')
    onClose?.()
  }

  const handleSubmit = async () => {
    if (!order || !item) return
    if (!content.trim()) {
      mallToast.fail('请填写评价内容')
      return
    }
    setSubmitting(true)
    try {
      const res = await submitOrderReview(order.id, {
        rating,
        content: content.trim(),
        productId: item.productId,
      })
      const normalized = normalizeOrder(res.data)
      updateOrder(normalized)
      addReview({
        orderId: order.id,
        productId: item.productId,
        productTitle: item.title,
        productImage: item.image,
        rating,
        content: content.trim(),
        createTime: normalized.review?.createTime || new Date().toLocaleString('zh-CN'),
      })
      mallToast.success('评价成功')
      handleClose()
    } catch (err) {
      mallToast.fail(err.message || '评价失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (!item) return null

  return (
    <Popup visible={visible} onMaskClick={handleClose} bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <div className="p-4 pb-6">
        <h3 className="text-base font-semibold text-stone-800 mb-3">评价商品</h3>
        <div className="flex gap-3 mb-4">
          <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
          <p className="text-sm text-stone-700 line-clamp-2 flex-1">{item.title}</p>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-stone-500">评分</span>
          <Rate value={rating} onChange={setRating} />
        </div>
        <TextArea
          placeholder="说说你的使用感受吧～"
          value={content}
          onChange={setContent}
          rows={4}
          maxLength={200}
          showCount
        />
        <Button
          block
          color="primary"
          shape="rounded"
          loading={submitting}
          onClick={handleSubmit}
          className="mt-4"
          style={{ '--background': '#4a6340' }}
        >
          提交评价
        </Button>
      </div>
    </Popup>
  )
}
