/** 密码：至少 6 位，且同时包含字母和数字 */
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*._-]{6,}$/

export const PASSWORD_RULE = {
  pattern: PASSWORD_REGEX,
  message: '密码至少 6 位，且需同时包含字母和数字',
}

export const USERNAME_RULES = [
  { required: true, message: '请输入用户名' },
  { min: 3, max: 20, message: '用户名长度为 3-20 个字符' },
  { pattern: /^[a-zA-Z0-9_]+$/, message: '仅支持字母、数字、下划线' },
]

export const LOGIN_PASSWORD_RULES = [
  { required: true, message: '请输入密码' },
  { min: 6, message: '密码至少 6 位' },
]

export const ADDRESS_NAME_RULES = [
  { required: true, message: '请输入收货人姓名' },
  { min: 2, max: 20, message: '收货人姓名 2-20 位' },
]

export const ADDRESS_PHONE_RULES = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
]

export const ADDRESS_REGION_RULES = [
  { required: true, message: '请填写所在地区' },
  { min: 2, message: '地区至少 2 个字' },
]

export const ADDRESS_DETAIL_RULES = [
  { required: true, message: '请填写详细地址' },
  { min: 5, max: 120, message: '详细地址 5-120 字' },
]

export const PRODUCT_TITLE_RULES = [
  { required: true, message: '请输入商品名称' },
  { min: 2, max: 50, message: '商品名称 2-50 字' },
]

export const PRODUCT_PRICE_RULES = [
  { required: true, message: '请输入价格' },
  {
    validator: (_, value) => {
      if (value == null || value === '') {
        return Promise.reject(new Error('请输入价格'))
      }
      if (Number(value) <= 0) {
        return Promise.reject(new Error('价格必须大于 0'))
      }
      return Promise.resolve()
    },
  },
]

export const PRODUCT_STOCK_RULES = [
  { required: true, message: '请输入库存' },
  {
    validator: (_, value) => {
      if (value == null || value === '') {
        return Promise.reject(new Error('请输入库存'))
      }
      const num = Number(value)
      if (!Number.isInteger(num) || num < 0) {
        return Promise.reject(new Error('库存为非负整数'))
      }
      return Promise.resolve()
    },
  },
]

export const IMAGE_URL_RULES = [
  { required: true, message: '请输入图片地址' },
  { type: 'url', message: '请输入有效的 http/https 链接' },
]

export const TEXT_REQUIRED_RULES = (label, min = 2, max = 200) => [
  { required: true, message: `请输入${label}` },
  { min, max, message: `${label} ${min}-${max} 字` },
]

export function validatePassword(password) {
  if (!password || password.length < 6) {
    return '密码至少 6 位'
  }
  if (!/[A-Za-z]/.test(password)) {
    return '密码需包含字母'
  }
  if (!/\d/.test(password)) {
    return '密码需包含数字'
  }
  return null
}

export function validatePhone(phone) {
  if (!phone) {
    return '请输入手机号'
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return '请输入正确的手机号'
  }
  return null
}
