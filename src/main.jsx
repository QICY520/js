import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { unstableSetRender } from 'antd-mobile'
import router from '@/router'
import '@/mock'
import 'antd-mobile/bundle/style.css'
import '@/index.css'

// 迁移旧版共用 token，避免前后台冲突
if (localStorage.getItem('token') && !localStorage.getItem('mall-token')) {
  localStorage.removeItem('token')
}

// React 19 兼容：修复 antd-mobile 命令式组件（Dialog、Mask 等）
unstableSetRender((node, container) => {
  container._reactRoot ||= createRoot(container)
  const root = container._reactRoot
  root.render(node)
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    root.unmount()
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
