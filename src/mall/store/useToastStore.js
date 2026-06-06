import { create } from 'zustand'

let timer = null

const useToastStore = create((set) => ({
  visible: false,
  type: 'success',
  message: '',

  show(type, message, duration = 2000) {
    if (timer) clearTimeout(timer)
    set({ visible: true, type, message })
    if (duration > 0) {
      timer = setTimeout(() => set({ visible: false }), duration)
    }
  },

  hide() {
    if (timer) clearTimeout(timer)
    set({ visible: false })
  },
}))

export default useToastStore
