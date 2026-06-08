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
