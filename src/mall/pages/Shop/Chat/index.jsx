import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  LeftOutline,
  AudioOutline,
  SmileOutline,
  AddOutline,
} from 'antd-mobile-icons'
import { getChatMessages, sendChatMessage, getProductById } from '@/utils/api'
import ShopTabBar from '@/mall/components/shop/ShopTabBar'
import mallToast from '@/mall/utils/toast'

function TextBubble({ msg, shopLogo }) {
  const isUser = msg.sender === 'user'
  return (
    <div className={`flex gap-2 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <img src={shopLogo} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
      )}
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-olive-600 text-cream-50 rounded-tr-sm'
            : 'bg-white text-stone-800 rounded-tl-sm shadow-sm'
        }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

function ProductBubble({ msg, shopLogo }) {
  const navigate = useNavigate()
  const isUser = msg.sender === 'user'
  const product = msg.product

  return (
    <div className={`flex gap-2 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <img src={shopLogo} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
      )}
      <button
        type="button"
        onClick={() => product?.id && navigate(`/product/${product.id}`)}
        className={`max-w-[80%] bg-white rounded-xl overflow-hidden shadow-sm text-left ${
          isUser ? 'border border-olive-200' : ''
        }`}
      >
        <div className="flex gap-2 p-2">
          <img src={product?.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1 min-w-0 py-0.5">
            <p className="text-xs text-stone-700 line-clamp-2">{product?.title}</p>
            <p className="text-olive-700 font-bold text-sm mt-1">¥{product?.price}</p>
          </div>
        </div>
      </button>
    </div>
  )
}

export default function ShopChat() {
  const { shopId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const listRef = useRef(null)
  const [shop, setShop] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [consultProduct, setConsultProduct] = useState(location.state?.product || null)

  useEffect(() => {
    getChatMessages(shopId)
      .then((res) => {
        setShop(res.data.shop)
        setMessages(res.data.messages)
      })
      .catch(() => mallToast.fail('聊天加载失败'))
  }, [shopId])

  useEffect(() => {
    const productId = location.state?.productId
    if (productId && !consultProduct) {
      getProductById(productId)
        .then((res) => setConsultProduct(res.data))
        .catch(() => {})
    }
  }, [location.state, consultProduct])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSendText = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    try {
      const res = await sendChatMessage(shopId, { content: text, type: 'text' })
      setMessages(res.data.messages)
    } catch (err) {
      mallToast.fail(err.message || '发送失败')
    } finally {
      setSending(false)
    }
  }

  const handleSendProduct = async () => {
    if (!consultProduct || sending) return
    setSending(true)
    try {
      const res = await sendChatMessage(shopId, {
        type: 'product',
        content: consultProduct.title,
        product: {
          id: consultProduct.id,
          title: consultProduct.title,
          price: consultProduct.price,
          image: consultProduct.image,
        },
      })
      setMessages(res.data.messages)
      mallToast.success('商品已发送')
    } catch (err) {
      mallToast.fail(err.message || '发送失败')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 mall-main">
      <header className="bg-cream-50/95 backdrop-blur-md px-4 py-3 pt-safe flex items-center gap-3 border-b border-cream-200 shrink-0">
        <button type="button" onClick={() => navigate(-1)} className="text-stone-600">
          <LeftOutline fontSize={22} />
        </button>
        <img src={shop?.shopLogo} alt="" className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{shop?.shopName || '客服'}</p>
          <p className="text-[10px] text-stone-400">在线 · 通常几分钟内回复</p>
        </div>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4">
        {messages.map((msg) =>
          msg.type === 'product' ? (
            <ProductBubble key={msg.id} msg={msg} shopLogo={shop?.shopLogo} />
          ) : (
            <TextBubble key={msg.id} msg={msg} shopLogo={shop?.shopLogo} />
          ),
        )}
      </div>

      {consultProduct && (
        <div className="mx-3 mb-2 p-2 bg-white rounded-xl flex items-center gap-2 shadow-sm border border-cream-200">
          <img
            src={consultProduct.image}
            alt=""
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-600 line-clamp-1">当前咨询商品</p>
            <p className="text-xs font-medium truncate">{consultProduct.title}</p>
            <p className="text-olive-700 text-sm font-bold">¥{consultProduct.price}</p>
          </div>
          <button
            type="button"
            disabled={sending}
            onClick={handleSendProduct}
            className="shrink-0 px-3 py-1.5 rounded-full bg-olive-600 text-cream-50 text-xs font-medium"
          >
            发送商品
          </button>
        </div>
      )}

      <footer className="bg-[#F7F7F7] border-t border-stone-200 px-3 py-2 safe-bottom shrink-0">
        <div className="flex items-end gap-2">
          <button type="button" className="text-stone-500 p-1" aria-label="语音">
            <AudioOutline fontSize={24} />
          </button>
          <div className="flex-1 bg-white rounded-2xl px-3 py-2 min-h-[40px] flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="请输入消息..."
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>
          <button type="button" className="text-stone-500 p-1" aria-label="表情">
            <SmileOutline fontSize={24} />
          </button>
          <button type="button" className="text-stone-500 p-1" aria-label="更多">
            <AddOutline fontSize={24} />
          </button>
        </div>
      </footer>

      <ShopTabBar shopId={shopId} />
    </div>
  )
}
