import useToastStore from '@/mall/store/useToastStore'

/** 前台统一操作反馈（React 19 兼容，不依赖 antd-mobile 命令式 Toast） */
export const mallToast = {
  success(content, duration = 2000) {
    useToastStore.getState().show('success', content, duration)
  },

  fail(content, duration = 2500) {
    useToastStore.getState().show('fail', content, duration)
  },

  info(content, duration = 2000) {
    useToastStore.getState().show('info', content, duration)
  },

  loading(content = '处理中…') {
    useToastStore.getState().show('loading', content, 0)
  },

  clear() {
    useToastStore.getState().hide()
  },
}

export default mallToast
